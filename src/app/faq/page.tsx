import { BRAND } from "@/data/brand";
import { TextPageShell } from "@/components/TextPage";
import { asset } from "@/lib/asset";

export default function FaqPage() {
  return (
    <TextPageShell>
      <div className="text-page">
        <div className="al-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="al-standing"
            src={asset("/images/haodada/eat-bulldog.png")}
            alt={BRAND.mascot}
          />
          <div className="al-quote">
            <div className="al-attr">{BRAND.mascot} says:</div>
            <div className="al-quote-text">
              “DON’t LET big kibble PROHIBIT YOU from these delicacies!”
            </div>
          </div>
        </div>

        <p className="headline">Q: Wait, so what exactly is {BRAND.name}?</p>
        <p>
          A: Original-meat chicken jerky snacks for dogs & cats — low-temp baked, no preservatives,
          maximum howling.
        </p>

        <p className="headline">Q: Are these snacks vegetarian/vegan/paleo/etc?</p>
        <p>They’re real chicken. Paleolithic for puppies. Not vegan. Extremely delicious.</p>

        <p className="headline">Q: Will I get in trouble for feeding these?</p>
        <p>
          A: Only if you run out. {BRAND.name} uses clean ingredients and no mystery additives —
          just meat, heat, and vibes.
        </p>
      </div>
    </TextPageShell>
  );
}
