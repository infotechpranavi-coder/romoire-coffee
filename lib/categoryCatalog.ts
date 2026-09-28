import { SITE_NAME } from './branding';
import {
  PACKAGE_NAV_GROUPS,
  CATEGORY_IMAGES,
  PackageExperienceCategory,
  PackageMiniCategory,
  PackageNavGroup,
  getCategoryMatchValues,
} from './packageExperienceCategories';

export interface CustomGroupEntry {
  slug: string;
  label: string;
}

export interface CustomSubcategoryEntry {
  slug: string;
  label: string;
  groupSlug: string;
  heroSubtitle?: string;
  isFuture?: boolean;
}

export interface CustomMiniCategoryEntry {
  slug: string;
  label: string;
  subcategorySlug: string;
  groupSlug: string;
}

export type CategoryLabelOverrides = {
  groupLabels?: Record<string, string>;
  categoryLabels?: Record<string, string>;
};

export interface CategoryCatalogSettings extends CategoryLabelOverrides {
  customGroups?: CustomGroupEntry[];
  customSubcategories?: CustomSubcategoryEntry[];
  customMiniCategories?: CustomMiniCategoryEntry[];
  miniCategoryLabels?: Record<string, string>;
  hiddenGroups?: string[];
  hiddenSubcategories?: string[];
  hiddenMiniCategories?: string[];
}

const GROUP_ACCENTS: Record<string, PackageExperienceCategory['accent']> = {
  water: 'teal',
  'land-motor': 'orange',
  'land-physical': 'green',
  sky: 'violet',
  'upcoming-tours': 'amber',
};

export function slugifyCategoryName(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCategoryCatalogFromSettings(
  settings?: {
    groupLabelOverrides?: Record<string, string>;
    categoryLabelOverrides?: Record<string, string>;
    customGroups?: CustomGroupEntry[];
    customSubcategories?: CustomSubcategoryEntry[];
    customMiniCategories?: CustomMiniCategoryEntry[];
    miniCategoryLabelOverrides?: Record<string, string>;
    hiddenGroups?: string[];
    hiddenSubcategories?: string[];
    hiddenMiniCategories?: string[];
  } | null
): CategoryCatalogSettings {
  return {
    groupLabels: settings?.groupLabelOverrides ?? {},
    categoryLabels: settings?.categoryLabelOverrides ?? {},
    customGroups: settings?.customGroups ?? [],
    customSubcategories: settings?.customSubcategories ?? [],
    customMiniCategories: settings?.customMiniCategories ?? [],
    miniCategoryLabels: settings?.miniCategoryLabelOverrides ?? {},
    hiddenGroups: settings?.hiddenGroups ?? [],
    hiddenSubcategories: settings?.hiddenSubcategories ?? [],
    hiddenMiniCategories: settings?.hiddenMiniCategories ?? [],
  };
}

function applyLabelOverrides(catalog: CategoryCatalogSettings): PackageNavGroup[] {
  const groupLabels = catalog.groupLabels ?? {};
  const categoryLabels = catalog.categoryLabels ?? {};

  return PACKAGE_NAV_GROUPS.map((group) => ({
    ...group,
    label: groupLabels[group.slug]?.trim() || group.label,
    items: group.items.map((item) => {
      const customLabel = categoryLabels[item.slug]?.trim();
      if (!customLabel) return { ...item };
      return {
        ...item,
        label: customLabel,
        value: customLabel,
        heroTitle: customLabel,
      };
    }),
  }));
}

function defaultAccentForGroup(groupSlug: string): PackageExperienceCategory['accent'] {
  return GROUP_ACCENTS[groupSlug] ?? 'amber';
}

export function buildMiniCategory(
  entry: CustomMiniCategoryEntry,
  labelOverride?: string
): PackageMiniCategory {
  const label = (labelOverride || entry.label).trim();
  return {
    slug: entry.slug,
    label,
    value: label,
    href: `/packages/mini/${entry.slug}`,
    subcategorySlug: entry.subcategorySlug,
    groupSlug: entry.groupSlug,
  };
}

function attachMiniCategories(
  groups: PackageNavGroup[],
  catalog: CategoryCatalogSettings
): PackageNavGroup[] {
  const miniLabels = catalog.miniCategoryLabels ?? {};
  const minis = catalog.customMiniCategories ?? [];

  return groups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      miniItems: minis
        .filter((mini) => mini.subcategorySlug === item.slug && mini.groupSlug === group.slug)
        .filter((mini) => !(catalog.hiddenMiniCategories ?? []).includes(mini.slug))
        .map((mini) => buildMiniCategory(mini, miniLabels[mini.slug])),
    })),
  }));
}

