/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'public', 'images', 'class');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function makePhoto(filename, width, height, title, subtitle, date, tag) {
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0c0e12"/>
        <stop offset="50%" stop-color="#151921"/>
        <stop offset="100%" stop-color="#090a0d"/>
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="rgba(61,92,255,0.22)"/>
        <stop offset="100%" stop-color="transparent"/>
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.025)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Base Background -->
    <rect width="${width}" height="${height}" fill="url(#grad)"/>
    <rect width="${width}" height="${height}" fill="url(#glow)"/>
    <rect width="${width}" height="${height}" fill="url(#grid)"/>

    <!-- Dark vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
      <stop offset="60%" stop-color="transparent"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.75)"/>
    </radialGradient>
    <rect width="${width}" height="${height}" fill="url(#vignette)"/>

    <!-- Camera Viewfinder Corners -->
    <path d="M 30 50 L 30 30 L 50 30" stroke="#3D5CFF" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M ${width - 50} 30 L ${width - 30} 30 L ${width - 30} 50" stroke="#3D5CFF" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M 30 ${height - 50} L 30 ${height - 30} L 50 ${height - 30}" stroke="#3D5CFF" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M ${width - 50} ${height - 30} L ${width - 30} ${height - 30} L ${width - 30} ${height - 50}" stroke="#3D5CFF" stroke-width="2" fill="none" opacity="0.6"/>

    <!-- Tag Badge -->
    <rect x="40" y="45" width="165" height="28" rx="4" fill="#111318" stroke="#2A2D34" stroke-width="1"/>
    <text x="50" y="64" fill="#7B8DFF" font-family="sans-serif" font-size="11" font-weight="bold" letter-spacing="1.5">&#8226; ${tag}</text>

    <!-- Center Classroom Silhouette Composition -->
    <circle cx="${width/2}" cy="${height/2 - 20}" r="${Math.min(width,height)*0.18}" fill="#181B21" stroke="#2A2D34" stroke-width="1.5"/>
    <path d="M ${width/2 - 40} ${height/2 + 20} Q ${width/2} ${height/2 - 60} ${width/2 + 40} ${height/2 + 20}" stroke="#3D5CFF" stroke-width="3" fill="none" opacity="0.7"/>
    <circle cx="${width/2}" cy="${height/2 - 45}" r="14" fill="#536DFF" opacity="0.8"/>

    <!-- Title and Subtitle -->
    <text x="${width/2}" y="${height - 75}" fill="#F5F5F2" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" letter-spacing="2">${title}</text>
    <text x="${width/2}" y="${height - 52}" fill="#9A9DA5" font-family="sans-serif" font-size="13" text-anchor="middle">${subtitle}</text>

    <!-- Retro Amber Date Stamp -->
    <text x="${width - 45}" y="${height - 25}" fill="#FFB84D" font-family="monospace" font-size="16" font-weight="bold" text-anchor="end" opacity="0.9" letter-spacing="1">${date}</text>
    <text x="45" y="${height - 25}" fill="#9A9DA5" font-family="monospace" font-size="11" opacity="0.5">35mm &#8226; F/2.8 &#8226; ISO 400</text>
  </svg>`;

  const outPath = path.join(dir, filename);
  await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toFile(outPath);
  console.log('Created:', outPath);
}

async function buildAll() {
  await makePhoto('class-main.jpg', 1280, 720, 'DOKUMENTASI RESMI KELAS', 'XI RPL 2 \u2022 Satu Kelas. Banyak Cerita.', "'26 09 04", 'DOKUMENTASI KELAS');
  await makePhoto('class-01.jpg', 800, 600, 'LAB KOMPUTER RPL 2', 'Sesi Belajar dan Diskusi Bersama', "'26 08 14", 'LABORATORIUM');
  await makePhoto('class-02.jpg', 800, 600, 'PRESENTASI PROJEK', 'Showcase Aplikasi dan Kolaborasi', "'26 08 20", 'PRESENTASI');
  await makePhoto('class-03.jpg', 800, 600, 'KENANGAN BERSAMA', 'Momen Santai dan Kebersamaan', "'26 08 25", 'KEBERSAMAAN');
  await makePhoto('class-04.jpg', 800, 600, 'CREATIVE WORKSHOP', 'Membangun Masa Depan Bersama', "'26 08 28", 'WORKSHOP');
  console.log('All photos generated successfully!');
}

buildAll().catch(err => {
  console.error(err);
  process.exit(1);
});
