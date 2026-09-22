# 萬聖節邀請函 + 報名網站

單一頁面的靜態網站（`index.html` + `assets/`），報名資料透過 Google Apps Script 寫進你的 Google 試算表，人數即時顯示在頁面上。

## 一、建後端（約 5 分鐘）

1. 到 [sheets.new](https://sheets.new) 開一個新試算表，命名「萬聖節報名」。
2. 上方選單 **擴充功能 → Apps Script**，把編輯器裡的內容全部刪掉，貼上 `Code.gs` 的內容，存檔。
3. 右上 **部署 → 新增部署作業**：
   - 類型：**網頁應用程式**
   - 執行身分：**我**
   - 誰可以存取：**所有人**（這樣朋友不用登入 Google 就能報名）
4. 按「部署」，第一次會要你授權，一路允許。
5. 複製「網頁應用程式網址」（`https://script.google.com/macros/s/…/exec`）。
6. 打開 `index.html`，找到最下面的 `var API_URL = "";`，把網址貼進引號裡。

> 之後如果改了 Code.gs，要重新「部署 → 管理部署作業 → 編輯 → 版本：新版本」，網址不會變。

## 二、放上網

**Vercel（最快）**：到 vercel.com → Add New → Project → 把整個資料夾拖進去（或 `npx vercel` 在資料夾裡跑一次）。

**GitHub Pages**：開一個 repo，把 `index.html` 和 `assets/` 推上去，Settings → Pages → Branch: main → 存檔。

不需要 build，也沒有任何相依套件。

## 三、可以改的東西

- `index.html` 頂部 `<script>` 裡：`DEADLINE`（報名期限）、`TARGET`（進度條目標人數）。
- `Code.gs` 裡的 `DEADLINE` 要跟上面一致，期限過後後端會直接拒收。
- 費用區塊的數字目前是預估（包廂三小時均分＋餐飲＋一成服務費），確認包廂價後改掉。

## 資料

試算表的「報名」工作表欄位：時間｜名字｜出席｜攜伴人數｜變裝主題｜備註｜LINE/聯絡。
同一個名字再送一次會覆蓋原本那列。
