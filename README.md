# Automotive CRM & Admin Dashboard

Admin application for managing inventory, reviewing leads, and analyzing user engagement for the dealership platform. Built as a standalone Next.js app connected to a shared MongoDB cluster.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Auth:** NextAuth.js + bcrypt password hashing
- **Data Viz:** Chart.js, Heatmap.js
- **Database:** MongoDB + Mongoose (shared with storefront)
- **UI:** MUI, Radix UI, Lucide React
- **Automation:** Puppeteer (reporting / PDF generation), html2canvas

## Implemented Features
- Inventory CRUD for vehicle listings, including image sequencing (React Sortable)
- Lead management dashboard (inquiries / test-drive requests)
- Engagement analytics: cursor heatmaps visualized in admin views
- Role-based access control (RBAC) and protected admin routes via NextAuth

## Notable Engineering Decisions
- Shared Mongoose models across storefront and admin to keep inventory/leads/analytics consistent.
- Heatmap analytics stored in MongoDB as batched interactions per page, enabling page-level visualization and trend review.
- RBAC enforced for sensitive operations (inventory edits, lead visibility) via protected routes and server-side checks.

## Data Model (Mongoose)
- Car, CarMake, FeaturedCar
- Enquiry, Client, Review
- HeatMap (batched cursor interactions per page)

## Security Notes
- Passwords are hashed with bcrypt
- Secrets are stored server-side via environment variables and are not exposed to the client bundle

## Roadmap
- Expand reporting views and PDF exports
- Improve auditability for inventory and lead actions (activity log)