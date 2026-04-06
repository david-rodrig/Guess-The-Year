# Guess The Year — תיעוד מלא

> עדכון אחרון: אפריל 2026

---

## תוכן עניינים

1. [סקירת הפרויקט](#סקירת-הפרויקט)
2. [טכנולוגיות](#טכנולוגיות)
3. [מבנה הפרויקט](#מבנה-הפרויקט)
4. [מסד הנתונים](#מסד-הנתונים)
5. [זרימת המשחק](#זרימת-המשחק)
6. [חישוב ניקוד](#חישוב-ניקוד)
7. [רשימת השירים](#רשימת-השירים)
8. [Real-time Multiplayer](#real-time-multiplayer)
9. [היסטוריית שינויים](#היסטוריית-שינויים)

---

## סקירת הפרויקט

**Guess The Year** הוא משחק טריוויה מוזיקלי מולטיפלייר בזמן אמת.
שחקנים שומעים קטע מיוטיוב ומנסים לנחש באיזו שנה יצא השיר.

- ניתן לבחור עשורים (70s עד 20s)
- המארח יוצר חדר עם קוד 4 ספרות
- שחקנים אחרים מצטרפים עם הקוד
- 10 שאלות לכל משחק, ניקוד לפי קירבה לשנה הנכונה
- לוח מובילים בזמן אמת

---

## טכנולוגיות

| שכבה | טכנולוגיה |
|---|---|
| Frontend | React 19 + Vite 8 |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth (username → email פנימי) |
| Real-time | Supabase Realtime Channels (Presence + Broadcast) |
| וידאו | YouTube IFrame API |
| Deployment | Vercel |
| CSS | Vanilla CSS (סגנון synthwave/neon) |

---

## מבנה הפרויקט

```
Guess-The-Year/
├── src/
│   ├── main.jsx              # נקודת כניסה React
│   ├── App.jsx               # ניהול state גלובלי: session, room
│   ├── Auth.jsx              # מסך login/signup (username בלבד)
│   ├── Lobby.jsx             # מסך יצירת/הצטרפות לחדר
│   ├── DecadeSelect.jsx      # בחירת עשורים (Host בלבד)
│   ├── Game.jsx              # לוגיקת המשחק המלאה + YouTube + Real-time
│   ├── App.css               # סגנונות בסיסיים
│   ├── index.css             # סגנון neon/synthwave
│   └── lib/
│       └── supabase.js       # Supabase client
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql   # profiles, user_roles, trigger
│       └── 002_multiplayer.sql      # rooms table
├── lib/
│   ├── auth.ts               # auth helpers (TypeScript)
│   ├── roles.ts              # roles helpers
│   └── supabase.ts           # Supabase client (TypeScript)
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── docs/
│   └── DOCUMENTATION.md      # קובץ זה
├── .env.local                # משתני סביבה (לא ב-git)
├── .env.local.example        # תבנית משתני סביבה
├── package.json
├── vite.config.js
└── index.html
```

---

## מסד הנתונים

### טבלת `profiles`
נוצרת אוטומטית בעת הרשמה דרך Trigger.

| עמודה | סוג | תיאור |
|---|---|---|
| id | uuid (PK) | מחובר ל-auth.users |
| username | text (unique) | שם משתמש |
| full_name | text | שם לתצוגה |
| avatar_url | text | URL של אוואטר (DiceBear pixel-art) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**RLS:** כולם יכולים לקרוא, רק הבעלים יכול לכתוב.

### טבלת `user_roles`
| עמודה | סוג |
|---|---|
| id | bigint (PK) |
| user_id | uuid → auth.users |
| role | enum: admin / user / guest |

### טבלת `rooms`
| עמודה | סוג | תיאור |
|---|---|---|
| id | uuid (PK) | |
| code | text (unique) | קוד 4 ספרות |
| host_id | uuid → auth.users | |
| status | text | waiting / playing / finished |
| created_at | timestamptz | |

**RLS:** כולם קוראים, רק המארח מעדכן.

### Trigger: `on_auth_user_created`
כאשר משתמש חדש נרשם, הטריגר `handle_new_user()` יוצר אוטומטית:
- שורה ב-`profiles` עם `full_name` ו-`avatar_url` מהמטא-דאטה
- שורה ב-`user_roles` עם `role = 'user'`

---

## זרימת המשחק

```
Auth (login/signup)
    ↓
Lobby
    ├── Create Room → DecadeSelect → Game (isHost=true)
    └── Join Room (קוד 4 ספרות) → Game (isHost=false)
                                        ↓
                              [Host] Next Question
                                        ↓
                              YouTube IFrame מתחיל
                                        ↓
                        שחקנים מגישים ניחוש (שנה)
                                        ↓
                    כשכולם ניחשו / הסרטון נגמר → Reveal
                                        ↓
                              ניקוד + Leaderboard
                                        ↓
                              [Host] Next Question...
```

### Auth (Auth.jsx)
- שם משתמש בלבד (ללא אימייל גלוי) — מומר פנימית ל-`username@guess-the-year.app`
- אוואטר נוצר אוטומטית עם DiceBear pixel-art לפי שם המשתמש

### Lobby (Lobby.jsx)
- המארח לוחץ "CREATE NEW HOST ROOM" → עובר ל-DecadeSelect
- לאחר בחירת עשורים: קוד חדר נוצר אקראית (4 ספרות), נשמר ב-Supabase
- שחקן אחר מזין קוד ומצטרף

### DecadeSelect (DecadeSelect.jsx)
- 6 עשורים: 70s, 80s, 90s, 00s, 10s, 20s
- בחירה מרובה אפשרית, לפחות אחד חובה
- רק המארח בוחר — העשורים עוברים כ-prop ל-Game

### Game (Game.jsx)
1. **הצטרפות לחדר**: Supabase Presence channel `room:{code}`
2. **המארח** לוחץ "NEXT QUESTION":
   - בפעם הראשונה: מסנן שירים לפי עשורים שנבחרו, מערבל, לוקח 10
   - שולח `broadcast: new_question` עם פרטי השיר
3. **כל שחקן** רואה את YouTube IFrame עם הסרטון
4. שחקן מגיש שנה → `broadcast: player_guessed`
5. כאשר כולם ניחשו **או** הסרטון הסתיים → `revealAnswer()`
6. מציג feedback + leaderboard אחרי 1 שניה
7. המארח עובר לשאלה הבאה

---

## חישוב ניקוד

```js
const diff = Math.abs(guessedYear - correctYear);
const points = Math.max(0, 10 - diff * 2);
```

| הפרש בשנים | ניקוד |
|---|---|
| 0 (מדויק) | 10 |
| 1 | 8 |
| 2 | 6 |
| 3 | 4 |
| 4 | 2 |
| 5+ | 0 |

- ניקוד מצטבר על פני 10 שאלות
- הניקוד מתפרסם בזמן אמת לכל השחקנים דרך `broadcast: score_update`
- אם לא ניחשת לפני שהזמן נגמר — 0 נקודות

---

## רשימת השירים

הבסיס כולל ~350 שירים מכוסים לפי עשורים:

| עשור | שנים | מספר שירים |
|---|---|---|
| 70s | 1970–1979 | ~62 |
| 80s | 1980–1989 | ~65 |
| 90s | 1990–1999 | ~55 |
| 00s | 2000–2009 | ~57 |
| 10s | 2010–2019 | ~57 |
| 20s | 2020–2024 | ~43 |

כל שיר כולל: `title`, `artist`, `year`, `youtubeId`.

לכל משחק נבחרים אקראית **10 שירים** מהעשורים שהמארח בחר.

---

## Real-time Multiplayer

**ערוץ**: `room:{roomCode}` דרך Supabase Realtime.

### אירועים

| אירוע | כיוון | תוכן |
|---|---|---|
| `presence sync` | Server→Client | רשימת שחקנים מחוברים |
| `new_question` | Host broadcast | `{ song, round }` |
| `player_guessed` | Client broadcast | `{ userId }` |
| `score_update` | Client broadcast | `{ userId, newScore }` |

### Presence
- כל שחקן מבצע `ch.track({ name, avatar })`
- ה-`presenceState` משמש לזיהוי כמה שחקנים בחדר
- כשכולם שלחו ניחוש → חשיפה אוטומטית

---

## היסטוריית שינויים

מסודר מהאחרון לראשון:

| commit | שינוי |
|---|---|
| `cab892b` | fix: עדכון YouTube IDs לדיוק |
| `bfc41ad` | feat: הוספת הרשאות web fetch/search |
| `6f653bb` | feat: שירים חדשים, הסרת placeholder |
| `5ef2776` | feat: הרחבת בסיס השירים ל-~216 (40-50 לעשור) |
| `897089b` | fix: שידור מספר סיבוב לכל השחקנים |
| `c55224c` | feat: הצגת מספר סיבוב על לוח המובילים |
| `61a6a7a` | feat: בחירת עשורים רק למארח |
| `4fba5a9` | feat: כפתור סגירה ל-leaderboard overlay |
| `743b5a9` | feat: עצירת מוזיקה כשמוצג לוח המובילים |
| `95183a6` | feat: ניקוד לפי קירבה (max 10, -2 לכל שנה) |
| `b720db5` | feat: הצגת התשובה הנכונה ב-leaderboard |
| `e7abaff` | feat: leaderboard overlay מלא לאחר שכולם עונים |
| `4ae2234` | feat: חשיפה רק לאחר שכולם שולחים או שהסרטון מסתיים |
| `571e877` | fix: decade select מתחיל ריק |
| `6299bfc` | feat: login עם username בלבד (ללא אימייל) |
| `395f75b` | feat: חשיפה אוטומטית כשהסרטון מסתיים |
| `f05221a` | fix: טווח שנים 1970–2024 |
| `6a78e07` | feat: מסך בחירת עשורים |
| `ed8979b` | feat: כפתור Leave/logout במסך המשחק |
