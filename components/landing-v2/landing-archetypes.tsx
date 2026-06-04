import { ArchetypeCardsGrid } from "@/components/landing-v2/archetype-cards-grid"

export function LandingArchetypes() {
  return (
    <section id="arquetipos" className="relative py-24 md:py-32 lv2-paper-texture">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="lv2-section-label mb-4">Arquetipos · Jung</p>
          <h2 className="lv2-display text-3xl text-[var(--lv2-ivory)] md:text-5xl">
            Las figuras que habitan en ti
          </h2>
          <p className="lv2-body mt-6 text-lg">
            No para clasificarte. Para despertar curiosidad sobre las fuerzas que moldean tu historia
            desde el inconsciente.
          </p>
        </div>

        <ArchetypeCardsGrid />

        <p className="lv2-body mx-auto mt-14 max-w-xl text-center text-sm italic">
          Pasa el cursor sobre cada figura. La sombra suele ser la que más tarda en mostrarse.
        </p>
      </div>
    </section>
  )
}
