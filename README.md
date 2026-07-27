# Odomite Rentals

## Description
Odomite Rentals is a rental listings web app built with Next.js, TypeScript, and Tailwind CSS. It uses Supabase for data, Firebase for push notifications, Cloudinary for media, and Resend for transactional email.

## Technologies Used
- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Supabase
- Firebase / Firebase Admin (push notifications)
- Cloudinary (`next-cloudinary`)
- Resend (email)

## Requirements
- Node.js 24.x

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/kingsley-sama/OdomiteRentals.git
   ```
2. Navigate to the project directory:
   ```bash
   cd OdomiteRentals
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Add your environment variables to `.env.local` (Supabase, Firebase, Cloudinary, and Resend credentials).
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser and go to `http://localhost:3000` to view the app.
