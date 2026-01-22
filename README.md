# LCK 2026 Calendar Subscription | LCK 2026 賽程訂閱日曆

[![Update LCK Calendar](https://github.com/liiiichi/lck-calendar/actions/workflows/main.yml/badge.svg)](https://github.com/liiiichi/lck-calendar/actions/workflows/main.yml) 

> **Automated, live-updating calendar for the LCK 2026 season.** > **基於 GitHub Actions 自動更新的 LCK 2026 賽程日曆。**

Includes live scores, flex scheduling updates, and alarms.  
包含即時比分更新、賽程異動同步以及賽前提醒功能。

---

## Subscription URL / 訂閱連結

Copy the link below and add it to your calendar app.  
複製下方連結並添加至您的日曆應用中。

https://raw.githubusercontent.com/liiiichi/lck-calendar/refs/heads/main/lck_2026.ics

> **Note / 注意**:
> If you cannot access the link due to network issues (e.g., in Mainland China), try using a GitHub proxy service or CDN.
> 若因網路問題無法訪問 `raw.githubusercontent.com`，請嘗試使用免費的 CDN 加速服務。

---

## How to Use / 使用方法

### iOS (iPhone/iPad)

1. Go to **Settings** → **Apps** → **Calendar** → **Calendar Accounts**.
*(On older iOS: **Settings** → **Calendar** → **Accounts**)*
2. Tap **Add Account** → **Other** → **Add Subscribed Calendar**.
3. Paste the [Subscription URL](https://raw.githubusercontent.com/liiiichi/lck-calendar/refs/heads/main/lck_2026.ics) above.
4. **Done!**
---
1. 前往 **設定** → **Apps** → **日曆** → **日曆帳號**。
*(舊版 iOS：**設定** → **密碼與帳號** 或 **日曆** → **帳號**)*
2. 點擊 **加入帳號** → **其他** → **加入已訂閱的行事曆**。
3. 貼上上方的 [訂閱連結](https://raw.githubusercontent.com/liiiichi/lck-calendar/refs/heads/main/lck_2026.ics)。
4. **完成！**

### Android / Google Calendar

1. Open [Google Calendar (Web)](https://calendar.google.com/).
2. On the left sidebar, click the `+` next to **"Other calendars"**.
3. Select **From URL**.
4. Paste the [Subscription URL](https://raw.githubusercontent.com/liiiichi/lck-calendar/refs/heads/main/lck_2026.ics) above.
---
1. 開啟電腦版 [Google 日曆網頁](https://calendar.google.com/)。
2. 在左側欄位找到「其他日曆」，點擊旁邊的 `+` 號。
3. 選擇 **加入日曆網址** (From URL)。
4. 貼上上方的 [訂閱連結](https://raw.githubusercontent.com/liiiichi/lck-calendar/refs/heads/main/lck_2026.ics)。

---

## Features / 功能特色

| Feature | Description | 說明 |
| --- | --- | --- |
| **Daily Updates** | Runs daily at 00:00 UTC to sync Flex Scheduling times. | 每日自動抓取最新賽程，確保時間準確。 |
| **Live Scores** | Titles update automatically: `T1 vs GEN` → `T1 vs GEN 2:1`. | 比賽結束後自動更新標題顯示比分（如：`T1 vs GEN 2:1`）。 |
| **Smart Alarms** | Includes a notification **5 minutes** before match start. | 內建比賽開始前 **5 分鐘** 的通知提醒。 |
| **Clean Data** | Auto-converts acronyms (`HLE`) & filters out CL matches. | 隊名自動轉為縮寫（如 `HLE`），並已過濾次級聯賽（CL）。 |

---

## Development / 開發資訊

If you want to fork this repo or run it locally:

* **Source:** Data fetched from the [Leaguepedia API](https://lol.fandom.com/wiki/Category:Developer_Documentation).
* **Logic:** Node.js + `ics` library + GitHub Actions.
* **Smart Update:** The script ignores `DTSTAMP` changes, so it only commits to the repo when match data (time/score) *actually* changes.

### Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/liiiichi/lck-calendar.git

# 2. Install dependencies
npm install

# 3. Run the script
# Note: You must set LEAGUE_USER and LEAGUE_PASS environment variables first!
node index.js

```