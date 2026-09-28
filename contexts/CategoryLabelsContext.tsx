'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { PACKAGE_NAV_GROUPS, PackageExperienceCategory, PackageNavGroup } from '@/lib/packageExperienceCategories';
import {
  CategoryCatalogSettings,
  buildNavGroupsFromCatalog,
  getResolvedCategoryByValueFromCatalog,
  getResolvedNavGroupLabelFromCatalog,
} from '@/lib/categoryCatalog';

interface CategoryLabelsContextValue {
  navGroups: PackageNavGroup[];
  catalog: CategoryCatalogSettings;
  overrides: CategoryCatalogSettings;
  loading: boolean;
  refreshLabels: () => Promise<void>;
  renameGroupLabel: (slug: string, label: string) => Promise<boolean>;
  renameCategoryLabel: (slug: string, label: string) => Promise<boolean>;
  addGroup: (label: string) => Promise<boolean>;
  addSubcategory: (
    groupSlug: string,
    label: string,
    options?: { heroSubtitle?: string; isFuture?: boolean }
  ) => Promise<boolean>;
  updateSubcategory: (
    slug: string,
    data: { label: string; heroSubtitle?: string; isFuture?: boolean }
  ) => Promise<boolean>;
  deleteGroup: (slug: string) => Promise<boolean>;
  deleteSubcategory: (slug: string) => Promise<boolean>;
  addMiniCategory: (groupSlug: string, subcategorySlug: string, label: string) => Promise<boolean>;
  updateMiniCategory: (slug: string, label: string) => Promise<boolean>;
  deleteMiniCategory: (slug: string) => Promise<boolean>;
  renameMiniCategoryLabel: (slug: string, label: string) => Promise<boolean>;
  getCategoryByValue: (value: string | undefined) => PackageExperienceCategory | undefined;
  getGroupLabel: (groupSlug: string) => string;
}

const CategoryLabelsContext = createContext<CategoryLabelsContextValue | null>(null);

function applyResponse(
  data: any,
  setCatalog: (catalog: CategoryCatalogSettings) => void,
  setNavGroups: (groups: PackageNavGroup[]) => void
) {
  if (!data) return;
  const catalog = data.catalog ?? {
    groupLabels: data.overrides?.groupLabels ?? {},
    categoryLabels: data.overrides?.categoryLabels ?? {},
    customGroups: [],
    customSubcategories: [],
    customMiniCategories: [],
  };
  setCatalog(catalog);
  try {
    const rawGroups = data.navGroups ?? buildNavGroupsFromCatalog(catalog);
    const safeGroups = (Array.isArray(rawGroups) ? rawGroups : []).map((g) => ({
      ...g,
      slug: g?.slug || '',
      label: g?.label || '',
      items: Array.isArray(g?.items) ? g.items : [],
    }));
    setNavGroups(safeGroups);
  } catch (err) {
    console.error('Error applying nav groups from catalog:', err);
  }
}


