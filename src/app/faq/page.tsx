import { BRAND } from "@/data/brand";
import { TextPageShell } from "@/components/TextPage";
import { asset } from "@/lib/asset";

export default function FaqPage() {
  return (
    <TextPageShell>
      <div className="text-page">
        <div className="al-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="al-standing" src={asset("/images/dog-hero.png")} alt={BRAND.mascot} />
          <div className="al-quote">
            <div className="al-attr">{BRAND.mascot}說：</div>
            <div className="al-quote-text">「嚎——這片雞霸也太香了吧！」</div>
          </div>
        </div>

        <p className="headline">Q：嚎大大雞霸是什麼？</p>
        <p>
          A：{BRAND.name}是原肉低溫烘培的寵物雞排零食，給狗狗、貓咪當獎勵點心。一片一片咬，滿足感滿滿。
        </p>

        <p className="headline">Q：有加防腐劑嗎？</p>
        <p>A：沒有。我們堅持無添加防腐劑，配方簡單清楚，毛孩爸媽比較安心。</p>

        <p className="headline">Q：怎麼餵比較好？</p>
        <p>
          A：可整片當作訓練獎勵，也可掰小塊分次給。請依毛孩體型與日常飲食適量餵食，並準備充足飲水。
        </p>

        <p className="headline">Q：保存方式？</p>
        <p>A：開封後請密封冷藏或儘快食用，避免受潮。詳細保存說明請見包裝標示。</p>
      </div>
    </TextPageShell>
  );
}
