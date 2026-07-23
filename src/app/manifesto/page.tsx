import { TextPageShell } from "@/components/TextPage";

export default function ManifestoPage() {
  return (
    <TextPageShell>
      <div className="text-page">
        <div className="al-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="al-standing" src="/images/al-standing.png" alt="Illegal Al" />
          <div className="al-quote">
            <div className="al-attr">Illegal al says:</div>
            <div className="al-quote-text">
              &quot;Give me horse flavored chips or give me death!&quot;
            </div>
          </div>
        </div>

        <p>
          The distinction between food animals and non-food animals is a social construction. The
          same, of course, can be said of law in general. In a Hobbesian state of nature, humans
          live in constant conflict, eating whatever they feel like.
        </p>
        <p>
          Prohibitions create desire. The grass is always greener on the other side, and forbidden
          fruit tastes sweetest. Illegal Chips compiles the flavors the government doesn’t want you
          to try. And, buddy, do they ever taste good!
        </p>
        <p>
          Technological advances free us from the mundane concerns of the past. Artificial
          flavoring is the future, our path to disengaging food production from the deleterious
          environmental effects of industrial agriculture and the sheer inefficiency of living
          animals. Forget fully-automated luxury communism, our advances in food science will lead
          us to the promised future: fully-synthetic luxury omnivorism!
        </p>
        <p>
          Science is blinded by nostalgia for the past and the false idol of the familiar. Why
          simulate when you can make new? What a waste to devote millions in R&amp;D funding to the
          pursuit of artificial cow or chicken when all the animals of the earth stand arrayed
          before us for inspiration. Better late than never–it’s time to move from food realism to
          food modernism!
        </p>
        <p>
          Born too late to explore the earth. Born too early to explore the cosmos. Born just in
          time to eat horse chips.
        </p>
      </div>
    </TextPageShell>
  );
}
