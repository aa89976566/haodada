# haodada

## Cursor 專案連線設定

以下步驟可讓你在 Cursor 內正確開啟並連線此專案：

1. 安裝並登入 Cursor。
2. 取得專案（若尚未 clone）：
   - `git clone https://github.com/aa89976566/haodada.git`
3. 在 Cursor 內選擇 **File → Open Folder**，開啟 `haodada` 資料夾。
4. 第一次開啟時等待索引完成。
5. 在 Cursor 內建終端機確認：
   - `pwd`（需位於專案路徑）
   - `git remote -v`（需顯示 `aa89976566/haodada`）
6. 若要推送或拉取，請先完成 GitHub 認證（SSH 或 PAT）。

## 專案內建編輯器設定

本專案已提供 VS Code/Cursor 共用設定：

- `.vscode/settings.json`
  - 啟用儲存時自動格式化
  - 啟用儲存時整理 imports
  - 使用 LF 換行與 UTF-8 編碼
- `.vscode/extensions.json`
  - 推薦常用 GitHub/Copilot 擴充套件