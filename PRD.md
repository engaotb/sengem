# PRD: SinGame - Offline Quiz Game with Fixed Team Sidebar (Large Screen Only)

## ✅ Overview:
SinGame is a fully offline, local web-based quiz game built for display on **large screens** (projector or desktop only). It is intended to be run by a game host using a browser and includes a fixed sidebar for managing 5 teams with their scores and helper tools. The game loads all data from a local JSON file and is GitHub Pages compatible.

---

## 🎯 Key Features:
- 4 categories, each with 3 question difficulty levels (200, 400, 600)
- Main screen with interactive category board
- Each question displays in full-screen mode
- **Fixed right sidebar** showing:
  - 5 teams, their scores, and helper status
- Timer for each question (120s)
- Manual point assignment and helper usage
- Fully static and local (HTML/CSS/JS only)
- Not responsive — designed for **large screens only**

---

## 📱 Main UI Layout

```
┌──────────────────────────────────────────────┬────────────────────────┐
│                 Game Logo + Reset Button     │                        │
├──────────────────────────────────────────────┤   FIXED TEAM SIDEBAR  │
│        Category Grid (4 categories x 3 Qs)   │                        │
│                                              │  👉 TEAM 1: 400 pts     │
│   Category Image                              │  🧑‍🤝‍🧑 ❌ 🌐 (active)   │
│   [200] [400] [600] buttons                   │                        │
│                                              │  👉 TEAM 2: 200 pts     │
│                                              │  🧑‍🤝‍🧑 ❌ 🌐 (used)     │
│                                              │                        │
│   ...                                         │  👉 TEAM 5: 0 pts       │
└──────────────────────────────────────────────┴────────────────────────┘
```

- The sidebar is visible on **all screens**, including question view
- Team points and helpers update in real-time using JavaScript/localStorage

---

## 🧩 Question View Layout

- Top: Category name + timer [▶️ ⏸ 🔁]
- Middle:
  - Question image (if available)
  - Question text
  - Reveal Answer button
  - Back to Main button
- Right (unchanged): Sidebar with 5 teams, scores, lifelines

---

## 🛠 Lifelines (Per Team)
Each team starts with 3 helpers:
- 🧑‍🤝‍🧑 Ask someone in the room
- ❌ Remove 2 answers
- 🌐 20s Google search

→ When used, helper icon becomes gray or semi-transparent.

---

## ⏱ Timer Logic

- Each question has a 120s countdown
- Controlled manually with start/pause/reset buttons
- Large display font for readability

---

## 📁 JSON Format (questions.json)

```json
{
  "History": {
    "image": "images/history.jpg",
    "questions": [
      {
        "points": 200,
        "question": "Who discovered America?",
        "answer": "Christopher Columbus",
        "image": "images/columbus.jpg"
      }
    ]
  }
}
```

- Stored locally in `questions.json`
- Images must be local (`/images/`)

---

## 🧠 Behavior & Local State

### State Stored with `localStorage`:
- Team scores: `teamScores = [400, 200, 0, 0, 0]`
- Used helpers: `teamHelpers = { team1: ["ask"], team2: ["ask", "google"] }`
- Used questions: `["History_200", "Islamic_400"]`

### Question Buttons:
- Disabled once used
- Replaced with a ✅ icon or “Used” text

---

## 🖥 File Structure

```
/sengame
├── index.html         # Category selection screen with fixed team sidebar
├── question.html      # Full question screen (optional modal)
├── style.css          # All UI styling, fixed width
├── script.js          # Logic for state, lifelines, timer, score
├── questions.json     # Game questions and structure
└── /images/           # Local category and question images
```

---

## 💻 Deployment Notes

- Works from local files (`file:///`) or GitHub Pages
- No frameworks, no internet, no database
- No mobile support (large screens only)
- Clear separation between questions UI and team control

---

## ✅ Deliverables

- Fully functional, offline, quiz board
- Fixed sidebar with live team score/helper tracking
- Large screen–only UI with minimal interactions
- Static file-based architecture (for GitHub Pages or local hosting)
