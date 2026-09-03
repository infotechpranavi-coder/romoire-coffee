'use client';

import { useEffect, useState } from 'react';
import { Compass, Save, Plus, Trash2, Check, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  EXPLORE_SECTION_DEFAULTS,
  resolveExploreSectionContent,
  type ExploreSectionContent,
} from '@/lib/exploreSectionDefaults';
import type { SiteSettings } from '@/lib/types';

function formFromSettings(settings?: Partial<SiteSettings> | null): ExploreSectionContent {
  return resolveExploreSectionContent(settings);
}

export default function ExploreSectionSettingsPanel() {
  const [form, setForm] = useState<ExploreSectionContent>(formFromSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.data) {
          setForm(formFromSettings(data.data));
        }
      } catch (error) {
        console.error('Failed to load explore section settings:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const updateInclusion = (index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev.exploreInclusions];
      next[index] = value;
      return { ...prev, exploreInclusions: next };
    });
  };

  const addInclusion = () => {
    setForm((prev) => ({
      ...prev,
      exploreInclusions: [...prev.exploreInclusions, ''],
    }));
  };

  const removeInclusion = (index: number) => {
    setForm((prev) => ({
      ...prev,
      exploreInclusions: prev.exploreInclusions.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      exploreInclusions: form.exploreInclusions.map((item) => item.trim()).filter(Boolean),
    };

    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setForm(formFromSettings(data.data));
        alert('Explore With Us section saved successfully!');
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save explore section settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!confirm('Reset all Explore With Us content to defaults?')) return;
    setForm({
      exploreEyebrow: EXPLORE_SECTION_DEFAULTS.exploreEyebrow,
      exploreHeadingLine1: EXPLORE_SECTION_DEFAULTS.exploreHeadingLine1,
      exploreHeadingLine2: EXPLORE_SECTION_DEFAULTS.exploreHeadingLine2,
      exploreSubtitle: EXPLORE_SECTION_DEFAULTS.exploreSubtitle,
      exploreInclusions: [...EXPLORE_SECTION_DEFAULTS.exploreInclusions],
      exploreCtaLabel: EXPLORE_SECTION_DEFAULTS.exploreCtaLabel,
      explorePhone: EXPLORE_SECTION_DEFAULTS.explorePhone,
      explorePhoneLabel: EXPLORE_SECTION_DEFAULTS.explorePhoneLabel,
    });
  };

  const preview = resolveExploreSectionContent(form);
  const midPoint = Math.ceil(preview.exploreInclusions.length / 2);
  const leftColumn = preview.exploreInclusions.slice(0, midPoint);
  const rightColumn = preview.exploreInclusions.slice(midPoint);

  if (loading) {
    return (
      <div className="container mx-auto px-8 py-10">
        <div className="animate-pulse rounded-[40px] bg-white h-96 border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10 space-y-10">
      <Card className="rounded-[40px] border-white shadow-sm overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="text-2xl font-black text-[#111827] tracking-tight uppercase flex items-center gap-3">
            <Compass className="h-7 w-7 text-[#bd9245]" />
            Explore With Us
          </CardTitle>
          <CardDescription className="text-sm font-medium text-gray-400 font-bold uppercase tracking-widest mt-1">
            Edit the homepage &quot;Explore With Us&quot; section text, inclusions, and contact CTA
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Eyebrow Text
                </p>
                <Input
                  value={form.exploreEyebrow}
                  onChange={(e) => setForm((prev) => ({ ...prev, exploreEyebrow: e.target.value }))}
                  placeholder="TIME TO TRAVEL"
                  className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Heading Line 1
                  </p>
                  <Input
                    value={form.exploreHeadingLine1}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, exploreHeadingLine1: e.target.value }))
                    }
                    placeholder="EXPLORE"
                    className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Heading Line 2
                  </p>
                  <Input
                    value={form.exploreHeadingLine2}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, exploreHeadingLine2: e.target.value }))
                    }
                    placeholder="WITH US"
                    className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Subtitle
                </p>
                <Input
                  value={form.exploreSubtitle}
                  onChange={(e) => setForm((prev) => ({ ...prev, exploreSubtitle: e.target.value }))}
                  placeholder="Everything Handled. You Just Show Up."
                  className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Inclusion Items
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addInclusion}
                    className="rounded-xl h-8 text-[10px] font-black uppercase tracking-widest"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.exploreInclusions.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateInclusion(index, e.target.value)}
                        placeholder="e.g. 24x7 Concierge Support"
                        className="bg-white border-gray-100 rounded-xl h-11 text-sm font-medium"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeInclusion(index)}
                        className="rounded-xl shrink-0 border-gray-100 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Button Label
                  </p>
                  <Input
                    value={form.exploreCtaLabel}
                    onChange={(e) => setForm((prev) => ({ ...prev, exploreCtaLabel: e.target.value }))}
                    placeholder="Book Now"
                    className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    Phone Label
                  </p>
                  <Input
                    value={form.explorePhoneLabel}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, explorePhoneLabel: e.target.value }))
                    }
                    placeholder="CALL NOW"
                    className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                  Phone Number
                </p>
                <Input
                  value={form.explorePhone}
                  onChange={(e) => setForm((prev) => ({ ...prev, explorePhone: e.target.value }))}
                  placeholder="+91 877919 2482"
                  className="bg-white border-gray-100 rounded-xl h-12 text-sm font-medium"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-2xl h-12 px-8 bg-[#bd9245] hover:bg-[#a67d3a] text-white font-black uppercase tracking-widest text-xs"
                >
                  {saving ? 'Saving...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Section
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-xs"
                >
                  Reset to Defaults
                </Button>
              </div>
            </div>

            <div className="rounded-[32px] bg-white border border-gray-100 p-8 shadow-sm">
              <p className="text-[10px] font-black text-[#bd9245] uppercase tracking-[0.3em] mb-6">
                Live Preview
              </p>
              <p className="text-[#bd9245] font-bold text-xs uppercase tracking-wider mb-2">
                {preview.exploreEyebrow}
              </p>
              <h3 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                {preview.exploreHeadingLine1}
                <br />
                {preview.exploreHeadingLine2}
              </h3>
              <p className="text-gray-500 text-sm font-medium mb-6">{preview.exploreSubtitle}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-8">
                <ul className="space-y-3">
                  {leftColumn.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-[#bd9245] flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-gray-900" strokeWidth={3} />
                      </div>
                      <span className="text-gray-900 text-xs font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {rightColumn.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-[#bd9245] flex items-center justify-center shrink-0">
                        <Check className="h-2.5 w-2.5 text-gray-900" strokeWidth={3} />
                      </div>
                      <span className="text-gray-900 text-xs font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex bg-[#bd9245] text-gray-900 font-bold px-5 py-2.5 rounded-lg text-xs">
                  {preview.exploreCtaLabel}
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-[#bd9245]" />
                    <span className="text-gray-900 text-sm font-semibold">{preview.explorePhone}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-0.5">{preview.explorePhoneLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