export function buildCustomSubcategory(entry: CustomSubcategoryEntry): PackageExperienceCategory {
  const label = entry.label.trim();
  return {
    value: label,
    label,
    slug: entry.slug,
    href: `/packages/category/${entry.slug}`,
    heroTitle: label,
    heroSubtitle: entry.heroSubtitle?.trim() || `Browse ${label} coffee with ${SITE_NAME}`,
    heroImage: CATEGORY_IMAGES['colombian-supremo'],
    emptyMessage: `No ${label} packages yet`,
    accent: defaultAccentForGroup(entry.groupSlug),
    group: entry.groupSlug,
    isFuture: entry.isFuture ?? false,
    miniItems: [],
  };
}

export function buildNavGroupsFromCatalog(
  catalog?: CategoryCatalogSettings | null
): PackageNavGroup[] {
  const base = applyLabelOverrides(catalog ?? {});
  const customGroups = catalog?.customGroups ?? [];
  const customSubs = catalog?.customSubcategories ?? [];

  const groupsMap = new Map<string, PackageNavGroup>();
  for (const group of base) {
    groupsMap.set(group.slug, { ...group, items: [...group.items] });
  }

  for (const customGroup of customGroups) {
    if (!groupsMap.has(customGroup.slug)) {
      groupsMap.set(customGroup.slug, {
        slug: customGroup.slug,
        label: customGroup.label,
        items: [],
      });
    } else {
      const existing = groupsMap.get(customGroup.slug)!;
      existing.label = customGroup.label;
    }
  }

  for (const sub of customSubs) {
    const group = groupsMap.get(sub.groupSlug);
    if (!group) continue;

    const existingIndex = group.items.findIndex((item) => item.slug === sub.slug);
    const built = buildCustomSubcategory(sub);
    if (existingIndex >= 0) {
      group.items[existingIndex] = built;
    } else {
      group.items.push(built);
    }
  }

  const result: PackageNavGroup[] = [];
  const seen = new Set<string>();

  for (const group of base) {
    result.push(groupsMap.get(group.slug)!);
    seen.add(group.slug);
  }

  for (const customGroup of customGroups) {
    if (!seen.has(customGroup.slug) && groupsMap.has(customGroup.slug)) {
      result.push(groupsMap.get(customGroup.slug)!);
    }
  }

  const hiddenGroups = new Set(catalog?.hiddenGroups ?? []);
  const hiddenSubs = new Set(catalog?.hiddenSubcategories ?? []);

  const visible = result
    .filter((group) => !hiddenGroups.has(group.slug))
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !hiddenSubs.has(item.slug)),
    }));

  return attachMiniCategories(visible, catalog ?? {});
}

export function getAllMiniSlugs(catalog?: CategoryCatalogSettings | null): Set<string> {
  return new Set((catalog?.customMiniCategories ?? []).map((mini) => mini.slug));
}

export function getMiniCategoryBySlugFromCatalog(
  slug: string,
  catalog?: CategoryCatalogSettings | null
): PackageMiniCategory | undefined {
  return buildNavGroupsFromCatalog(catalog)
    .flatMap((group) => group?.items || [])
    .flatMap((item) => item?.miniItems ?? [])
    .find((mini) => mini?.slug === slug);
}

