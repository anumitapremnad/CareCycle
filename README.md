# CareCycle

> **Care, passed forward.**

CareCycle is a modern, social-impact web application designed to coordinate the community circulation of unopened surplus health supplies, clean durable mobility aids, and essential first-aid resources through neighborhood hubs.

---

## The Coordination Problem CareCycle Solves

Every year, vast quantities of unopened, unexpired over-the-counter essentials, first-aid materials, and durable medical devices (crutches, walking canes, monitors) sit idle in home medicine cabinets or clinic storerooms while neighboring community members face severe financial barriers to accessing basic health equipment. 

CareCycle bridges this gap with a dignified, transparent, community-driven coordination MVP:
- **Zero Financial Barrier:** All exchanges are free community-to-community donations.
- **Localized Drop-off & Pickup:** Supplies are routed through local grassroots hubs, student volunteer clinics, and neighborhood pantries.
- **Transparent Safety Guardrails:** Strict non-prescription policies, visible packaging inspections, and clear trust tier disclosures.

---

## Important Medicine Safety & Legal Limitations

> **Safety & Regulatory Disclaimer:**
> **CareCycle is a demonstration prototype and coordination tool, not a pharmacy, licensed dispensary, or healthcare provider.**
> - Medicine sharing and redistribution may be restricted or prohibited by local and national law. Transfers must strictly follow applicable health laws and qualified medical professional guidance.
> - CareCycle **does not claim or verify** that medicines are medically safe, authentic, potent, or legally eligible for redistribution based on form submissions.
> - **Strictly Prohibited Items:** Prescription pharmaceuticals (Rx), controlled substances, opened liquids, unsealed ointments, used sharps/needles, and expired goods are categorically barred from listing.
> - **Only Fictional Demonstration Data:** All catalog items, community organizations, volunteer coordinators, and sample requests in this repository are illustrative demo records.
> - This prototype does not offer prescription advice, dosage recommendations, diagnosis, or patient clinical care.

---

## Main Features

### 1. Community Hubs & Organizations
- Directory of local grassroots centers, student volunteer chapters, neighborhood pantries, and authorized health outreach partners.
- Organization profiles displaying classification, pickup location, active inventory, contact information, and coordinator details.
- Working **Join / Leave Hub** interaction tracking membership for the current demo user.
- Ability to filter the Community Shelf by a specific hub and view dedicated inventory.

### 2. Transparent Trust & Verification System
- Distinct demonstration trust status tiers:
  - **Verified by an administrator (demo only):** Formally reviewed and assigned an admin trust badge.
  - **Verification pending:** Petition submitted and queued for evaluation.
  - **Organization details not verified:** Operating in standard demo mode without formal credential review.
  - **Demo profile:** Standard simulated exploration profile.
- Verification request workflow allowing coordinators to submit organization credentials and facility storage documentation.
- Administrator review queue to evaluate, approve, or reject verification requests with recorded audit rationale.

### 3. Role-Aware Demonstration Experience
Switch between three simulated demonstration roles without fake security barriers:
- **Community Member:** Search and filter supplies, request available items, join community hubs, view personal request status, and cancel pending requests.
- **Organization Coordinator:** Represent a selected community hub, manage incoming requests, advance fulfillment statuses (`Accepted` &rarr; `Ready for collection` &rarr; `Completed`), submit verification requests, and add new donations.
- **Administrator:** Oversight control center to inspect platform-wide health metrics, approve/reject organization verification requests, directly assign hub trust badges, and resolve safety flags.
- **Notice:** Persistent demonstration mode disclaimer indicating that client-side role switching is provided for feature exploration and is not a cryptographic security boundary.

### 4. Robust Request Lifecycle & Activity History
- End-to-end request state transitions:
  `Requested` &rarr; `Accepted` &rarr; `Ready for collection` &rarr; `Completed` (or `Declined` / `Cancelled`).
- Enforces valid transition logic and locks terminal states (`Completed`, `Declined`, `Cancelled`).
- Complete chronological audit log on each request recording timestamps, actors, roles, and fulfillment notes (e.g. pickup locker codes).
- Automatic inventory sync: declining or cancelling a request immediately returns the item to `Available` on the shelf.
- Dedicated **My Requests** view for community members and **Hub Requests Intake** view for coordinators.

### 5. Empirical Impact Insights
- Quantitative analytics calculated strictly from actual stored demonstration records:
  - Total donation listings created.
  - Currently available inventory count.
  - Total requests placed.
  - Completed handovers.
  - Active community hubs.
  - Completion rate percentage formula: `(Completed Requests / Total Requests) * 100` (safe zero handling).
  - Visual distribution of request lifecycle states and inventory categories.
  - Chronological activity stream of stored events.
- Transparent methodology: no invented monetary savings or hypothetical patient outcome figures.

### 6. Discovery, Search & List Management
- Full-text search across supply titles, categories, pickup hubs, locations, and condition notes.
- Multi-dimensional filtering by Category, Availability Status, and Community Hub.
- Sorting by Newest Added, Oldest Added, Approaching Expiry, and Alphabetical.
- Item detail modal with packaging condition notes, approaching-expiry warnings (items expiring within 45 days), request form, and safety inspection report submission.

### 7. Form Validation & Safety Attestation
- Add Donation form with required-field validation for title, category, quantity, hub selection, pickup location, shelf-life, and storage notes.
- Automatic rejection of expired dates.
- Mandatory safety and compliance attestation confirming sealed non-prescription eligibility.

### 8. Reliable Local Data Management
- Centralized storage layer (`demoStorage.js`) managing synchronized schemas.
- Full demonstration dataset reset action with a confirmation dialog.
- Responsive design tailored for mobile phones, tablets, and wide desktop screens.

---

## Local Storage vs. Shared Backend Disclosure

All application state is saved inside your web browser's HTML5 `localStorage` under distinct versioned keys (`carecycle_listings_v2`, `carecycle_requests_v2`, etc.).

**Important Considerations:**
- `localStorage` is completely single-browser and client-side.
- Data is **not shared** across different browsers, devices, or users.
- Actions taken in one browser session will not appear in another user's session.
- Clearing your browser cache or pressing "Reset Demo Data" will restore the coherent baseline catalog.

---

## Future Improvements (Production Roadmap)

To evolve CareCycle from this coordination MVP into a production network, the following enterprise infrastructure would be implemented:
1. **Secure Multi-User Cloud Backend:** Node.js/PostgreSQL database with real-time WebSockets for cross-device supply synchronization.
2. **Secure Authentication & RBAC:** OAuth 2.0 / JWT session authentication with role-based access control protecting coordinator and admin actions.
3. **Legitimate Organization Verification:** Integration with official 501(c)(3) / charity registers, national healthcare facility registries, and verified pharmacist identity checks.
4. **Lot & Barcode Verification:** GS1 barcode scanning to automatically cross-reference FDA recall databases and verify manufacturer expiration dates.
5. **Encrypted Communications:** Secure private messaging between coordinators and recipients for pickup scheduling and locker combination dispatch.
6. **Immutable Audit Trails:** Tamper-evident logging for high-integrity public health compliance.

---

## Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Language:** JavaScript (ES Modules)
- **Styling:** Plain CSS (Custom properties, CSS Grid, Flexbox, Accessible color contrasts)
- **Icons:** Lucide React
- **Persistence:** Browser HTML5 `localStorage`

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/anumitapremnad/CareCycle.git

# Navigate into the project directory
cd CareCycle

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

### Production Build & Code Quality

```bash
# Run code linter
npm run lint

# Compile production bundle
npm run build

# Preview production build locally
npm run preview
```
