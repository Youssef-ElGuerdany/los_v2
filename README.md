# Land of Sand And Adventures - Website Guide

Welcome to your new luxury tourism website! I have built this site to be as easy to use and manage as possible. This guide will help you understand how to launch and configure it.

## 1. How to Setup the Database (Supabase)

Supabase is where all your reservations and reviews will be stored.

1. Go to [Supabase.com](https://supabase.com) and click **"Start your project"**.
2. Create an account (it's free!).
3. Click **"New Project"**, give it a name (e.g., "LandOfSand"), and enter a secure password. Wait for the database to finish setting up.
4. Go to the **"Table Editor"** (the table icon on the left).
5. Click **"New Table"** and create two tables exactly like this:
   
   **Table 1: `reservations`**
   - Add columns:
     - `name` (Type: text)
     - `email` (Type: text)
     - `phone` (Type: text)
     - `activity` (Type: text)
     - `date` (Type: date)
     - `persons` (Type: int4)
     - `message` (Type: text)
   
   **Table 2: `reviews`**
   - Add columns:
     - `name` (Type: text)
     - `rating` (Type: int4)
     - `comment` (Type: text)
     - `approved` (Type: boolean, Default Value: false)

6. Go to **"Project Settings"** (the gear icon) > **"API"**.
7. Copy your **Project URL** and **anon public key**.

## 2. Environment Variables

To connect your website to Supabase, you need to set up environment variables.
In the root folder of this project, create a file named `.env.local` and add the keys you copied:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

*(Note: When you deploy to Vercel, you will paste these exact same variables into the Vercel dashboard).*

## 3. How to Deploy to Vercel (One-Click Launch)

Vercel is the easiest place to host your Next.js website for free.

1. Push this project code to a new GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and create a free account.
3. Click **"Add New"** > **"Project"**.
4. Import your GitHub repository.
5. In the **"Environment Variables"** section, add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Click **Deploy**. That's it! Your website is live!

## 4. How to Manage Your Content

I have designed this site to be very flexible. Here is how you can update it yourself:

### Updating Activity Images (Carousels)
All activities now feature smooth auto-scrolling carousels. To update photos:
1. Add your new images to the `public/images/` folder (or subfolders like `Gnawa/`).
2. Open `src/components/Activities.tsx`.
3. Find the `images` array for the tour you want to update and add/change the filenames. 
   *   **Tip:** Make sure to match the uppercase/lowercase of the filenames exactly!

### Changing Text & Languages
All text on the website is localized in the `messages/` folder:
- `en.json` (English)
- `fr.json` (French)
- `es.json` (Spanish)
- `de.json` (German)
Edit these files to change titles, descriptions, or inclusions.

### Managing "Coming Soon" Activities
In `src/components/Activities.tsx`, you can add or remove `comingSoon: true` to any activity. This will automatically disable the booking buttons and show a "Coming Soon" badge.

## 5. How to View Reservations

I have created a simple Admin dashboard for you. 
Once your site is running, simply go to `yourwebsite.com/admin`. 
From there, you can view all incoming reservations directly from the database.

*(Note: You can easily add a password to this page later if needed, but right now it's accessible to see how it works).*

## Need Help?
If you have any issues, refer to the [Next.js documentation](https://nextjs.org/docs) or [Supabase documentation](https://supabase.com/docs).