export function buildMiniFilterForSlug(slug: string, catalog?: CategoryCatalogSettings | null) {
  const mini = getMiniCategoryBySlugFromCatalog(slug, catalog);
  if (!mini) return null;

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return {
    packageMiniCategory: { $regex: new RegExp(`^${escapeRegex(mini.value)}$`, 'i') },
  };
}

export function getAllCategorySlugs(catalog?: CategoryCatalogSettings | null): Set<string> {
  return new Set(
    buildNavGroupsFromCatalog(catalog).flatMap((group) => (group?.items || []).map((item) => item?.slug).filter(Boolean))
  );
}

export function getResolvedCategoryBySlugFromCatalog(
  slug: string,
  catalog?: CategoryCatalogSettings | null
): PackageExperienceCategory | undefined {
  return buildNavGroupsFromCatalog(catalog)
    .flatMap((group) => group.items)
    .find((category) => category.slug === slug);
}

export function getResolvedCategoryByValueFromCatalog(
  value: string | undefined,
  catalog?: CategoryCatalogSettings | null
): PackageExperienceCategory | undefined {
  if (!value) return undefined;

  const groups = buildNavGroupsFromCatalog(catalog);
  const allCategories = groups.flatMap((group) => group.items);

  const direct = allCategories.find(
    (category) => category.value.toLowerCase() === value.toLowerCase()
  );
  if (direct) return direct;

  for (const baseCategory of PACKAGE_NAV_GROUPS.flatMap((group) => group.items)) {
    const matchValues = getCategoryMatchValues(baseCategory);
    if (matchValues.some((match) => match.toLowerCase() === value.toLowerCase())) {
      return allCategories.find((category) => category.slug === baseCategory.slug) ?? baseCategory;
    }
  }

  for (const customSub of catalog?.customSubcategories ?? []) {
    if (customSub.label.toLowerCase() === value.toLowerCase()) {
      return allCategories.find((category) => category.slug === customSub.slug);
    }
  }

  return undefined;
}

export function getResolvedNavGroupLabelFromCatalog(
  groupSlug: string,
  catalog?: CategoryCatalogSettings | null
): string {
  return (
    buildNavGroupsFromCatalog(catalog).find((group) => group.slug === groupSlug)?.label ??
    'Experiences'
  );
}

export function buildCategoryFilterForSlug(slug: string, catalog?: CategoryCatalogSettings | null) {
  const category = getResolvedCategoryBySlugFromCatalog(slug, catalog);
  if (!category) return null;

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const values = [category.value, ...(category.legacyValues || [])];

  return {
    $or: values.map((value) => ({
      packageCategory: { $regex: new RegExp(`^${escapeRegex(value)}$`, 'i') },
    })),
  };
}

export function buildGroupFilterForSlug(groupSlug: string, catalog?: CategoryCatalogSettings | null) {
  const group = buildNavGroupsFromCatalog(catalog).find((item) => item.slug === groupSlug);
  if (!group) return null;

  const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const clauses = group.items.flatMap((category) => {
    const values = [category.value, ...(category.legacyValues || [])];
    return values.map((value) => ({
      packageCategory: { $regex: new RegExp(`^${escapeRegex(value)}$`, 'i') },
    }));
  });

  return clauses.length ? { $or: clauses } : null;
}

export function formatCategoryOptionLabel(category: PackageExperienceCategory): string {
  const futureSuffix =
    category.isFuture && !category.label.toLowerCase().includes('future') ? ' (Future)' : '';
  return `${category.label}${futureSuffix}`;
}

export function isCustomGroup(slug: string, catalog?: CategoryCatalogSettings | null): boolean {
  return (catalog?.customGroups ?? []).some((group) => group.slug === slug);
}

export function isCustomSubcategory(slug: string, catalog?: CategoryCatalogSettings | null): boolean {
  return (catalog?.customSubcategories ?? []).some((sub) => sub.slug === slug);
}

export function isCustomMiniCategory(slug: string, catalog?: CategoryCatalogSettings | null): boolean {
  return (catalog?.customMiniCategories ?? []).some((mini) => mini.slug === slug);
}
