'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Check, X, FolderTree, Layers } from 'lucide-react';
import { useCategoryLabels } from '@/contexts/CategoryLabelsContext';
import { isCustomGroup } from '@/lib/categoryCatalog';

export default function DashboardCategoriesPanel() {
  const {
    navGroups,
    catalog,
    loading,
    renameGroupLabel,
    addGroup,
    deleteGroup,
  } = useCategoryLabels();

  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupSlug, setEditingGroupSlug] = useState<string | null>(null);
  const [groupDraft, setGroupDraft] = useState('');
  const [saving, setSaving] = useState(false);

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

  if (loading) {
    return (
      <Card className="rounded-[40px] border-white shadow-sm">
        <CardContent className="p-12 text-center text-gray-500">Loading categories...</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-hazelnut/10 flex items-center justify-center text-hazelnut">
          <FolderTree className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-espresso tracking-tight uppercase">Category Management</h2>
          <p className="text-sm text-gray-500">Create, rename, and manage all product categories</p>
        </div>
      </div>

      <Card className="rounded-[32px] border-white shadow-sm overflow-hidden bg-cream/70 backdrop-blur-sm">
        <CardHeader className="p-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black uppercase tracking-tight text-espresso">
                Product Categories
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Single main categories used across products, packages, and navigation.
              </CardDescription>
            </div>
            <Badge variant="outline" className="rounded-xl border-amber-300 bg-amber-50/50 text-amber-900 font-bold px-3 py-1 text-xs self-start sm:self-auto">
              {navGroups.length} Active Categories
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-2 space-y-6">
          {/* Add Category Form */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Enter new category name (e.g. Coffee Premix, Cold Brew, Gift Sets)..."
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGroup();
                }
              }}
              className="h-12 rounded-xl border-gray-200 text-sm font-medium focus:ring-2 focus:ring-hazelnut"
            />
            <Button
              type="button"
              onClick={handleAddGroup}
              disabled={saving || !newGroupName.trim()}
              className="h-12 px-6 rounded-xl bg-espresso hover:bg-hazelnut text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-all flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-3">
            {navGroups.map((group) => {
              const isEditing = editingGroupSlug === group.slug;
              const isCustom = isCustomGroup(group.slug, catalog);
              return (
                <div
                  key={group.slug}
                  className="rounded-2xl border border-gray-100 bg-white p-4 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <Input
                        value={groupDraft}
                        onChange={(e) => setGroupDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveGroup(group.slug);
                          }
                        }}
                        className="h-11 rounded-xl text-sm font-medium"
                        autoFocus
                      />
                      <Button
                        type="button"
                        size="sm"
                        disabled={saving}
                        onClick={() => handleSaveGroup(group.slug)}
                        className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingGroupSlug(null)}
                        className="h-11 px-4 text-gray-500 rounded-xl"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-hazelnut shrink-0">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base text-espresso truncate">{group.label}</span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-bold uppercase tracking-wider rounded-lg px-2 py-0.5 ${
                                isCustom
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-gray-50 text-gray-600 border-gray-200'
                              }`}
                            >
                              {isCustom ? 'Custom' : 'Standard'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">slug: {group.slug}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-gray-500 hover:text-espresso hover:bg-cream rounded-xl"
                          onClick={() => {
                            setEditingGroupSlug(group.slug);
                            setGroupDraft(group.label);
                          }}
                          title="Rename Category"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the category "${group.label}"?`)) {
                              deleteGroup(group.slug);
                            }
                          }}
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