export function CategoryLabelsProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<CategoryCatalogSettings>({
    groupLabels: {},
    categoryLabels: {},
    customGroups: [],
    customSubcategories: [],
    customMiniCategories: [],
  });
  const [navGroups, setNavGroups] = useState<PackageNavGroup[]>(PACKAGE_NAV_GROUPS);
  const [loading, setLoading] = useState(true);

  const refreshLabels = useCallback(async () => {
    try {
      const response = await fetch('/api/category-labels', { cache: 'no-store' });
      const result = await response.json();
      if (result.success && result.data) {
        applyResponse(result.data, setCatalog, setNavGroups);
      }
    } catch (error) {
      console.error('Failed to load category labels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLabels();
  }, [refreshLabels]);

  const apiCall = useCallback(async (init: RequestInit) => {
    try {
      const response = await fetch('/api/category-labels', init);
      const result = await response.json();
      if (!result.success) {
        alert(result.error || 'Request failed');
        return false;
      }
      applyResponse(result.data, setCatalog, setNavGroups);
      return true;
    } catch (error) {
      console.error('Category API error:', error);
      alert('Request failed. Please try again.');
      return false;
    }
  }, []);

  const renameGroupLabel = useCallback(
    (slug: string, label: string) =>
      apiCall({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'group', slug, label }),
      }),
    [apiCall]
  );

  const renameCategoryLabel = useCallback(
    (slug: string, label: string) =>
      apiCall({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'category', slug, label }),
      }),
    [apiCall]
  );

  const addGroup = useCallback(
    (label: string) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addGroup', label }),
      }),
    [apiCall]
  );

  const addSubcategory = useCallback(
    (groupSlug: string, label: string, options?: { heroSubtitle?: string; isFuture?: boolean }) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addSubcategory', groupSlug, label, ...options }),
      }),
    [apiCall]
  );

  const updateSubcategory = useCallback(
    (slug: string, data: { label: string; heroSubtitle?: string; isFuture?: boolean }) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateSubcategory', slug, ...data }),
      }),
    [apiCall]
  );

  const deleteGroup = useCallback(
    (slug: string) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteGroup', slug }),
      }),
    [apiCall]
  );

  const deleteSubcategory = useCallback(
    (slug: string) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteSubcategory', slug }),
      }),
    [apiCall]
  );

  const addMiniCategory = useCallback(
    (groupSlug: string, subcategorySlug: string, label: string) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addMiniCategory', groupSlug, subcategorySlug, label }),
      }),
    [apiCall]
  );

  const updateMiniCategory = useCallback(
    (slug: string, label: string) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateMiniCategory', slug, label }),
      }),
    [apiCall]
  );

  const deleteMiniCategory = useCallback(
    (slug: string) =>
      apiCall({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteMiniCategory', slug }),
      }),
    [apiCall]
  );

  const renameMiniCategoryLabel = useCallback(
    (slug: string, label: string) =>
      apiCall({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'mini', slug, label }),
      }),
    [apiCall]
  );

  const getCategoryByValue = useCallback(
    (value: string | undefined) => getResolvedCategoryByValueFromCatalog(value, catalog),
    [catalog]
  );

  const getGroupLabel = useCallback(
    (groupSlug: string) => getResolvedNavGroupLabelFromCatalog(groupSlug, catalog),
    [catalog]
  );

  const value = useMemo(
    () => ({
      navGroups,
      catalog,
      overrides: catalog,
      loading,
      refreshLabels,
      renameGroupLabel,
      renameCategoryLabel,
      addGroup,
      addSubcategory,
      updateSubcategory,
      deleteGroup,
      deleteSubcategory,
      addMiniCategory,
      updateMiniCategory,
      deleteMiniCategory,
      renameMiniCategoryLabel,
      getCategoryByValue,
      getGroupLabel,
    }),
    [
      navGroups,
      catalog,
      loading,
      refreshLabels,
      renameGroupLabel,
      renameCategoryLabel,
      addGroup,
      addSubcategory,
      updateSubcategory,
      deleteGroup,
      deleteSubcategory,
      addMiniCategory,
      updateMiniCategory,
      deleteMiniCategory,
      renameMiniCategoryLabel,
      getCategoryByValue,
      getGroupLabel,
    ]
  );

  return (
    <CategoryLabelsContext.Provider value={value}>
      {children}
    </CategoryLabelsContext.Provider>
  );
}

export function useCategoryLabels() {
  const context = useContext(CategoryLabelsContext);
  if (!context) {
    const emptyCatalog: CategoryCatalogSettings = {
      groupLabels: {},
      categoryLabels: {},
      customGroups: [],
      customSubcategories: [],
      customMiniCategories: [],
    };
    return {
      navGroups: PACKAGE_NAV_GROUPS,
      catalog: emptyCatalog,
      overrides: emptyCatalog,
      loading: false,
      refreshLabels: async () => {},
      renameGroupLabel: async () => false,
      renameCategoryLabel: async () => false,
      addGroup: async () => false,
      addSubcategory: async () => false,
      updateSubcategory: async () => false,
      deleteGroup: async () => false,
      deleteSubcategory: async () => false,
      addMiniCategory: async () => false,
      updateMiniCategory: async () => false,
      deleteMiniCategory: async () => false,
      renameMiniCategoryLabel: async () => false,
      getCategoryByValue: (value: string | undefined) =>
        getResolvedCategoryByValueFromCatalog(value, emptyCatalog),
      getGroupLabel: (groupSlug: string) =>
        getResolvedNavGroupLabelFromCatalog(groupSlug, emptyCatalog),
    };
  }
  return context;
}

export function useResolvedNavGroups() {
  const { navGroups } = useCategoryLabels();
  return navGroups;
}
