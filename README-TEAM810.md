# TEAM 810 WhatsApp Website

## Deploy on Render
- Runtime: Node.js
- Build command: `npm install`
- Start command: `npm start`
- Root directory: `team810_build` if your GitHub repository contains this folder inside the root; otherwise leave blank when its contents are at repository root.

The website displays a registration form for name, email, and WhatsApp number. It does not require a panel password and does not generate, request, or display WhatsApp pairing codes. Registration data is saved to `database/site-registrations.json`; use persistent storage if you need it to survive redeploys, and only collect information with users' consent.

WhatsApp account linking should be performed privately by the account owner through the supported linking flow. Do not ask visitors to share their pairing codes.
