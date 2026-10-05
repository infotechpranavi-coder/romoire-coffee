import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Coffee, Sparkles, CheckCircle2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story | Romoire | Dairy Free Coffee Premix, Made in India",
  description:
    "Why Romoire exists: a vegan friendly, lactose free instant coffee built on single origin Arabica from Chikmagalur, coconut milk and monk fruit. No dairy, no refined sugar.",
};

export default function AboutPage() {
  return (
    <div className="bg-white text-ink pt-20 md:pt-24 selection:bg-maroon selection:text-cream">
      {/* ============ HERO SECTION ============ */}
      <section className="bg-white py-14 sm:py-20 lg:py-24 border-b border-line">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Story Headline & Premise */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2">
                <span className="text-[12px] tracking-[3px] uppercase font-medium text-[#8A3A3A]">
                  Our story
                </span>
                <span className="w-8 h-[1px] bg-[#8A3A3A]/30" />
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] leading-[1.08] text-maroon font-medium tracking-tight">
                Good coffee shouldn&apos;t depend on where you are.
              </h1>

              <p className="font-outfit text-lg sm:text-[19px] leading-[1.65] text-ink-soft max-w-[500px] font-light">
                Single origin Arabica. Real café froth. No dairy, no refined sugar. One sachet, anywhere you are.
              </p>

              <div className="pt-2 flex flex-wrap gap-2.5">
                {[
                  "Single Origin Arabica",
                  "Pure Coconut Milk",
                  "Monk Fruit Sweetened",
                  "100% Dairy-Free",
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-maroon bg-cream/70 border border-maroon/15 px-3 py-1.5 rounded-[2px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/#range"
                  className="inline-flex items-center justify-center bg-maroon hover:bg-maroon-deep text-cream text-[13px] tracking-[1.8px] uppercase font-medium py-4 px-8 rounded-[2px] transition-colors border border-maroon shadow-sm"
                >
                  Shop The Range
                </Link>
                <Link
                  href="#problem"
                  className="text-maroon text-[14px] tracking-[1px] border-b border-maroon/35 hover:border-maroon pb-1 inline-flex items-center gap-1.5 transition-colors"
                >
                  Read the origin story
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Cup Froth Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[3px] overflow-hidden border border-maroon/15 shadow-md bg-sand group">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                  <Image
                    src="/images/romoire/hero_cappuccino.jpg"
                    alt="Romoire frothy cappuccino made from a single sachet"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-cream">
                    <p className="text-xs uppercase tracking-[2px] text-[#E2BFA6] font-medium mb-1">
                      The Standard Cup
                    </p>
                    <p className="font-heading text-lg sm:text-xl font-normal leading-snug">
                      Rich body and micro-froth in thirty seconds, from nothing but hot water.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IT STARTED ON THE ROAD ============ */}
      <section id="problem" className="bg-cream py-20 sm:py-28 border-b border-line">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story text */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="mb-6">
                <span className="text-[12px] tracking-[3px] uppercase font-medium text-[#8A3A3A]">
                  The problem
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] text-maroon font-medium mt-3">
                  It started on the road.
                </h2>
              </div>

              <div className="space-y-6 text-ink-soft text-[17.5px] sm:text-[18.5px] leading-[1.8] font-light">
                <p>
                  Romoire began in airport lounges at 6 a.m., in cars between meetings, in hotel rooms where the only coffee was a sachet of something forgettable.
                </p>
                <p>
                  I love coffee: the aroma, the body, the first sip of a properly made cappuccino. So when I had to give up dairy, I went looking for a premix that could still deliver that.
                </p>
                <p>
                  I came up empty. What I could find was built on milk powder, or dissolved into something thin and chalky, or buried the coffee under sugar. Nothing gave me all three things I wanted in the same cup: café taste, no dairy, and no refined sugar.
                </p>
                <p className="font-heading text-2xl sm:text-3xl text-maroon font-medium italic pt-2">
                  So I made it.
                </p>
              </div>
            </div>

            {/* Preparation Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[3px] overflow-hidden border border-maroon/15 shadow-md bg-sand/80">
                <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full">
                  <Image
                    src="/images/romoire/step_pour.jpg"
                    alt="Pouring hot water to prepare Romoire dairy free coffee premix"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-[2px] border border-maroon/10">
                    <p className="font-heading text-maroon text-base font-medium">
                      One sachet. Hot water. One minute.
                    </p>
                    <p className="text-xs text-ink-mute mt-0.5">
                      No milk froth machines, no syrups, no compromises.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THREE THINGS. NO TRADE-OFFS ============ */}
      <section className="bg-white py-20 sm:py-28 border-b border-line">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="max-w-[760px] mb-14">
            <span className="text-[12px] tracking-[3px] uppercase font-medium text-[#8A3A3A]">
              The standard
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] text-maroon font-medium mt-3 mb-4">
              Three things. No trade-offs between them.
            </h2>
            <p className="font-outfit text-lg sm:text-[18.5px] leading-[1.75] text-ink-soft font-light">
              Most dairy free coffee asks you to give something up. Cleaner ingredients, but a thinner cup. No sugar, but no pleasure either. Romoire was built to refuse that trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Pillar 1 */}
            <div className="bg-cream/40 border border-maroon/12 p-8 rounded-[3px] flex flex-col justify-between hover:border-maroon/30 transition-colors">
              <div>
                <div className="w-10 h-[2px] bg-gold mb-5" />
                <h3 className="font-heading text-2xl text-maroon font-medium mb-3 leading-snug">
                  It has to taste like a café.
                </h3>
                <p className="font-outfit text-[15.5px] sm:text-[16px] leading-[1.75] text-ink-soft font-light">
                  Single origin Arabica from Chikmagalur, with no chicory and no fillers. Coconut milk that gives the cup real body instead of just colour. And a proper froth: the thick, stable layer that makes a cappuccino feel like a cappuccino, from nothing but hot water and thirty seconds of stirring. Rich and indulgent, in a plant based cappuccino premix.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-maroon/10 flex items-center gap-2 text-xs uppercase tracking-[1.5px] text-[#8A3A3A] font-medium">
                <Coffee className="w-4 h-4 text-gold" />
                Real Café Body &amp; Froth
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-cream/40 border border-maroon/12 p-8 rounded-[3px] flex flex-col justify-between hover:border-maroon/30 transition-colors">
              <div>
                <div className="w-10 h-[2px] bg-gold mb-5" />
                <h3 className="font-heading text-2xl text-maroon font-medium mb-3 leading-snug">
                  It has to be completely dairy-free.
                </h3>
                <p className="font-outfit text-[15.5px] sm:text-[16px] leading-[1.75] text-ink-soft font-light">
                  No milk powder, no milk solids, no lactose. Not a version of something else with the dairy taken out, but built this way from the first batch — vegan friendly, and lactose free by design rather than by subtraction.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-maroon/10 flex items-center gap-2 text-xs uppercase tracking-[1.5px] text-[#8A3A3A] font-medium">
                <Sparkles className="w-4 h-4 text-gold" />
                100% Plant Based &amp; Lactose Free
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-cream/40 border border-maroon/12 p-8 rounded-[3px] flex flex-col justify-between hover:border-maroon/30 transition-colors">
              <div>
                <div className="w-10 h-[2px] bg-gold mb-5" />
                <h3 className="font-heading text-2xl text-maroon font-medium mb-3 leading-snug">
                  It has to be sweet without the sugar.
                </h3>
                <p className="font-outfit text-[15.5px] sm:text-[16px] leading-[1.75] text-ink-soft font-light">
                  Monk fruit instead of refined sugar. It is a plant-based sweetener that carries no calories of its own. The sweetness sits behind the coffee, not in front of it.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-maroon/10 flex items-center gap-2 text-xs uppercase tracking-[1.5px] text-[#8A3A3A] font-medium">
                <CheckCircle2 className="w-4 h-4 text-gold" />
                Zero Refined Sugar
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-[16px] text-ink-soft font-light">
              The full ingredient list and nutritional panel are on every product page.
            </p>
            <Link
              href="/#ingredients"
              className="text-maroon text-[15px] tracking-[1.1px] border-b border-maroon/35 hover:border-maroon pb-0.5 inline-flex items-center gap-1.5 transition-colors font-medium self-start sm:self-auto"
            >
              See what&apos;s in each flavour →
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CHIKMAGALUR ============ */}
      <section className="bg-cream py-20 sm:py-28 border-b border-line">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story text */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="mb-6">
                <span className="text-[12px] tracking-[3px] uppercase font-medium text-[#8A3A3A]">
                  Made in India
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] text-maroon font-medium mt-3">
                  Single origin. Chikmagalur.
                </h2>
              </div>

              <div className="space-y-6 text-ink-soft text-[17.5px] sm:text-[18.5px] leading-[1.8] font-light">
                <p>
                  Our Arabica comes from one place: Chikmagalur, in the hills of Karnataka, where coffee was first planted in India nearly four hundred years ago. Single origin, not a blend of whatever beans were cheapest that month.
                </p>
                <p>
                  Single origin is a harder promise to keep than a blend. It ties us to one region&apos;s harvest rather than to whatever the market is offering that month, and it means holding lot-level records back to the estate. We think a cup with a place behind it is worth the constraint.
                </p>
                <p className="text-maroon font-medium">
                  Romoire is sourced and made in India, start to finish. The beans, the formulation, the production.
                </p>
              </div>

              <div className="pt-6 flex items-center gap-3 text-xs uppercase tracking-[2px] text-ink-mute">
                <MapPin className="w-4 h-4 text-maroon shrink-0" />
                <span>Western Ghats · Chikmagalur, Karnataka · Elevation 1,200m</span>
              </div>
            </div>

            {/* Estate Photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[3px] overflow-hidden border border-maroon/15 shadow-md bg-sand">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full">
                  <Image
                    src="/images/romoire/chikmagalur_estate.jpg"
                    alt="Chikmagalur coffee estate in Karnataka, India"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/60 via-transparent to-transparent opacity-75" />
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-cream">
                    <p className="text-xs uppercase tracking-[2px] text-[#E2BFA6] font-medium mb-1">
                      Origin Verified
                    </p>
                    <p className="font-heading text-lg sm:text-xl font-normal leading-snug">
                      Shade-grown Arabica from the birthplace of Indian coffee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEWER THINGS ============ */}
      <section className="bg-white py-20 sm:py-28 border-b border-line">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Product photo */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-[3px] overflow-hidden border border-maroon/15 shadow-md bg-sand">
                <div className="relative aspect-[4/3] sm:aspect-[5/4] w-full">
                  <Image
                    src="/image of 4 flavours.png"
                    alt="Romoire Vanilla, Espresso, Mocha and Hazelnut coffee premix sachets"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Right: Copy */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col">
              <div className="mb-6">
                <span className="text-[12px] tracking-[3px] uppercase font-medium text-[#8A3A3A]">
                  Our standard
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] text-maroon font-medium mt-3">
                  Fewer things. Done properly.
                </h2>
              </div>

              <div className="space-y-6 text-ink-soft text-[17.5px] sm:text-[18.5px] leading-[1.8] font-light">
                <p>
                  We&apos;d rather do a few things properly than a lot of things adequately. One standard, and nothing goes in a box until it holds up to it.
                </p>
                <p>
                  Anything that doesn&apos;t meet it doesn&apos;t get made.
                </p>
              </div>

              <div className="pt-8">
                <Link
                  href="/#range"
                  className="inline-flex items-center justify-center bg-maroon hover:bg-maroon-deep text-cream text-[13px] tracking-[1.8px] uppercase font-medium py-4 px-9 rounded-[2px] transition-colors border border-maroon shadow-sm"
                >
                  See The Flavours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE PERSON BEHIND IT ============ */}
      <section className="bg-maroon-mid text-cream py-20 sm:py-28">
        <div className="max-w-[820px] mx-auto px-6 sm:px-8">
          <div className="mb-8">
            <span className="text-[12px] tracking-[3px] uppercase font-medium text-[#E2BFA6]">
              The person behind it
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[48px] leading-[1.1] text-cream font-medium mt-3">
              Sonakshi Raj.
            </h2>
          </div>

          <div className="space-y-6 text-[#F3DFCB] text-[17.5px] sm:text-[18.5px] leading-[1.85] font-light">
            <p>
              I set out to find a cup of coffee I could actually drink, and ended up making it myself. Now I&apos;m making it for you.
            </p>
            <p>
              I have a master&apos;s in engineering from Queen&apos;s University, Canada, and I approached this formula the way I was trained to approach any problem: define the standard, test against it, change one variable, test again. It took eight months and more formulations than I care to count before one of them met the standard.
            </p>
            <p>
              Every batch since has been held to that same cup.
            </p>
            <p className="text-white font-normal">
              If you try Romoire and it isn&apos;t right, write to me. It comes to my inbox.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-cream/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="relative w-44 h-16">
                <Image
                  src="/images/romoire/founder_signature.png"
                  alt="Sonakshi Raj Signature"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-xs uppercase tracking-[2px] text-[#E2BFA6] font-medium">
                Sonakshi Raj · Founder, Romoire
              </p>
            </div>

            <a
              href="mailto:hello@romoire.com"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[1.8px] text-[#F3DFCB] hover:text-white border border-[#E2BFA6]/40 hover:border-white py-3 px-5 rounded-[2px] transition-colors self-start sm:self-auto"
            >
              <Mail className="w-3.5 h-3.5 text-gold" />
              Write To Sonakshi
            </a>
          </div>
        </div>
      </section>

      {/* ============ CLOSING BANNER ============ */}
      <section className="bg-maroon-deep text-cream py-24 sm:py-28 text-center border-t border-maroon">
        <div className="max-w-[1240px] mx-auto px-6 sm:px-8">
          <div className="max-w-[700px] mx-auto flex flex-col items-center gap-7">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[54px] text-cream font-medium leading-[1.14]">
              Real coffee. Anywhere you are.
            </h2>
            <p className="text-base sm:text-lg text-[#F3DFCB] font-light max-w-[480px]">
              One sachet of single origin Chikmagalur Arabica, real froth, and no refined sugar.
            </p>
            <div className="pt-2">
              <Link
                href="/#range"
                className="inline-flex items-center justify-center bg-cream hover:bg-white text-maroon text-[13px] tracking-[1.8px] uppercase font-medium py-4 px-10 rounded-[2px] transition-all duration-200 border border-cream shadow-md"
              >
                Shop The Range
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
