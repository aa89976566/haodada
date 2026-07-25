import { BRAND } from "@/data/brand";
import { TextPageShell } from "@/components/TextPage";
import { asset } from "@/lib/asset";

export default function ManifestoPage() {
  return (
    <TextPageShell>
      <div className="text-page">
        <div className="al-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="al-standing" src={asset("/images/dog-hero.png")} alt={BRAND.mascot} />
          <div className="al-quote">
            <div className="al-attr">{BRAND.mascot}說：</div>
            <div className="al-quote-text">「給我雞霸，不然我嚎！」</div>
          </div>
        </div>

        <p>
          毛孩值得被認真對待的零食。不是隨便的碎屑餅乾，而是看得到肉纖維、咬得到紮實口感的原肉雞排。
        </p>
        <p>
          {BRAND.name}的起點很單純：嚎大大愛吃，我們才敢推薦。原肉製作、低溫烘培、無添加防腐劑——每一項都是寫給毛孩家長的承諾。
        </p>
        <p>
          獎勵不該是妥協。訓練成功的那一刻、回家進門的搖尾巴、睡前一口小點心——都值得一片香氣滿滿的雞霸。
        </p>
        <p>
          少一點來路不明的添加，多一點看得見的食材。讓毛孩開心嚎叫的，是真心好物，不是行銷話術。
        </p>
        <p>生得太晚，沒能和恐龍玩飛盤；生得剛好，可以大口咬嚎大大雞霸。</p>
      </div>
    </TextPageShell>
  );
}
