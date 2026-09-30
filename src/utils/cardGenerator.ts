/**
 * Islamic Dhikr & Quran Ayah Card Generator
 * Generates high-resolution shareable luxury images using HTML5 Canvas
 */

export interface CardOptions {
  title?: string;
  text: string;
  source?: string;
  category?: string;
}

export async function generateIslamicCard(options: CardOptions): Promise<string> {
  const width = 1080;
  const height = 1350; // 4:5 Instagram & WhatsApp portrait ratio
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Luxury Dark Emerald Gradient Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#04231b');
  gradient.addColorStop(0.5, '#083c2e');
  gradient.addColorStop(1, '#021812');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Geometric Islamic Pattern Accent
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
  ctx.lineWidth = 1.5;
  const step = 60;
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      ctx.strokeRect(x, y, step, step);
    }
  }
  ctx.restore();

  // 3. Ornate Golden Borders (Inner & Outer)
  ctx.save();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Corner Accents
  const drawCorner = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(0, 0);
    ctx.lineTo(30, 0);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  drawCorner(44, 44, 0);
  drawCorner(width - 44, 44, Math.PI / 2);
  drawCorner(width - 44, height - 44, Math.PI);
  drawCorner(44, height - 44, -Math.PI / 2);
  ctx.restore();

  // 4. Header: App Logo / Emblem & Bismillah
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  // Small Top Tag
  ctx.font = 'bold 26px Cairo, sans-serif';
  ctx.fillStyle = '#D4AF37';
  ctx.fillText('﷽', width / 2, 140);

  if (options.title || options.category) {
    ctx.font = '600 24px Cairo, sans-serif';
    ctx.fillStyle = 'rgba(230, 240, 235, 0.85)';
    ctx.fillText(options.title || options.category || '', width / 2, 190);
  }
  ctx.restore();

  // 5. Main Dhikr / Quran Text (Auto-wrapped and centered)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';
  ctx.fillStyle = '#ffffff';

  const cleanText = options.text.trim();
  const fontSize = cleanText.length > 250 ? 32 : (cleanText.length > 120 ? 38 : 46);
  ctx.font = `${fontSize}px Amiri, serif`;

  const maxWidth = width - 200;
  const lineHeight = fontSize * 1.8;
  const words = cleanText.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + (currentLine ? ' ' : '') + words[n];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(currentLine);
      currentLine = words[n];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  // Vertical centering calculation
  const totalTextHeight = lines.length * lineHeight;
  let startY = (height / 2) - (totalTextHeight / 2) + 30;
  if (startY < 260) startY = 260;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], width / 2, startY + (i * lineHeight));
  }
  ctx.restore();

  // 6. Footer: Source & App Watermark
  ctx.save();
  ctx.textAlign = 'center';
  ctx.direction = 'rtl';

  if (options.source) {
    ctx.font = '22px Cairo, sans-serif';
    ctx.fillStyle = '#D4AF37';
    ctx.fillText(`المصدر: ${options.source}`, width / 2, height - 160);
  }

  // Divider
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 100, height - 125);
  ctx.lineTo(width / 2 + 100, height - 125);
  ctx.stroke();

  // App Branding
  ctx.font = 'bold 24px Cairo, sans-serif';
  ctx.fillStyle = '#E6F0EB';
  ctx.fillText('أذكار ، Ankara', width / 2, height - 85);
  ctx.font = '16px Cairo, sans-serif';
  ctx.fillStyle = 'rgba(212, 175, 55, 0.8)';
  ctx.fillText('تطبيق إسلامي فاخر للقرآن والذكر والعبادة', width / 2, height - 55);
  ctx.restore();

  return canvas.toDataURL('image/png');
}
