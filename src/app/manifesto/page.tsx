import { BRAND } from "@/data/brand";
import { TextPageShell } from "@/components/TextPage";
import { asset } from "@/lib/asset";

export default function ManifestoPage() {
  return (
    <TextPageShell>
      <div className="text-page">
        <div className="al-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="al-standing"
            src={asset("/images/haodada/hero-black.png")}
            alt={BRAND.mascot}
          />
          <div className="al-quote">
            <div className="al-attr">{BRAND.mascot} says:</div>
            <div className="al-quote-text">&quot;Give me {BRAND.shortName} or give me death!&quot;</div>
          </div>
        </div>

        <p>
          The distinction between boring kibble and legendary treats is a social construction. In a
          state of nature, dogs eat whatever makes them howl with joy.
        </p>
        <p>
          Prohibitions create desire. Forbidden chicken tastes sweetest. {BRAND.name} compiles the
          snacks your pet’s tastebuds have been lobbying for. And, buddy, do they ever slap.
        </p>
        <p>
          Technological advances free us from mystery fillers. Low-temp baking is the future — our
          path to disengaging treat production from industrial fluff and the sheer inefficiency of
          empty calories.
        </p>
        <p>
          Science is blinded by nostalgia for the familiar biscuit. Why simulate chicken when you
          can bake the real thing? Better late than never — it’s time to move from treat realism to
          treat modernism.
        </p>
        <p>
          Born too late to hunt mammoths. Born too early to order from Mars. Born just in time to
          eat {BRAND.name}.
        </p>
      </div>
    </TextPageShell>
  );
}
