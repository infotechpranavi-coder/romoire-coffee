'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';

export interface FixedDepartureRow {
  id: string;
  month: string;
  dates: string;
}

export interface ShortItineraryRow {
  id: string;
  day: number;
  title: string;
}

interface PackageTourExtrasFieldsProps {
  fixedDepartures: FixedDepartureRow[];
  setFixedDepartures: React.Dispatch<React.SetStateAction<FixedDepartureRow[]>>;
  shortItinerary: ShortItineraryRow[];
  setShortItinerary: React.Dispatch<React.SetStateAction<ShortItineraryRow[]>>;
  packageNotes: string[];
  setPackageNotes: React.Dispatch<React.SetStateAction<string[]>>;
  cancellationPolicy: string[];
  setCancellationPolicy: React.Dispatch<React.SetStateAction<string[]>>;
  reschedulingPolicy: string[];
  setReschedulingPolicy: React.Dispatch<React.SetStateAction<string[]>>;
  bookingPolicy: string[];
  setBookingPolicy: React.Dispatch<React.SetStateAction<string[]>>;
}

function StringListEditor({
  label,
  items,
  setItems,
}: {
  label: string;
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button type="button" variant="outline" size="sm" onClick={() => setItems((p) => [...p, ''])}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <Textarea
            rows={2}
            placeholder={`${label} item ${i + 1}`}
            value={item}
            onChange={(e) => setItems((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
          />
          {items.length > 1 && (
            <Button variant="ghost" size="icon" onClick={() => setItems((p) => p.filter((_, j) => j !== i))}>
              <Minus className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PackageTourExtrasFields({
  fixedDepartures,
  setFixedDepartures,
  shortItinerary,
  setShortItinerary,
  packageNotes,
  setPackageNotes,
  cancellationPolicy,
  setCancellationPolicy,
  reschedulingPolicy,
  setReschedulingPolicy,
  bookingPolicy,
  setBookingPolicy,
}: PackageTourExtrasFieldsProps) {
  return (
    <div className="space-y-6 border-t border-gray-100 pt-6">
      <h3 className="text-sm font-black uppercase tracking-widest text-[#6B1F2A]">Tour Departures & Policies</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Fixed Departures</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFixedDepartures((p) => [...p, { id: Date.now().toString(), month: '', dates: '' }])
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Month
          </Button>
        </div>
        {fixedDepartures.map((row) => (
          <Card key={row.id}>
            <CardContent className="pt-4 grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Month (e.g. April 2026)"
                value={row.month}
                onChange={(e) =>
                  setFixedDepartures((p) =>
                    p.map((r) => (r.id === row.id ? { ...r, month: e.target.value } : r))
                  )
                }
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Dates (e.g. 5th, 12th, 19th)"
                  value={row.dates}
                  onChange={(e) =>
                    setFixedDepartures((p) =>
                      p.map((r) => (r.id === row.id ? { ...r, dates: e.target.value } : r))
                    )
                  }
                />
                {fixedDepartures.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFixedDepartures((p) => p.filter((r) => r.id !== row.id))}
                  >
                    <Minus className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Short Itinerary (summary)</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setShortItinerary((p) => [
                ...p,
                { id: Date.now().toString(), day: p.length + 1, title: '' },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Day
          </Button>
        </div>
        {shortItinerary.map((row) => (
          <div key={row.id} className="flex gap-2">
            <Input
              className="w-20"
              type="number"
              min={1}
              value={row.day}
              onChange={(e) =>
                setShortItinerary((p) =>
                  p.map((r) => (r.id === row.id ? { ...r, day: parseInt(e.target.value, 10) || 1 } : r))
                )
              }
            />
            <Input
              placeholder="Day title"
              value={row.title}
              onChange={(e) =>
                setShortItinerary((p) =>
                  p.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r))
                )
              }
            />
            {shortItinerary.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShortItinerary((p) => p.filter((r) => r.id !== row.id))}
              >
                <Minus className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <StringListEditor label="Package Notes" items={packageNotes} setItems={setPackageNotes} />
      <StringListEditor label="Cancellation Policy" items={cancellationPolicy} setItems={setCancellationPolicy} />
      <StringListEditor label="Rescheduling Policy" items={reschedulingPolicy} setItems={setReschedulingPolicy} />
      <StringListEditor label="Booking Policy" items={bookingPolicy} setItems={setBookingPolicy} />
    </div>
  );
}
