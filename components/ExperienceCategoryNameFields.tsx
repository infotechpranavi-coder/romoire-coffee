'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';

interface ExperienceCategoryNameFieldsProps {
  packageGroupSlug?: string;
  packageCategory?: string;
  packageMiniCategory?: string;
  allowUnassign?: boolean;
  onGroupChange: (groupSlug: string) => void;
  onCategoryChange: (categoryValue: string) => void;
  onMiniCategoryChange?: (miniValue: string) => void;
  selectContentClassName?: string;
}

export default function ExperienceCategoryNameFields({
  packageGroupSlug = '',
  packageCategory = '',
  packageMiniCategory = '',
  allowUnassign = false,
  onGroupChange,
  onCategoryChange,
  onMiniCategoryChange,
  selectContentClassName,
}: ExperienceCategoryNameFieldsProps) {
  const { navGroups } = useCategoryLabels();

  // Find matching group by group slug OR category name/label
  const currentGroup =
    navGroups.find(
      (g) =>
        (packageGroupSlug && g.slug.toLowerCase() === packageGroupSlug.toLowerCase()) ||
        (packageCategory && g.label.toLowerCase() === packageCategory.toLowerCase()) ||
        (packageCategory && g.slug.toLowerCase() === packageCategory.toLowerCase())
    ) ?? navGroups[0];

  const selectedValue = currentGroup?.slug || packageGroupSlug || navGroups[0]?.slug || '';

  const handleCategorySelect = (groupSlug: string) => {
    const group = navGroups.find((g) => g.slug === groupSlug);
    if (group) {
      onGroupChange(group.slug);
      onCategoryChange(group.label);
    } else {
      onGroupChange(groupSlug);
      onCategoryChange(groupSlug);
    }
    onMiniCategoryChange?.('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-espresso uppercase tracking-wider">
        Category *
      </label>
      <Select value={selectedValue} onValueChange={handleCategorySelect}>
        <SelectTrigger className="h-12 rounded-xl border-amber-200 bg-white font-medium text-sm shadow-sm focus:ring-2 focus:ring-hazelnut">
          <SelectValue placeholder="Select Product Category" />
        </SelectTrigger>
        <SelectContent className={`max-h-72 rounded-xl border-amber-200 shadow-xl ${selectContentClassName ?? ''}`}>
          {navGroups.map((group) => (
            <SelectItem key={group.slug} value={group.slug} className="font-medium cursor-pointer">
              {group.label}
            </SelectItem>
          ))}
          {/* If the current category slug/name is not in navGroups, display it */}
          {packageGroupSlug && !navGroups.some((g) => g.slug === packageGroupSlug) && (
            <SelectItem key={packageGroupSlug} value={packageGroupSlug} className="font-medium">
              {packageCategory || packageGroupSlug}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-400">
        Choose the main category for this product. You can manage category names under Dashboard → Categories.
      </p>
    </div>
  );
}
