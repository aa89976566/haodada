# 嚎大大雞霸

匠寵 FURMOSA 寵物原肉雞排零食形象站（Next.js + GitHub Pages）。

桌面三欄：左右固定側欄、中央可捲聊天；進場 ENTER；CTA 導向 LINE @FURMOSA。

## 開發

```bash
npm install
npm run dev
```

## 部署

正式站只由 `.github/workflows/deploy-pages.yml` 發布到 `gh-pages` branch
（repository Pages source 目前是 legacy / `gh-pages`，不是 GitHub Actions）。
PR 檢查走 `.github/workflows/ci.yml`，不會發布正式站。

正式網址：https://www.furmosa.com/haodada/

GitHub Pages 仍作為靜態來源，尚未關閉：
https://aa89976566.github.io/haodada/

## 分析事件

沒有內建第三方追蹤。若要接正式 provider，在 runtime 提供：

```js
window.haodadaAnalytics = {
  track(event, payload) {
    // enter_clicked | print_completed | product_clicked | line_clicked | video_played
  },
};
```

未提供時 production 為 no-op，不收集個資。
