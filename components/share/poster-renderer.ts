import QRCode from "qrcode";

export type PosterTemplate = "editorial" | "scrapbook" | "clean";
export type PosterFormat = "story" | "square" | "landscape";

export interface PosterOptions {
  template: PosterTemplate;
  format: PosterFormat;
  photoUrl: string | null;
  targetUrl: string;
}

export interface FormatDimensions {
  width: number;
  height: number;
  label: string;
  ratio: string;
}

export const FORMAT_CONFIG: Record<PosterFormat, FormatDimensions> = {
  story: {
    width: 1080,
    height: 1920,
    label: "Story / Status",
    ratio: "9:16",
  },
  square: {
    width: 1080,
    height: 1080,
    label: "Persegi Feed",
    ratio: "1:1",
  },
  landscape: {
    width: 1920,
    height: 1080,
    label: "Landscape",
    ratio: "16:9",
  },
};

// Helper to load an image into an HTMLImageElement safely
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Enable anonymous CORS for remote storage images
    if (!src.startsWith("data:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

// Draw rounded rectangle helper
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

// Draw image covering area (object-fit: cover)
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sWidth = img.width;
  let sHeight = img.height;

  if (imgRatio > targetRatio) {
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / targetRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

/**
 * Main Poster Drawing Engine
 */
export async function renderPoster(
  canvas: HTMLCanvasElement,
  options: PosterOptions
): Promise<void> {
  const { template, format, photoUrl, targetUrl } = options;
  const { width, height } = FORMAT_CONFIG[format];

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  // Generate high-res QR code
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    width: 600,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  const [qrImg, logoImg] = await Promise.all([
    loadImage(qrDataUrl),
    loadImage("/images/brand/rpl-logo.png").catch(() => null),
  ]);

  let photoImg: HTMLImageElement | null = null;
  if (photoUrl) {
    photoImg = await loadImage(photoUrl).catch((err) => {
      console.warn("[PosterRenderer] Failed to load photo:", err);
      return null;
    });
  }

  // Choose renderer based on template
  if (template === "editorial") {
    renderEditorial(ctx, width, height, format, qrImg, logoImg, photoImg);
  } else if (template === "scrapbook") {
    renderScrapbook(ctx, width, height, format, qrImg, logoImg, photoImg);
  } else {
    renderCleanBlue(ctx, width, height, format, qrImg, logoImg, photoImg);
  }
}

// --------------------------------------------------------------------------
// TEMPLATE 1: CLASS EDITORIAL
// --------------------------------------------------------------------------
function renderEditorial(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  format: PosterFormat,
  qrImg: HTMLImageElement,
  logoImg: HTMLImageElement | null,
  photoImg: HTMLImageElement | null
) {
  // Base background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "#07090E");
  bgGrad.addColorStop(0.5, "#0D111A");
  bgGrad.addColorStop(1, "#080A10");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Background Photo (Editorial dark wash)
  if (photoImg) {
    ctx.save();
    ctx.globalAlpha = 0.28;
    drawImageCover(ctx, photoImg, 0, 0, w, h);
    ctx.restore();

    // Dark vignette overlay
    const vignette = ctx.createRadialGradient(
      w / 2,
      h / 2,
      w * 0.2,
      w / 2,
      h / 2,
      w * 0.7
    );
    vignette.addColorStop(0, "rgba(8, 10, 16, 0.4)");
    vignette.addColorStop(1, "rgba(8, 10, 16, 0.95)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  }

  // Editorial Frame Border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  // Corner Plus Accents
  ctx.fillStyle = "rgba(61, 92, 255, 0.8)";
  ctx.font = "bold 24px monospace";
  ctx.fillText("+", 50, 68);
  ctx.fillText("+", w - 66, 68);
  ctx.fillText("+", 50, h - 50);
  ctx.fillText("+", w - 66, h - 50);

  if (format === "story") {
    // Top Bar: Logo & Badge
    if (logoImg) {
      ctx.drawImage(logoImg, w / 2 - 50, 100, 100, 100);
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 32px 'Syne', sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("RPLTWOFESS", w / 2, 240);

    // Pill Badge
    roundRect(ctx, w / 2 - 130, 265, 260, 42, 21);
    ctx.fillStyle = "rgba(61, 92, 255, 0.15)";
    ctx.fill();
    ctx.strokeStyle = "rgba(61, 92, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 17px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • 2026", w / 2, 292);

    // Headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 102px 'Syne', sans-serif";
    ctx.letterSpacing = "-1px";
    ctx.fillText("PUNYA CERITA?", w / 2, 430);

    // Subtitle
    ctx.fillStyle = "#9A9DA5";
    ctx.font = "500 32px sans-serif";
    ctx.letterSpacing = "0px";
    ctx.fillText("Yuk kirim pesan anonim ke XI RPL 2.", w / 2, 490);

    // Subtle Tag Pill
    roundRect(ctx, w / 2 - 170, 525, 340, 36, 18);
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.fill();
    ctx.fillStyle = "#CAD1E0";
    ctx.font = "bold 15px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("100% RAHASIA • TANPA LOGIN", w / 2, 549);

    // Photo Polaroid (if photo selected) or Editorial Card
    let qrTop = 640;
    if (photoImg) {
      // Draw a neat framed photo preview above the QR
      const pw = 480;
      const ph = 320;
      const px = w / 2 - pw / 2;
      const py = 610;

      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 15;
      roundRect(ctx, px, py, pw, ph, 16);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.restore();

      ctx.save();
      roundRect(ctx, px + 8, py + 8, pw - 16, ph - 16, 10);
      ctx.clip();
      drawImageCover(ctx, photoImg, px + 8, py + 8, pw - 16, ph - 16);
      ctx.restore();

      qrTop = 1000;
    }

    // QR Code Container Box
    const qrBoxSize = 460;
    const qrX = w / 2 - qrBoxSize / 2;
    const qrY = qrTop;

    ctx.save();
    ctx.shadowColor = "rgba(61, 92, 255, 0.25)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 10;
    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 28);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.restore();

    // Inner subtle border
    roundRect(ctx, qrX + 16, qrY + 16, qrBoxSize - 32, qrBoxSize - 32, 20);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw QR Code inside
    const qrSize = qrBoxSize - 56;
    ctx.drawImage(qrImg, qrX + 28, qrY + 28, qrSize, qrSize);

    // Action Pill Below QR
    const pillY = qrY + qrBoxSize + 48;
    roundRect(ctx, w / 2 - 230, pillY, 460, 68, 34);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();
    ctx.shadowColor = "rgba(61, 92, 255, 0.4)";
    ctx.shadowBlur = 20;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", w / 2, pillY + 43);

    // URL Direct
    ctx.fillStyle = "#7B8DFF";
    ctx.font = "600 24px monospace";
    ctx.letterSpacing = "1px";
    ctx.fillText("rpltwofess.zone.id/send", w / 2, pillY + 115);

    // Footer Tagline
    ctx.fillStyle = "#CAD1E0";
    ctx.font = "italic 32px serif";
    ctx.letterSpacing = "0px";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", w / 2, h - 120);

    ctx.fillStyle = "#6B7280";
    ctx.font = "14px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • CONFESSION PORTAL", w / 2, h - 80);
  } else if (format === "landscape") {
    // 16:9 Landscape Layout (Two Columns)
    // Left Column: Branding, Headline, Photo/Tagline
    ctx.textAlign = "left";

    // Logo & Header
    if (logoImg) {
      ctx.drawImage(logoImg, 110, 110, 90, 90);
    }

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 32px 'Syne', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("RPLTWOFESS", 220, 155);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 16px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • 2026", 220, 185);

    // Headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 96px 'Syne', sans-serif";
    ctx.letterSpacing = "-1px";
    ctx.fillText("PUNYA CERITA?", 110, 340);

    ctx.fillStyle = "#9A9DA5";
    ctx.font = "500 32px sans-serif";
    ctx.fillText("Yuk kirim pesan anonim ke XI RPL 2.", 110, 400);

    // Photo or Graphic Accent
    if (photoImg) {
      const pw = 520;
      const ph = 300;
      const px = 110;
      const py = 450;

      ctx.save();
      roundRect(ctx, px, py, pw, ph, 16);
      ctx.clip();
      drawImageCover(ctx, photoImg, px, py, pw, ph);
      ctx.restore();

      roundRect(ctx, px, py, pw, ph, 16);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = "#CAD1E0";
      ctx.font = "italic 38px serif";
      ctx.fillText("“Satu Kelas. Banyak Cerita.”", 110, 520);

      ctx.fillStyle = "#7B8DFF";
      ctx.font = "bold 18px monospace";
      ctx.letterSpacing = "2px";
      ctx.fillText("100% RAHASIA • TANPA LOGIN • ANTI SPAM", 110, 590);
    }

    // Right Column: QR Code & Call to Action
    ctx.textAlign = "center";
    const rightCenterX = w - 460;
    const qrBoxSize = 460;
    const qrX = rightCenterX - qrBoxSize / 2;
    const qrY = 190;

    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 28);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    const qrSize = qrBoxSize - 50;
    ctx.drawImage(qrImg, qrX + 25, qrY + 25, qrSize, qrSize);

    // Pill
    const pillY = qrY + qrBoxSize + 40;
    roundRect(ctx, rightCenterX - 220, pillY, 440, 64, 32);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 22px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", rightCenterX, pillY + 41);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "600 22px monospace";
    ctx.fillText("rpltwofess.zone.id/send", rightCenterX, pillY + 105);
  } else {
    // Square Format (1:1 - 1080x1080)
    ctx.textAlign = "center";

    // Header
    if (logoImg) {
      ctx.drawImage(logoImg, w / 2 - 40, 70, 80, 80);
    }

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 26px 'Syne', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("RPLTWOFESS", w / 2, 185);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 15px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • 2026", w / 2, 215);

    // Headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 68px 'Syne', sans-serif";
    ctx.fillText("PUNYA CERITA?", w / 2, 305);

    ctx.fillStyle = "#9A9DA5";
    ctx.font = "500 22px sans-serif";
    ctx.fillText("Yuk kirim pesan anonim ke XI RPL 2.", w / 2, 345);

    // QR Box
    const qrBoxSize = 380;
    const qrX = w / 2 - qrBoxSize / 2;
    const qrY = 385;

    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 24);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    const qrSize = qrBoxSize - 40;
    ctx.drawImage(qrImg, qrX + 20, qrY + 20, qrSize, qrSize);

    // Action Pill
    const pillY = qrY + qrBoxSize + 32;
    roundRect(ctx, w / 2 - 190, pillY, 380, 54, 27);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 19px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", w / 2, pillY + 35);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "600 20px monospace";
    ctx.fillText("rpltwofess.zone.id/send", w / 2, pillY + 85);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "italic 24px serif";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", w / 2, h - 70);
  }
}

// --------------------------------------------------------------------------
// TEMPLATE 2: DIGITAL SCRAPBOOK
// --------------------------------------------------------------------------
function renderScrapbook(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  format: PosterFormat,
  qrImg: HTMLImageElement,
  logoImg: HTMLImageElement | null,
  photoImg: HTMLImageElement | null
) {
  // Textured dark slate paper background
  ctx.fillStyle = "#0B0E14";
  ctx.fillRect(0, 0, w, h);

  // Subtle notebook ruled lines / grid dots
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let y = 60; y < h; y += 40) {
    ctx.fillRect(40, y, w - 80, 1);
  }

  // Washi Tape at Top Corner
  ctx.save();
  ctx.translate(140, 60);
  ctx.rotate((-8 * Math.PI) / 180);
  ctx.fillStyle = "rgba(61, 92, 255, 0.55)";
  ctx.fillRect(-80, -20, 160, 40);
  ctx.restore();

  // Washi Tape at Top Right
  ctx.save();
  ctx.translate(w - 140, 60);
  ctx.rotate((8 * Math.PI) / 180);
  ctx.fillStyle = "rgba(255, 230, 160, 0.45)";
  ctx.fillRect(-80, -20, 160, 40);
  ctx.restore();

  if (format === "story") {
    // Header Scrapbook Header
    ctx.textAlign = "center";
    if (logoImg) {
      ctx.drawImage(logoImg, w / 2 - 55, 110, 110, 110);
    }

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 34px 'Syne', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("RPLTWOFESS", w / 2, 260);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 18px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • OFFICIAL CONFESSION", w / 2, 295);

    // Headline with marker aesthetic
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 96px 'Syne', sans-serif";
    ctx.letterSpacing = "-1px";
    ctx.fillText("PUNYA CERITA?", w / 2, 420);

    // Marker stroke underline under headline
    ctx.fillStyle = "rgba(61, 92, 255, 0.6)";
    ctx.fillRect(w / 2 - 280, 435, 560, 8);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "italic 32px serif";
    ctx.fillText("“Yuk kirim pesan anonim ke XI RPL 2.”", w / 2, 495);

    // Polaroid Photo Frame (if photo selected)
    let qrTop = 640;
    if (photoImg) {
      const polW = 560;
      const polH = 430;
      const polX = w / 2 - polW / 2;
      const polY = 560;

      ctx.save();
      // Slight tilt for authentic scrapbook feel
      ctx.translate(w / 2, polY + polH / 2);
      ctx.rotate((-1.8 * Math.PI) / 180);
      ctx.translate(-w / 2, -(polY + polH / 2));

      // Polaroid Card
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 35;
      ctx.shadowOffsetY = 15;
      roundRect(ctx, polX, polY, polW, polH, 6);
      ctx.fillStyle = "#F8F8F5";
      ctx.fill();

      // Photo inside Polaroid
      const pInnerW = polW - 36;
      const pInnerH = polH - 100;
      drawImageCover(ctx, photoImg, polX + 18, polY + 18, pInnerW, pInnerH);

      // Polaroid Caption
      ctx.fillStyle = "#1E222A";
      ctx.font = "bold 20px monospace";
      ctx.letterSpacing = "2px";
      ctx.fillText("XI RPL 2 • MEMORIES", w / 2, polY + polH - 32);

      // Washi Tape on top of Polaroid
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillRect(w / 2 - 60, polY - 18, 120, 36);

      ctx.restore();

      qrTop = 1080;
    }

    // QR Code Scrapbook Sticker
    const qrBoxSize = 440;
    const qrX = w / 2 - qrBoxSize / 2;
    const qrY = qrTop;

    ctx.save();
    // Subtle tilt opposite direction
    ctx.translate(w / 2, qrY + qrBoxSize / 2);
    ctx.rotate((1.5 * Math.PI) / 180);
    ctx.translate(-w / 2, -(qrY + qrBoxSize / 2));

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Washi Tape on top of QR Sticker
    ctx.fillStyle = "rgba(61, 92, 255, 0.55)";
    ctx.fillRect(w / 2 - 70, qrY - 15, 140, 32);

    const qrSize = qrBoxSize - 44;
    ctx.drawImage(qrImg, qrX + 22, qrY + 22, qrSize, qrSize);
    ctx.restore();

    // Action CTA
    const pillY = qrY + qrBoxSize + 45;
    roundRect(ctx, w / 2 - 220, pillY, 440, 66, 12);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 23px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", w / 2, pillY + 42);

    // URL
    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 23px monospace";
    ctx.fillText("rpltwofess.zone.id/send", w / 2, pillY + 110);

    // Footer
    ctx.fillStyle = "#F5F5F2";
    ctx.font = "italic 32px serif";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", w / 2, h - 110);
  } else if (format === "landscape") {
    // Landscape Layout
    ctx.textAlign = "left";

    // Left Column: Polaroid Photo & Headlines
    if (photoImg) {
      const polW = 600;
      const polH = 460;
      const polX = 120;
      const polY = 160;

      ctx.save();
      ctx.translate(polX + polW / 2, polY + polH / 2);
      ctx.rotate((-2 * Math.PI) / 180);
      ctx.translate(-(polX + polW / 2), -(polY + polH / 2));

      roundRect(ctx, polX, polY, polW, polH, 6);
      ctx.fillStyle = "#F8F8F5";
      ctx.fill();

      drawImageCover(ctx, photoImg, polX + 18, polY + 18, polW - 36, polH - 100);

      ctx.fillStyle = "#1E222A";
      ctx.font = "bold 20px monospace";
      ctx.fillText("XI RPL 2 • DOKUMENTASI", polX + polW / 2, polY + polH - 32);

      // Tape
      ctx.fillStyle = "rgba(61, 92, 255, 0.55)";
      ctx.fillRect(polX + polW / 2 - 60, polY - 18, 120, 36);
      ctx.restore();
    } else {
      if (logoImg) {
        ctx.drawImage(logoImg, 120, 140, 110, 110);
      }
      ctx.fillStyle = "#F5F5F2";
      ctx.font = "bold 32px 'Syne', sans-serif";
      ctx.fillText("RPLTWOFESS", 260, 190);

      ctx.fillStyle = "#7B8DFF";
      ctx.font = "bold 18px monospace";
      ctx.fillText("XI RPL 2 • 2026", 260, 225);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 88px 'Syne', sans-serif";
      ctx.fillText("PUNYA CERITA?", 120, 380);

      ctx.fillStyle = "#CAD1E0";
      ctx.font = "italic 36px serif";
      ctx.fillText("“Satu Kelas. Banyak Cerita.”", 120, 480);
    }

    // Right Column: QR Code Sticker
    ctx.textAlign = "center";
    const rightX = w - 460;
    const qrBoxSize = 440;
    const qrX = rightX - qrBoxSize / 2;
    const qrY = 170;

    ctx.save();
    ctx.translate(rightX, qrY + qrBoxSize / 2);
    ctx.rotate((1.8 * Math.PI) / 180);
    ctx.translate(-rightX, -(qrY + qrBoxSize / 2));

    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 20);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    ctx.fillStyle = "rgba(255, 230, 160, 0.55)";
    ctx.fillRect(rightX - 60, qrY - 16, 120, 34);

    const qrSize = qrBoxSize - 44;
    ctx.drawImage(qrImg, qrX + 22, qrY + 22, qrSize, qrSize);
    ctx.restore();

    // CTA
    const pillY = qrY + qrBoxSize + 40;
    roundRect(ctx, rightX - 210, pillY, 420, 64, 12);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 22px monospace";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", rightX, pillY + 41);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 22px monospace";
    ctx.fillText("rpltwofess.zone.id/send", rightX, pillY + 105);
  } else {
    // Square Format
    ctx.textAlign = "center";
    if (logoImg) {
      ctx.drawImage(logoImg, w / 2 - 45, 60, 90, 90);
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 64px 'Syne', sans-serif";
    ctx.fillText("PUNYA CERITA?", w / 2, 220);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "italic 24px serif";
    ctx.fillText("“Yuk kirim pesan anonim ke XI RPL 2.”", w / 2, 260);

    // QR Box
    const qrBoxSize = 380;
    const qrX = w / 2 - qrBoxSize / 2;
    const qrY = 320;

    ctx.save();
    ctx.translate(w / 2, qrY + qrBoxSize / 2);
    ctx.rotate((1.5 * Math.PI) / 180);
    ctx.translate(-w / 2, -(qrY + qrBoxSize / 2));

    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 18);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    ctx.fillStyle = "rgba(61, 92, 255, 0.55)";
    ctx.fillRect(w / 2 - 50, qrY - 14, 100, 28);

    const qrSize = qrBoxSize - 36;
    ctx.drawImage(qrImg, qrX + 18, qrY + 18, qrSize, qrSize);
    ctx.restore();

    const pillY = qrY + qrBoxSize + 40;
    roundRect(ctx, w / 2 - 180, pillY, 360, 54, 10);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 19px monospace";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", w / 2, pillY + 35);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "600 20px monospace";
    ctx.fillText("rpltwofess.zone.id/send", w / 2, pillY + 90);

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "italic 24px serif";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", w / 2, h - 60);
  }
}

