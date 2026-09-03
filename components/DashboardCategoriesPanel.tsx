'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, Check, X, FolderTree } from 'lucide-react';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { isCustomGroup, isCustomMiniCategory } from '@/lib/categoryCatalog';
import { formatCategoryOptionLabel } from '@/lib/resolveCategoryLabels';

export default function DashboardCategoriesPanel() {
  const {
    navGroups,
    catalog,
    loading,
    renameGroupLabel,
    addGroup,
    addSubcategory,
    updateSubcategory,
    deleteGroup,
    deleteSubcategory,
    addMiniCategory,
    updateMiniCategory,
    deleteMiniCategory,
  } = useCategoryLabels();

  const [selectedGroupSlug, setSelectedGroupSlug] = useState(navGroups[0]?.slug ?? 'water');
  const [selectedSubSlug, setSelectedSubSlug] = useState<string | null>(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubSubtitle, setNewSubSubtitle] = useState('');
  const [newSubFuture, setNewSubFuture] = useState(false);
  const [newMiniName, setNewMiniName] = useState('');
  const [editingGroupSlug, setEditingGroupSlug] = useState<string | null>(null);
  const [groupDraft, setGroupDraft] = useState('');
  const [editingSubSlug, setEditingSubSlug] = useState<string | null>(null);
  const [subDraft, setSubDraft] = useState({ label: '', heroSubtitle: '', isFuture: false });
  const [editingMiniSlug, setEditingMiniSlug] = useState<string | null>(null);
  const [miniDraft, setMiniDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedGroup = useMemo(
    () => navGroups.find((group) => group.slug === selectedGroupSlug) ?? navGroups[0],
    [navGroups, selectedGroupSlug]
  );

  const selectedSub = useMemo(
    () => selectedGroup?.items.find((sub) => sub.slug === selectedSubSlug) ?? null,
    [selectedGroup, selectedSubSlug]
  );

  useEffect(() => {
    if (navGroups.length && !navGroups.some((group) => group.slug === selectedGroupSlug)) {
      setSelectedGroupSlug(navGroups[0].slug);
    }
  }, [navGroups, selectedGroupSlug]);

  useEffect(() => {
    if (!selectedGroup?.items.length) {
      setSelectedSubSlug(null);
      return;
    }
    if (!selectedSubSlug || !selectedGroup.items.some((sub) => sub.slug === selectedSubSlug)) {
      setSelectedSubSlug(selectedGroup.items[0].slug);
    }
  }, [selectedGroup, selectedSubSlug]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;
    setSaving(true);
    const ok = await addGroup(newGroupName.trim());
    setSaving(false);
    if (ok) setNewGroupName('');
  };

  const handleSaveGroup = async (slug: string) => {
    if (!groupDraft.trim()) return;
    setSaving(true);
    const ok = await renameGroupLabel(slug, groupDraft.trim());
    setSaving(false);
    if (ok) setEditingGroupSlug(null);
  };

  const handleAddSubcategory = async () => {
    if (!selectedGroup || !newSubName.trim()) return;
    setSaving(true);
    const ok = await addSubcategory(selectedGroup.slug, newSubName.trim(), {
      heroSubtitle: newSubSubtitle.trim() || undefined,
      isFuture: newSubFuture,
    });
    setSaving(false);
    if (ok) {
      setNewSubName('');
      setNewSubSubtitle('');
      setNewSubFuture(false);
    }
  };

  const handleSaveSubcategory = async (slug: string) => {
    if (!subDraft.label.trim()) return;
    setSaving(true);
    const ok = await updateSubcategory(slug, {
      label: subDraft.label.trim(),
      heroSubtitle: subDraft.heroSubtitle.trim() || undefined,
      isFuture: subDraft.isFuture,
    });
    setSaving(false);
    if (ok) setEditingSubSlug(null);
  };

  const handleAddMini = async () => {
    if (!selectedGroup || !selectedSub || !newMiniName.trim()) return;
    setSaving(true);
    const ok = await addMiniCategory(selectedGroup.slug, selectedSub.slug, newMiniName.trim());
    setSaving(false);
    if (ok) setNewMiniName('');
  };

  const handleSaveMini = async (slug: string) => {
    if (!miniDraft.trim()) return;
    setSaving(true);
    const ok = await updateMiniCategory(slug, miniDraft.trim());
    setSaving(false);
    if (ok) setEditingMiniSlug(null);
  };

  if (loading) {
    return (
      <Card className="rounded-[40px] border-white shadow-sm">
        <CardContent className="p-12 text-center text-gray-500">Loading categories...</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderTree className="h-7 w-7 text-hazelnut" />
        <div>
          <h2 className="text-2xl font-black text-espresso tracking-tight uppercase">Category Tree</h2>
          <p className="text-sm text-gray-500">Main category → Subcategory → Mini category</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Column 1: Main Category */}
        <Card className="rounded-[32px] border-white shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Main Category</CardTitle>
            <CardDescription>Top-level experience types</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="New main category"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="h-10 rounded-xl"
              />
              <Button type="button" onClick={handleAddGroup} disabled={saving || !newGroupName.trim()} className="shrink-0 h-10 rounded-xl bg-espresso">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {navGroups.map((group) => {
                const isSelected = selectedGroup?.slug === group.slug;
                const isEditing = editingGroupSlug === group.slug;
                return (
                  <div key={group.slug} className={`rounded-xl border p-3 ${isSelected ? 'border-hazelnut bg-hazelnut/5' : 'border-gray-100'}`}>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input value={groupDraft} onChange={(e) => setGroupDraft(e.target.value)} className="h-9 rounded-lg" />
                        <Button type="button" size="icon" variant="outline" disabled={saving} onClick={() => handleSaveGroup(group.slug)}><Check className="h-4 w-4" /></Button>
                        <Button type="button" size="icon" variant="ghost" onClick={() => setEditingGroupSlug(null)}><X className="h-4 w-4" /></Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <button type="button" onClick={() => setSelectedGroupSlug(group.slug)} className="text-left flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{group.label}</p>
                          <p className="text-[10px] text-gray-400">{group.items.length} subs · {isCustomGroup(group.slug, catalog) ? 'Custom' : 'Built-in'}</p>
                        </button>
                        <div className="flex shrink-0">
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditingGroupSlug(group.slug); setGroupDraft(group.label); }}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${group.label}" and its subcategories?`)) deleteGroup(group.slug); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Column 2: Subcategory */}
        <Card className="rounded-[32px] border-white shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Subcategory</CardTitle>
            <CardDescription>Under {selectedGroup?.label ?? '...'}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3">
            <div className="rounded-xl border border-dashed border-gray-200 p-3 space-y-2 bg-gray-50/50">
              <Input placeholder="New subcategory" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="h-9 rounded-lg bg-cream" />
              <Input placeholder="Description (optional)" value={newSubSubtitle} onChange={(e) => setNewSubSubtitle(e.target.value)} className="h-9 rounded-lg bg-cream" />
              <div className="flex items-center gap-2">
                <Checkbox id="sub-future" checked={newSubFuture} onCheckedChange={(c) => setNewSubFuture(!!c)} />
                <label htmlFor="sub-future" className="text-xs text-gray-600">Coming soon</label>
              </div>
              <Button type="button" onClick={handleAddSubcategory} disabled={saving || !newSubName.trim()} className="w-full h-9 rounded-lg bg-hazelnut hover:bg-[#a67f3d]">
                <Plus className="h-4 w-4 mr-1" /> Add Subcategory
              </Button>
            </div>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {selectedGroup?.items.map((sub) => {
                const isSelected = selectedSubSlug === sub.slug;
                const isEditing = editingSubSlug === sub.slug;
                return (
                  <div key={sub.slug} className={`rounded-xl border p-3 ${isSelected ? 'border-hazelnut bg-hazelnut/5' : 'border-gray-100'}`}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input value={subDraft.label} onChange={(e) => setSubDraft((p) => ({ ...p, label: e.target.value }))} className="h-9 rounded-lg" />
                        <Input value={subDraft.heroSubtitle} onChange={(e) => setSubDraft((p) => ({ ...p, heroSubtitle: e.target.value }))} className="h-9 rounded-lg" />
                        <div className="flex gap-2">
                          <Button type="button" size="sm" disabled={saving} onClick={() => handleSaveSubcategory(sub.slug)}>Save</Button>
                          <Button type="button" size="sm" variant="ghost" onClick={() => setEditingSubSlug(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <button type="button" onClick={() => setSelectedSubSlug(sub.slug)} className="text-left flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-semibold text-sm">{formatCategoryOptionLabel(sub)}</p>
                            <Badge variant="outline" className="text-[9px]">{(sub.miniItems?.length ?? 0)} mini</Badge>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{sub.heroSubtitle}</p>
                        </button>
                        <div className="flex shrink-0">
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingSubSlug(sub.slug); setSubDraft({ label: sub.label, heroSubtitle: sub.heroSubtitle, isFuture: !!sub.isFuture }); }}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => { if (confirm(`Delete "${sub.label}"?`)) deleteSubcategory(sub.slug); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Column 3: Mini Category */}
        <Card className="rounded-[32px] border-white shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-lg font-black uppercase tracking-tight">Mini Category</CardTitle>
            <CardDescription>Under {selectedSub?.label ?? 'select a subcategory'}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3">
            <div className="rounded-xl border border-dashed border-gray-200 p-3 space-y-2 bg-gray-50/50">
              <Input placeholder="New mini category" value={newMiniName} onChange={(e) => setNewMiniName(e.target.value)} className="h-9 rounded-lg bg-cream" disabled={!selectedSub} />
              <Button type="button" onClick={handleAddMini} disabled={saving || !newMiniName.trim() || !selectedSub} className="w-full h-9 rounded-lg bg-espresso hover:bg-[#1f2937]">
                <Plus className="h-4 w-4 mr-1" /> Add Mini Category
              </Button>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {!selectedSub && <p className="text-sm text-gray-400 text-center py-8">Select a subcategory first</p>}
              {selectedSub?.miniItems?.map((mini) => {
                const isEditing = editingMiniSlug === mini.slug;
                return (
                  <div key={mini.slug} className="rounded-xl border border-gray-100 p-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Input value={miniDraft} onChange={(e) => setMiniDraft(e.target.value)} className="h-9 rounded-lg" />
                        <Button type="button" size="icon" variant="outline" disabled={saving} onClick={() => handleSaveMini(mini.slug)}><Check className="h-4 w-4" /></Button>
                        <Button type="button" size="icon" variant="ghost" onClick={() => setEditingMiniSlug(null)}><X className="h-4 w-4" /></Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{mini.label}</p>
                          <p className="text-[10px] text-gray-400">{isCustomMiniCategory(mini.slug, catalog) ? 'Custom' : 'Built-in'}</p>
                        </div>
                        <div className="flex shrink-0">
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditingMiniSlug(mini.slug); setMiniDraft(mini.label); }}><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => { if (confirm(`Delete "${mini.label}"?`)) deleteMiniCategory(mini.slug); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {selectedSub && !(selectedSub.miniItems?.length) && (
                <p className="text-sm text-gray-400 text-center py-8">No mini categories yet. Add one above.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
