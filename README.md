# NDC-Transition-Map

A web-based visualizer for NCR NDC (NCR Direct Connect) protocol, mapping transitions between ATM states and screens. Built with GoJS for interactive state linking and visualization. Helps developers, testers, and QA engineers explore and validate NDC flows.

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,html,css,tailwind" alt="Tech Stack" />
  </a>
  <br/>
  <img src="https://img.shields.io/badge/GoJS-Diagramming-1F6FEB?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMSIgc3Ryb2tlPSIjZmZmIiBmaWxsPSIjMDA3YWZmIi8+PHBhdGggZD0iTTkgN2g2djJoLTR2NGg0djJoLTZWN3oiIGZpbGw9IndoaXRlIi8+PC9zdmc+" alt="GoJS" height="28" />
</p>

**Live:** [https://najeem99.github.io/NDC-Transition-Map](https://najeem99.github.io/NDC-Transition-Map)

## Features

- **Interactive state graph:** Drag, pan, and zoom the canvas. Click nodes to view state/screen metadata. Hover tooltips and selectable links.
- **Visual transitions:** Directional links showing possible next states with labeled triggers.
- **Import:** Load flow definitions from JSON.
- **Editing tools:** Add/remove states and transitions. Edit labels, IDs, and state attributes in place.
- **Persistent storage:** auto-save to local storage.

## Use Cases

- **Protocol exploration:** Understand NDC message flows between screens and states.
- **Test design:** Derive test cases from transition paths; identify unreachable or terminal states.
- **Review and collaboration:** Share visual maps with devs, QA, and stakeholders.
- **Troubleshooting:** Trace user journeys to locate broken or ambiguous transitions.

## Getting Started

**Prerequisites:** Node.js 18+ and npm (or yarn/pnpm)

**Install dependencies:**
npm install

**Run locally:**
npm run dev

Open http://localhost:5173 (or printed port)
## Usage

- **Load sample:** Update Registry → Paste your .reg file → Convert and Save

**Tips:**  
Use unique state IDs; avoid dangling transitions. Label transitions with precise events (e.g., EMV_TC, PIN_OK, TIMEOUT). Use Error states for exception paths; highlight with a distinct color.

## Keyboard Shortcuts

- **Ctrl/Cmd + S:** Save to local storage
- **Delete/Backspace:** Remove selected item
- **Ctrl/Cmd + F:** Focus search
- **Space + Drag:** Pan canvas
- **Mouse wheel / Trackpad:** Zoom
