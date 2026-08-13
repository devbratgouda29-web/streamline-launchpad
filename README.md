# Mastery Dashboard Pro

Initialize and extract the uploaded ZIP file (mastery-tracker-main.zip) into a working project codebase. Once fully unzipped and loaded, refactor the "Grand Performance Report" feature according to the following specifications:

1. CODEBASE INITIALIZATION & CLEANUP

- Extract all project files, components, dependencies, and routing structure intact.

- Ensure all dependencies (including lucide-react, recharts, tailwind, etc.) run smoothly without setup errors.

2. DASHBOARD CANVAS REFACTOR (GRAND PERFORMANCE REPORT)

- Rebuild the "Grand Performance Report" screen into a single, continuous, live-updating dark web dashboard canvas. 

- Do NOT render separate PDF frames, preview cards, or scrollable embedded PDF pages on screen.

- Layout structure: Organize the dashboard canvas into 3 clear, flowing sections directly on the web page:

  • Section 1 (Discipline Transcript): Render dynamic username (`{user?.username || "Devbrat"}`), 7-day field ledger table (Sun–Sat), active rank badge spotlight, and active core badges.

  • Section 2 (Habit & Stack Audit): Render live active habits with streak counts alongside a weekly stacked bar chart (Physics/Chemistry/Math/Bio) featuring a dashed target line at 60 hrs.

  • Section 3 (Rank Ladder): Display the 5-tier mastery hierarchy (Novice Scholar → Apex Mastery) with the user's current tier dynamically highlighted in a glowing gold card frame.

3. VISUAL STYLING & CORE IMPROVEMENTS

- Pitch Black Theme: Set background to pure pitch-black (#000000). Ensure zero white margins or outer borders.

- Border Distress: Add a subtle dark vintage film overlay / distressed vignette along the main container edges.

- Rank Badge Container: Scale up the main rank badge image inside Section 1 so it fills ~90% of its frame with minimal internal padding.

- Armory Wall Cores: Enlarge bottom badge icons (min-width 100px) and increase line height/spacing for text ("Electrostatics x 2") to eliminate empty space.

4. 1:1 DOM SNAPSHOT PDF GENERATION

- Refactor the "Download PDF" button to take a direct DOM snapshot using `html2canvas` (or `dom-to-image`) and `jsPDF`.

- Upon clicking "Download PDF", capture the 3 rendered dashboard sections from the DOM and stitch them into a clean 3-page A4 PDF document. What the user sees live on screen must be exactly what is exported to PDF.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/12ce7af2-5cfd-4d4d-96f6-a2f6a0598551).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
