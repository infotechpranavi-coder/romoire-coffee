import dbConnect from '../../lib/mongodb';
import Settings from '../../models/Settings';
import Package from '../../models/Package';
import { PACKAGE_NAV_GROUPS, getCategoryBySlug, getCategoryMatchValues } from '../../lib/packageExperienceCategories';
import {
  buildNavGroupsFromCatalog,
  getCategoryCatalogFromSettings,
  slugifyCategoryName,
  isCustomGroup,
  isCustomSubcategory,
  isCustomMiniCategory,
  getAllCategorySlugs,
  getAllMiniSlugs,
  getMiniCategoryBySlugFromCatalog,
} from '../../lib/categoryCatalog';
import { applyCategoryLabelOverrides, getCategoryLabelOverridesFromSettings } from '../../lib/resolveCategoryLabels';

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  if (!settings.groupLabelOverrides) settings.groupLabelOverrides = {};
  if (!settings.categoryLabelOverrides) settings.categoryLabelOverrides = {};
  if (!settings.customGroups) settings.customGroups = [];
  if (!settings.customSubcategories) settings.customSubcategories = [];
  if (!settings.customMiniCategories) settings.customMiniCategories = [];
  if (!settings.miniCategoryLabelOverrides) settings.miniCategoryLabelOverrides = {};
  if (!settings.hiddenGroups) settings.hiddenGroups = [];
  if (!settings.hiddenSubcategories) settings.hiddenSubcategories = [];
  if (!settings.hiddenMiniCategories) settings.hiddenMiniCategories = [];
  return settings;
}

function buildResponse(settings) {
  const catalog = getCategoryLabelOverridesFromSettings(settings);
  return {
    overrides: {
      groupLabels: catalog.groupLabels,
      categoryLabels: catalog.categoryLabels,
    },
    catalog,
    navGroups: buildNavGroupsFromCatalog(catalog),
  };
}