// --------------------------------------------------------------------------
// TEMPLATE 3: CLEAN BLUE
// --------------------------------------------------------------------------
function renderCleanBlue(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  format: PosterFormat,
  qrImg: HTMLImageElement,
  logoImg: HTMLImageElement | null,
  photoImg: HTMLImageElement | null
) {
  // Midnight Navy base
  ctx.fillStyle = "#060810";
  ctx.fillRect(0, 0, w, h);

  // Electric Blue Radial Glow at Center
  const glow = ctx.createRadialGradient(
    w / 2,
    h * 0.45,
    50,
    w / 2,
    h * 0.45,
    w * 0.65
  );
  glow.addColorStop(0, "rgba(61, 92, 255, 0.18)");
  glow.addColorStop(1, "rgba(6, 8, 16, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Background Photo if available (subtle glow overlay)
  if (photoImg) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    drawImageCover(ctx, photoImg, 0, 0, w, h);
    ctx.restore();
  }

  // Geometric Electric Blue Framing
  ctx.strokeStyle = "rgba(61, 92, 255, 0.45)";
  ctx.lineWidth = 2;
  roundRect(ctx, 45, 45, w - 90, h - 90, 24);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  roundRect(ctx, 60, 60, w - 120, h - 120, 18);
  ctx.stroke();

  if (format === "story") {
    ctx.textAlign = "center";

    // Mascot Logo
    if (logoImg) {
      ctx.drawImage(logoImg, w / 2 - 60, 130, 120, 120);
    }

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 34px 'Syne', sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("RPLTWOFESS", w / 2, 295);

    // Monospace Badge
    roundRect(ctx, w / 2 - 120, 320, 240, 38, 8);
    ctx.fillStyle = "rgba(61, 92, 255, 0.2)";
    ctx.fill();
    ctx.strokeStyle = "#3D5CFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 16px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • 2026", w / 2, 345);

    // Headline
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 106px 'Syne', sans-serif";
    ctx.letterSpacing = "-2px";
    ctx.fillText("PUNYA CERITA?", w / 2, 480);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "500 32px sans-serif";
    ctx.letterSpacing = "0px";
    ctx.fillText("Yuk kirim pesan anonim ke XI RPL 2.", w / 2, 540);

    // Large High-Tech QR Box
    const qrBoxSize = 480;
    const qrX = w / 2 - qrBoxSize / 2;
    const qrY = 660;

    // Corner brackets decoration around QR
    const bracketLen = 30;
    const bOffset = 25;
    ctx.strokeStyle = "#3D5CFF";
    ctx.lineWidth = 4;

    // Top-left bracket
    ctx.beginPath();
    ctx.moveTo(qrX - bOffset, qrY - bOffset + bracketLen);
    ctx.lineTo(qrX - bOffset, qrY - bOffset);
    ctx.lineTo(qrX - bOffset + bracketLen, qrY - bOffset);
    ctx.stroke();

    // Top-right bracket
    ctx.beginPath();
    ctx.moveTo(qrX + qrBoxSize + bOffset - bracketLen, qrY - bOffset);
    ctx.lineTo(qrX + qrBoxSize + bOffset, qrY - bOffset);
    ctx.lineTo(qrX + qrBoxSize + bOffset, qrY - bOffset + bracketLen);
    ctx.stroke();

    // Bottom-left bracket
    ctx.beginPath();
    ctx.moveTo(qrX - bOffset, qrY + qrBoxSize + bOffset - bracketLen);
    ctx.lineTo(qrX - bOffset, qrY + qrBoxSize + bOffset);
    ctx.lineTo(qrX - bOffset + bracketLen, qrY + qrBoxSize + bOffset);
    ctx.stroke();

    // Bottom-right bracket
    ctx.beginPath();
    ctx.moveTo(qrX + qrBoxSize + bOffset - bracketLen, qrY + qrBoxSize + bOffset);
    ctx.lineTo(qrX + qrBoxSize + bOffset, qrY + qrBoxSize + bOffset);
    ctx.lineTo(qrX + qrBoxSize + bOffset, qrY + qrBoxSize + bOffset - bracketLen);
    ctx.stroke();

    // Pure White Box
    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 24);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    const qrSize = qrBoxSize - 48;
    ctx.drawImage(qrImg, qrX + 24, qrY + 24, qrSize, qrSize);

    // Action Banner
    const pillY = qrY + qrBoxSize + 60;
    roundRect(ctx, w / 2 - 240, pillY, 480, 72, 36);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();
    ctx.shadowColor = "rgba(61, 92, 255, 0.5)";
    ctx.shadowBlur = 25;

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 25px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", w / 2, pillY + 45);

    // URL
    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 26px monospace";
    ctx.letterSpacing = "1px";
    ctx.fillText("rpltwofess.zone.id/send", w / 2, pillY + 125);

    // Tagline & Specs
    ctx.fillStyle = "#CAD1E0";
    ctx.font = "italic 32px serif";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", w / 2, h - 140);

    ctx.fillStyle = "#6B7280";
    ctx.font = "14px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("100% PRIVATE • ANONYMOUS • NO LOGIN", w / 2, h - 95);
  } else if (format === "landscape") {
    // Landscape Layout
    ctx.textAlign = "left";

    if (logoImg) {
      ctx.drawImage(logoImg, 120, 120, 100, 100);
    }

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 34px 'Syne', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("RPLTWOFESS", 240, 170);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 16px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • 2026", 240, 205);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 96px 'Syne', sans-serif";
    ctx.letterSpacing = "-1px";
    ctx.fillText("PUNYA CERITA?", 120, 360);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "500 32px sans-serif";
    ctx.fillText("Yuk kirim pesan anonim ke XI RPL 2.", 120, 420);

    ctx.fillStyle = "#3D5CFF";
    ctx.font = "italic 36px serif";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", 120, 520);

    ctx.fillStyle = "#9A9DA5";
    ctx.font = "16px monospace";
    ctx.letterSpacing = "2px";
    ctx.fillText("HMAC ENCRYPTION • 100% PRIVATE • NO ACCOUNT REQUIRED", 120, 600);

    // Right Column: QR Code
    ctx.textAlign = "center";
    const rightX = w - 460;
    const qrBoxSize = 460;
    const qrX = rightX - qrBoxSize / 2;
    const qrY = 180;

    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 24);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    const qrSize = qrBoxSize - 44;
    ctx.drawImage(qrImg, qrX + 22, qrY + 22, qrSize, qrSize);

    const pillY = qrY + qrBoxSize + 45;
    roundRect(ctx, rightX - 220, pillY, 440, 66, 33);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 23px monospace";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", rightX, pillY + 42);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 23px monospace";
    ctx.fillText("rpltwofess.zone.id/send", rightX, pillY + 110);
  } else {
    // Square
    ctx.textAlign = "center";

    if (logoImg) {
      ctx.drawImage(logoImg, w / 2 - 45, 70, 90, 90);
    }

    ctx.fillStyle = "#F5F5F2";
    ctx.font = "bold 28px 'Syne', sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("RPLTWOFESS", w / 2, 190);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "bold 15px monospace";
    ctx.letterSpacing = "3px";
    ctx.fillText("XI RPL 2 • 2026", w / 2, 220);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 70px 'Syne', sans-serif";
    ctx.fillText("PUNYA CERITA?", w / 2, 310);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "500 22px sans-serif";
    ctx.fillText("Yuk kirim pesan anonim ke XI RPL 2.", w / 2, 350);

    const qrBoxSize = 390;
    const qrX = w / 2 - qrBoxSize / 2;
    const qrY = 385;

    roundRect(ctx, qrX, qrY, qrBoxSize, qrBoxSize, 22);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    const qrSize = qrBoxSize - 40;
    ctx.drawImage(qrImg, qrX + 20, qrY + 20, qrSize, qrSize);

    const pillY = qrY + qrBoxSize + 34;
    roundRect(ctx, w / 2 - 190, pillY, 380, 56, 28);
    ctx.fillStyle = "#3D5CFF";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 20px monospace";
    ctx.fillText("SCAN UNTUK KIRIM PESAN", w / 2, pillY + 36);

    ctx.fillStyle = "#7B8DFF";
    ctx.font = "600 20px monospace";
    ctx.fillText("rpltwofess.zone.id/send", w / 2, pillY + 88);

    ctx.fillStyle = "#CAD1E0";
    ctx.font = "italic 24px serif";
    ctx.fillText("“Satu Kelas. Banyak Cerita.”", w / 2, h - 60);
  }
}
