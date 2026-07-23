import { TextPageShell } from "@/components/TextPage";

export default function FaqPage() {
  return (
    <TextPageShell>
      <div className="text-page">
        <div className="al-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="al-standing" src="/images/al-standing.png" alt="Illegal Al" />
          <div className="al-quote">
            <div className="al-attr">Illegal al says:</div>
            <div className="al-quote-text">
              “DON’t LET big horse PROHIBIT YOU from eating these delicacies!”
            </div>
          </div>
        </div>

        <p className="headline">
          Q: Wait, so every box has 4 bags of chips, but there are only 3 flavors?
        </p>
        <p>
          A: This is correct. The fourth bag is selected at random, so you’ll get two of one
          flavor.
        </p>

        <p className="headline">Q: Are these chips vegetarian/vegan/paleo/etc?</p>
        <p>
          They’re all kosher! Horse and Fugu are vegan, and Casu Marzu is vegetarian.
        </p>

        <p className="headline">Q: Will I get in trouble with the law for eating these chips?</p>
        <p>
          A: No you will not. Illegal Chips use flavor science to recreate these tastes without
          using any of the restricted ingredients.
        </p>
      </div>
    </TextPageShell>
  );
}
