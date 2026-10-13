# CareCycle

> **Care, passed forward.**

CareCycle is a modern, social-impact web application designed to connect unopened surplus health supplies, clean durable mobility aids, and essential first-aid resources with community members in need.

---

## Overview & Purpose

Every year, millions of dollars worth of unopened, unexpired medical essentials and durable support equipment go unused. CareCycle provides a dignified, community-driven platform to catalog and circulate these supplies through local neighborhood hubs with zero waste and zero cost.

> **Important Safety Notice:**
> CareCycle is a technology demonstration prototype. This platform does not verify medicine safety, pharmaceutical authenticity, legal eligibility, or regulatory status of listed items. All items shown are fictional demo listings. CareCycle does not claim medicines are verified or safe for redistribution. Always consult licensed healthcare providers and follow local public health regulations before distributing or using medical supplies.

---

## Key Features

1. **Impact Statistics Dashboard:**
   - Real-time counters for Total Listings, Available Supplies, and Requested Items.
   - Dynamic tracking of community pickup hubs and circulation metrics.

2. **Community Shelf:**
   - Fictional medical-supply catalog displaying name, category, quantity, pickup hub, condition notes, and expiry or durability details.
   - Fast instant search across supply names, categories, pickup locations, and donor notes.
   - Quick status filters for **All**, **Available**, and **Requested** supplies.
   - Category filtering across First Aid, Mobility Aids, Diagnostics, Respiratory Care, Diabetic Care, and Over-the-Counter Relief.

3. **Request & Circulation Workflow:**
   - One-click supply reservation updating dashboard statistics in real time.
   - Option to return requested items to the shelf for continuous testing.

4. **Add Donation Modal with Full Validation:**
   - Input forms for item name, category, quantity, pickup hub, durability vs expiry dates, condition notes, and contributor handle.
   - Inline field-by-field validation preventing incomplete submissions or expired items.
   - Safety attestation confirmation requirement adhering to non-prescription prototype guidelines.

5. **Local Prototype Persistence:**
   - Prototype state persists across browser reloads using `localStorage`.
   - Clear disclosure that `localStorage` provides single-browser storage and not shared multi-user data.
   - "Reset Demo Data" option in the sidebar and footer to restore the fictional catalog at any time.

6. **Prominent Safety Guidelines & Explainer:**
   - Visible safety disclaimer and expandable standards highlighting accepted categories and strictly prohibited items (e.g., no prescription drugs, no opened medications, no expired supplies).
   - "How CareCycle Works" modal detailing the 3-step community circulation flow.

7. **Design System:**
   - Social-impact color palette: Forest Green (`#1b4332`), Mint (`#10b981`), Warm Ivory (`#faf8f5`), Muted Peach (`#e07a5f`), and crisp neutrals.
   - Desktop sidebar navigation with responsive drawer and top navigation on mobile.
   - Fluid transitions, accessible focus states, and toast feedback notifications.

---

## Tech Stack

- **React 19**
- **Vite**
- **JavaScript (ES Modules)**
- **Plain CSS (CSS custom properties, flexbox & grid)**
- **Lucide React** (feather icons)

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/anumitapremnad/CareCycle.git

# Navigate to project folder
cd CareCycle

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Lint

```bash
# Run production build
npm run build

# Run code linter
npm run lint
```
