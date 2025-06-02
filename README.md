# MyKim Blog Frontend

This is a personal blog frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- 📝 Blog posts with categories and tags
- 🌓 Time-based background images (day/night mode)
- 👤 Daily avatar rotation
- 🎨 Responsive design with dark mode support
- 🔍 Search functionality
- 📱 Mobile-first design

## Time-based Background Images

The application features dynamic background images that change based on the time of day:

- **Day time (6:00 AM - 6:00 PM)**: Shows random day images from `public/images/background/day[number].webp`
- **Night time (6:00 PM - 6:00 AM)**: Shows random night images from `public/images/background/night[number].webp`

### Adding New Background Images

1. Place your images in `public/images/background/`
2. Follow the naming convention: `day[number].webp` or `night[number].webp`
3. Update the image arrays in `src/hooks/useTimeBasedBackground.ts`

### Performance Optimization ✅

#### Image Format and Size

- **Current format**: WebP (optimized for web performance)
- **File size reduction**: 50-90% smaller than original JPEG files
- **Browser support**: Excellent (all modern browsers)

#### File Size Comparison

| File   | Original JPEG | WebP  | Reduction |
| ------ | ------------- | ----- | --------- |
| day1   | 659KB         | 285KB | 56%       |
| day2   | 417KB         | 137KB | 67%       |
| day3   | 876KB         | 410KB | 53%       |
| night1 | 185KB         | 18KB  | 90%       |

#### Converting Additional Images to WebP

```bash
# Using cwebp (install via: brew install webp)
cwebp -q 80 input.jpeg -o output.webp

# Batch conversion
for file in *.jpeg; do
  cwebp -q 80 "$file" -o "${file%.jpeg}.webp"
done
```

#### CDN Usage

For production, consider using a CDN service like:

- Cloudinary
- ImageKit
- Vercel Image Optimization (automatic)

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Image Optimization**: Next.js Image component with WebP/AVIF support

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Avatar.tsx
│   │   └── TimeBasedBackground.tsx
│   └── blog/
├── hooks/
│   ├── useDailyAvatar.ts
│   └── useTimeBasedBackground.ts
├── app/
│   ├── about/
│   └── ...
└── lib/
    └── constants.ts
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

수정