function ensureUniqueSlug(baseSlug, existingSlugs) {
  let slug = baseSlug;
  let counter = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

async function saveSettings(settings) {
  settings.markModified('groupLabelOverrides');
  settings.markModified('categoryLabelOverrides');
  settings.markModified('customGroups');
  settings.markModified('customSubcategories');
  return settings.save();
}

async function updateSettingsById(id, setFields) {
  return Settings.findByIdAndUpdate(
    id,
    { $set: setFields },
    { new: true, runValidators: true }
  );
}

async function renameCategoryPackages(oldValues, newLabel) {
  const packages = await Package.find({ packageCategory: { $exists: true, $ne: '' } });
  for (const pkg of packages) {
    if (oldValues.has(String(pkg.packageCategory).toLowerCase())) {
      pkg.packageCategory = newLabel;
      await pkg.save();
    }
  }
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const settings = await getOrCreateSettings();
      res.status(200).json({ success: true, data: buildResponse(settings) });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { type, slug, label } = req.body ?? {};
      const trimmedLabel = typeof label === 'string' ? label.trim() : '';

      if (!type || !slug || !trimmedLabel) {
        return res.status(400).json({
          success: false,
          error: 'type, slug, and label are required',
        });
      }

      const settings = await getOrCreateSettings();
      const catalog = getCategoryCatalogFromSettings(settings);

      if (type === 'group') {
        let refreshed;

        if (isCustomGroup(slug, catalog)) {
          const customGroups = (settings.customGroups || []).map((group) =>
            group.slug === slug ? { ...group, label: trimmedLabel } : group
          );
          refreshed = await updateSettingsById(settings._id, { customGroups });
        } else {
          const group = PACKAGE_NAV_GROUPS.find((item) => item.slug === slug);
          if (!group) {
            return res.status(404).json({ success: false, error: 'Experience type not found' });
          }
          refreshed = await updateSettingsById(settings._id, {
            [`groupLabelOverrides.${slug}`]: trimmedLabel,
          });
        }

        if (!refreshed) {
          return res.status(500).json({ success: false, error: 'Failed to save category name' });
        }

        res.status(200).json({ success: true, data: buildResponse(refreshed) });
      } else if (type === 'category') {
        let refreshed;

        if (isCustomSubcategory(slug, catalog)) {
          const previous = (settings.customSubcategories || []).find((sub) => sub.slug === slug);
          const customSubcategories = (settings.customSubcategories || []).map((sub) =>
            sub.slug === slug ? { ...sub, label: trimmedLabel } : sub
          );
          refreshed = await updateSettingsById(settings._id, { customSubcategories });
          if (previous?.label) {
            await renameCategoryPackages(new Set([previous.label.toLowerCase()]), trimmedLabel);
          }
        } else {
          const category = getCategoryBySlug(slug);
          if (!category) {
            return res.status(404).json({ success: false, error: 'Experience page not found' });
          }

          const previousResolved = applyCategoryLabelOverrides(
            getCategoryLabelOverridesFromSettings(settings)
          )
            .flatMap((group) => group.items)
            .find((item) => item.slug === slug);

          const oldValues = new Set(
            getCategoryMatchValues(category).map((value) => value.toLowerCase())
          );
          if (previousResolved?.value) {
            oldValues.add(previousResolved.value.toLowerCase());
          }

          refreshed = await updateSettingsById(settings._id, {
            [`categoryLabelOverrides.${slug}`]: trimmedLabel,
          });
          await renameCategoryPackages(oldValues, trimmedLabel);
        }

        if (!refreshed) {
          return res.status(500).json({ success: false, error: 'Failed to save subcategory name' });
        }

        res.status(200).json({ success: true, data: buildResponse(refreshed) });
      } else if (type === 'mini') {
        let refreshed;

        if (isCustomMiniCategory(slug, catalog)) {
          const previous = (settings.customMiniCategories || []).find((mini) => mini.slug === slug);
          const customMiniCategories = (settings.customMiniCategories || []).map((mini) =>
            mini.slug === slug ? { ...mini, label: trimmedLabel } : mini
          );
          refreshed = await updateSettingsById(settings._id, { customMiniCategories });
          if (previous?.label) {
            await Package.updateMany(
              { packageMiniCategory: { $regex: new RegExp(`^${previous.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
              { $set: { packageMiniCategory: trimmedLabel } }
            );
          }
        } else {
          refreshed = await updateSettingsById(settings._id, {
            [`miniCategoryLabelOverrides.${slug}`]: trimmedLabel,
          });
        }

        if (!refreshed) {
          return res.status(500).json({ success: false, error: 'Failed to save mini category name' });
        }

        res.status(200).json({ success: true, data: buildResponse(refreshed) });
      } else {
        return res.status(400).json({ success: false, error: 'Invalid type' });
      }
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const { action } = req.body ?? {};
      const settings = await getOrCreateSettings();
      const catalog = getCategoryCatalogFromSettings(settings);
      const allSlugs = getAllCategorySlugs(catalog);
      const groupSlugs = new Set([
        ...PACKAGE_NAV_GROUPS.map((g) => g.slug),
        ...(catalog.customGroups ?? []).map((g) => g.slug),
      ]);

      let refreshed = settings;

      if (action === 'addGroup') {
        const label = String(req.body.label || '').trim();
        if (!label) {
          return res.status(400).json({ success: false, error: 'Label is required' });
        }
        const baseSlug = slugifyCategoryName(label);
        const slug = ensureUniqueSlug(baseSlug, groupSlugs);
        refreshed = await updateSettingsById(settings._id, {
          customGroups: [...(settings.customGroups || []), { slug, label }],
        });
      } else if (action === 'addSubcategory') {
        const label = String(req.body.label || '').trim();
        const groupSlug = String(req.body.groupSlug || '').trim();
        const heroSubtitle = String(req.body.heroSubtitle || '').trim();
        const isFuture = Boolean(req.body.isFuture);

        if (!label || !groupSlug) {
          return res.status(400).json({ success: false, error: 'Label and groupSlug are required' });
        }
        if (!groupSlugs.has(groupSlug)) {
          return res.status(404).json({ success: false, error: 'Experience type not found' });
        }

        const baseSlug = slugifyCategoryName(label);
        const slug = ensureUniqueSlug(baseSlug, allSlugs);
        refreshed = await updateSettingsById(settings._id, {
          customSubcategories: [
            ...(settings.customSubcategories || []),
            {
              slug,
              label,
              groupSlug,
              heroSubtitle: heroSubtitle || undefined,
              isFuture,
            },
          ],
        });
      } else if (action === 'updateSubcategory') {
        const slug = String(req.body.slug || '').trim();
        const label = String(req.body.label || '').trim();
        const heroSubtitle = String(req.body.heroSubtitle || '').trim();
        const isFuture = Boolean(req.body.isFuture);

        if (!slug || !label) {
          return res.status(400).json({ success: false, error: 'slug and label are required' });
        }

        if (isCustomSubcategory(slug, catalog)) {
          const previous = (settings.customSubcategories || []).find((sub) => sub.slug === slug);
          refreshed = await updateSettingsById(settings._id, {
            customSubcategories: (settings.customSubcategories || []).map((sub) =>
              sub.slug === slug
                ? {
                    ...sub,
                    label,
                    heroSubtitle: heroSubtitle || undefined,
                    isFuture,
                  }
                : sub
            ),
          });
          if (previous?.label) {
            await renameCategoryPackages(new Set([previous.label.toLowerCase()]), label);
          }
        } else {
          const category = getCategoryBySlug(slug);
          if (!category) {
            return res.status(404).json({ success: false, error: 'Experience page not found' });
          }

          const previousResolved = buildNavGroupsFromCatalog(catalog)
            .flatMap((group) => group.items)
            .find((item) => item.slug === slug);

          const oldValues = new Set(
            getCategoryMatchValues(category).map((value) => value.toLowerCase())
          );
          if (previousResolved?.value) {
            oldValues.add(previousResolved.value.toLowerCase());
          }

          refreshed = await updateSettingsById(settings._id, {
            [`categoryLabelOverrides.${slug}`]: label,
          });
          await renameCategoryPackages(oldValues, label);
        }
      } else if (action === 'deleteGroup') {
        const slug = String(req.body.slug || '').trim();
        const navGroups = buildNavGroupsFromCatalog(catalog);
        const group = navGroups.find((item) => item.slug === slug);

        if (!group) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }

        for (const sub of group.items) {
          const count = await Package.countDocuments({
            packageCategory: { $regex: new RegExp(`^${String(sub.value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          });
          if (count > 0) {
            return res.status(400).json({
              success: false,
              error: `Cannot delete "${group.label}" — packages are still assigned to "${sub.label}"`,
            });
          }
        }

        const update = {
          customGroups: (settings.customGroups || []).filter((item) => item.slug !== slug),
          customSubcategories: (settings.customSubcategories || []).filter(
            (sub) => sub.groupSlug !== slug
          ),
          customMiniCategories: (settings.customMiniCategories || []).filter(
            (mini) => mini.groupSlug !== slug
          ),
        };

        if (!isCustomGroup(slug, catalog)) {
          update.hiddenGroups = [...new Set([...(settings.hiddenGroups || []), slug])];
          update.hiddenSubcategories = [
            ...new Set([
              ...(settings.hiddenSubcategories || []),
              ...group.items.map((item) => item.slug),
            ]),
          ];
        }

        refreshed = await updateSettingsById(settings._id, update);
      } else if (action === 'deleteSubcategory') {
        const slug = String(req.body.slug || '').trim();
        const navGroups = buildNavGroupsFromCatalog(catalog);
        const sub = navGroups.flatMap((g) => g.items).find((item) => item.slug === slug);

        if (!sub) {
          return res.status(404).json({ success: false, error: 'Subcategory not found' });
        }

        const count = await Package.countDocuments({
          packageCategory: { $regex: new RegExp(`^${String(sub.value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        });
        if (count > 0) {
          return res.status(400).json({
            success: false,
            error: `Cannot delete — ${count} package(s) still use this category`,
          });
        }

        const update = {
          customSubcategories: (settings.customSubcategories || []).filter(
            (item) => item.slug !== slug
          ),
          customMiniCategories: (settings.customMiniCategories || []).filter(
            (mini) => mini.subcategorySlug !== slug
          ),
        };

        if (!isCustomSubcategory(slug, catalog)) {
          update.hiddenSubcategories = [...new Set([...(settings.hiddenSubcategories || []), slug])];
        }

        refreshed = await updateSettingsById(settings._id, update);
      } else if (action === 'addMiniCategory') {
        const label = String(req.body.label || '').trim();
        const subcategorySlug = String(req.body.subcategorySlug || '').trim();
        const groupSlug = String(req.body.groupSlug || '').trim();

        if (!label || !subcategorySlug || !groupSlug) {
          return res.status(400).json({
            success: false,
            error: 'label, subcategorySlug, and groupSlug are required',
          });
        }

        const navGroups = buildNavGroupsFromCatalog(catalog);
        const subExists = navGroups
          .find((g) => g.slug === groupSlug)
          ?.items.some((sub) => sub.slug === subcategorySlug);

        if (!subExists) {
          return res.status(404).json({ success: false, error: 'Subcategory not found' });
        }

        const allMiniSlugs = getAllMiniSlugs(catalog);
        const baseSlug = slugifyCategoryName(label);
        const slug = ensureUniqueSlug(baseSlug, allMiniSlugs);

        refreshed = await updateSettingsById(settings._id, {
          customMiniCategories: [
            ...(settings.customMiniCategories || []),
            { slug, label, subcategorySlug, groupSlug },
          ],
        });
      } else if (action === 'updateMiniCategory') {
        const slug = String(req.body.slug || '').trim();
        const label = String(req.body.label || '').trim();

        if (!slug || !label) {
          return res.status(400).json({ success: false, error: 'slug and label are required' });
        }

        if (!isCustomMiniCategory(slug, catalog)) {
          return res.status(400).json({ success: false, error: 'Mini category not found' });
        }

        const previous = (settings.customMiniCategories || []).find((mini) => mini.slug === slug);
        refreshed = await updateSettingsById(settings._id, {
          customMiniCategories: (settings.customMiniCategories || []).map((mini) =>
            mini.slug === slug ? { ...mini, label } : mini
          ),
        });

        if (previous?.label) {
          await Package.updateMany(
            { packageMiniCategory: { $regex: new RegExp(`^${previous.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
            { $set: { packageMiniCategory: label } }
          );
        }
      } else if (action === 'deleteMiniCategory') {
        const slug = String(req.body.slug || '').trim();
        if (!isCustomMiniCategory(slug, catalog)) {
          return res.status(400).json({ success: false, error: 'Mini category not found' });
        }

        const mini = getMiniCategoryBySlugFromCatalog(slug, catalog);
        if (mini) {
          const count = await Package.countDocuments({
            packageMiniCategory: { $regex: new RegExp(`^${mini.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
          });
          if (count > 0) {
            return res.status(400).json({
              success: false,
              error: `Cannot delete — ${count} package(s) still use this mini category`,
            });
          }
        }

        refreshed = await updateSettingsById(settings._id, {
          customMiniCategories: (settings.customMiniCategories || []).filter(
            (mini) => mini.slug !== slug
          ),
        });
      } else {
        return res.status(400).json({ success: false, error: 'Invalid action' });
      }

      if (!refreshed) {
        return res.status(500).json({ success: false, error: 'Failed to save changes' });
      }

      res.status(200).json({ success: true, data: buildResponse(refreshed) });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
    return;
  }

  res.status(405).json({ success: false, error: 'Method not allowed' });
}
