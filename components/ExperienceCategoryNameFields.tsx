'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { formatCategoryOptionLabel } from '@/lib/resolveCategoryLabels';

interface ExperienceCategoryNameFieldsProps {
  packageGroupSlug: string;
  packageCategory: string;
  packageMiniCategory?: string;
  onGroupChange: (groupSlug: string) => void;
  onCategoryChange: (categoryValue: string) => void;
  onMiniCategoryChange?: (miniValue: string) => void;
  selectContentClassName?: string;
}

export default function ExperienceCategoryNameFields({
  packageGroupSlug,
  packageCategory,
  packageMiniCategory = '',
  onGroupChange,
  onCategoryChange,
  onMiniCategoryChange,
  selectContentClassName,
}: ExperienceCategoryNameFieldsProps) {
  const { navGroups } = useCategoryLabels();

  // Find group — fallback to first if not found
  const selectedPackageGroup =
    navGroups.find((group) => group.slug === packageGroupSlug) ?? navGroups[0];

  // Determine if the current packageCategory value exists in the selected group's items
  const categoryExistsInGroup = selectedPackageGroup?.items.some(
    (item) => item.value === packageCategory
  );

  // Also check across ALL groups (the category may belong to a different group)
  const categoryExistsAnywhere = navGroups.some((g) =>
    g.items.some((item) => item.value === packageCategory)
  );

  const selectedSubcategory =
    selectedPackageGroup?.items.find((item) => item.value === packageCategory) ??
    selectedPackageGroup?.items[0];

  const miniItems = selectedSubcategory?.miniItems ?? [];

  // Check if the group slug exists in navGroups
  const groupSlugExists = navGroups.some((g) => g.slug === packageGroupSlug);

  // Effective select value for the group
  const effectiveGroupSlug = groupSlugExists
    ? packageGroupSlug
    : navGroups[0]?.slug ?? packageGroupSlug;

  // Effective select value for the subcategory
  const effectiveCategoryValue = categoryExistsInGroup
    ? packageCategory
    : packageCategory; // Always use the raw value — we inject it as a SelectItem below

  const handlePackageGroupChange = (groupSlug: string) => {
    onGroupChange(groupSlug);
    const group = navGroups.find((item) => item.slug === groupSlug);
    if (group?.items[0]) {
      onCategoryChange(group.items[0].value);
      onMiniCategoryChange?.('');
    }
  };

  const handleSubcategoryChange = (categoryValue: string) => {
    onCategoryChange(categoryValue);
    onMiniCategoryChange?.('');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Category *</label>
        <Select value={effectiveGroupSlug} onValueChange={handlePackageGroupChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent className={selectContentClassName}>
            {navGroups.map((group) => (
              <SelectItem key={group.slug} value={group.slug}>
                {group.label}
              </SelectItem>
            ))}
            {/* If group slug is unrecognized, show it so Select doesn't blank out */}
            {!groupSlugExists && packageGroupSlug && (
              <SelectItem key={packageGroupSlug} value={packageGroupSlug}>
                {packageGroupSlug}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Subcategory *</label>
        <Select value={effectiveCategoryValue} onValueChange={handleSubcategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent className={`max-h-72 ${selectContentClassName ?? ''}`}>
            {selectedPackageGroup?.items.map((category) => (
              <SelectItem key={category.slug} value={category.value}>
                {formatCategoryOptionLabel(category)}
              </SelectItem>
            ))}
            {/* If packageCategory doesn't exist in this group's items, inject it so the Select shows the current value */}
            {!categoryExistsInGroup && packageCategory && (
              <SelectItem key={`__current_${packageCategory}`} value={packageCategory}>
                {packageCategory} (current)
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mini Category</label>
        <Select
          value={packageMiniCategory || '__none__'}
          onValueChange={(value) => onMiniCategoryChange?.(value === '__none__' ? '' : value)}
          disabled={!miniItems.length && !packageMiniCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder={miniItems.length || packageMiniCategory ? 'Select mini category' : 'No mini categories'} />
          </SelectTrigger>
          <SelectContent className={`max-h-72 ${selectContentClassName ?? ''}`}>
            <SelectItem value="__none__">None</SelectItem>
            {miniItems.map((mini) => (
              <SelectItem key={mini.slug} value={mini.value}>
                {mini.label}
              </SelectItem>
            ))}
            {/* If the current mini category isn't in the list, show it */}
            {packageMiniCategory &&
              packageMiniCategory !== '__none__' &&
              !miniItems.some((m) => m.value === packageMiniCategory) && (
                <SelectItem key={`__current_mini_${packageMiniCategory}`} value={packageMiniCategory}>
                  {packageMiniCategory} (current)
                </SelectItem>
              )}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">Optional. Manage in Dashboard → Categories.</p>
      </div>
    </div>
  );
}
