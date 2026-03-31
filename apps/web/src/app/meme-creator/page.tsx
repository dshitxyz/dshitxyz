'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './meme-creator.module.css';

interface MemeTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'poop-bomb',
    name: 'Poop Bomb',
    description: 'Classic brown explosion',
    emoji: '💣',
  },
  {
    id: 'flush-rage',
    name: 'Flush Rage',
    description: 'Angry toilet vibes',
    emoji: '🚽',
  },
  {
    id: 'shit-storm',
    name: 'Shit Storm',
    description: 'Complete chaos',
    emoji: '⛈️',
  },
  {
    id: 'golden-turd',
    name: 'Golden Turd',
    description: 'Premium shitpost',
    emoji: '✨',
  },
  {
    id: 'brown-power',
    name: 'Brown Power',
    description: 'Strength in numbers',
    emoji: '💪',
  },
  {
    id: 'toxic-waste',
    name: 'Toxic Waste',
    description: 'Hazardous content',
    emoji: '☢️',
  },
];

export default function MemeCreatorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontSize, setFontSize] = useState(32);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const drawMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedTemplate) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1A1A1A');
    gradient.addColorStop(1, '#2D2D2D');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#F4D03F';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

    // Template emoji (centered)
    const template = MEME_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (template) {
      ctx.font = 'bold 120px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(template.emoji, canvas.width / 2, canvas.height / 2);
    }

    // Top text
    if (topText) {
      ctx.font = `bold ${fontSize}px 'Space Mono'`;
      ctx.fillStyle = '#F4D03F';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Wrap text
      const words = topText.split(' ');
      let line = '';
      const lineHeight = fontSize + 10;
      let y = 20;

      words.forEach((word) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 40) {
          ctx.strokeText(line, canvas.width / 2, y);
          ctx.fillText(line, canvas.width / 2, y);
          line = word + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      });
      if (line) {
        ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
      }
    }

    // Bottom text
    if (bottomText) {
      ctx.font = `bold ${fontSize}px 'Space Mono'`;
      ctx.fillStyle = '#F4D03F';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      const words = bottomText.split(' ');
      let line = '';
      const lineHeight = fontSize + 10;
      let y = canvas.height - 20;

      // Draw from bottom up
      const lines: string[] = [];
      words.forEach((word) => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 40) {
          if (line) lines.unshift(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      });
      if (line) lines.unshift(line);

      lines.forEach((textLine) => {
        ctx.strokeText(textLine, canvas.width / 2, y);
        ctx.fillText(textLine, canvas.width / 2, y);
        y -= lineHeight;
      });
    }
  };

  // Draw whenever state changes
  useEffect(() => {
    drawMeme();
  }, [selectedTemplate, topText, bottomText, fontSize]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `dshit-meme-${Date.now()}.png`;
    link.click();
  };

  const handleShare = (platform: 'twitter' | 'telegram') => {
    const text = encodeURIComponent(
      `Check out my meme on dshit.xyz! ${topText} ${bottomText}`
    );

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${text}&url=https://dshit.xyz`,
        '_blank'
      );
    } else {
      window.open(
        `https://t.me/share/url?url=https://dshit.xyz&text=${text}`,
        '_blank'
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Meme Creator</h1>
          <p className={styles.subtitle}>
            Make your own shit and share it with the world
          </p>
        </header>

        <div className={styles.content}>
          {/* Canvas Preview */}
          <div className={styles.preview}>
            <div className={styles.canvasWrapper}>
              <canvas
                ref={canvasRef}
                className={styles.canvas}
                style={{
                  border: '3px solid var(--shit-yellow)',
                  boxShadow: '6px 6px 0px var(--shit-brown)',
                }}
              />
            </div>
            <div className={styles.actions}>
              <button onClick={handleDownload} className={styles.downloadBtn}>
                📥 Download PNG
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className={styles.shareBtn}
              >
                𝕏 Tweet
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className={styles.shareBtn}
              >
                💬 Telegram
              </button>
            </div>
          </div>

          {/* Editor */}
          <div className={styles.editor}>
            {/* Template Selection */}
            <section className={styles.section}>
              <h2>Select Template</h2>
              <div className={styles.templates}>
                {MEME_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`${styles.templateBtn} ${
                      selectedTemplate === template.id ? styles.selected : ''
                    }`}
                    title={template.description}
                  >
                    <span className={styles.emoji}>{template.emoji}</span>
                    <span className={styles.name}>{template.name}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Text Editor */}
            {selectedTemplate && (
              <section className={styles.section}>
                <h2>Edit Text</h2>

                <div className={styles.formGroup}>
                  <label>Top Text</label>
                  <textarea
                    value={topText}
                    onChange={(e) => setTopText(e.target.value.toUpperCase())}
                    placeholder="ENTER TOP TEXT"
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Bottom Text</label>
                  <textarea
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value.toUpperCase())}
                    placeholder="ENTER BOTTOM TEXT"
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Font Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="16"
                    max="64"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>

                <button onClick={handleDownload} className={styles.createBtn}>
                  ✨ CREATE & DOWNLOAD ✨
                </button>
              </section>
            )}

            {!selectedTemplate && (
              <section className={styles.section}>
                <p className={styles.emptyState}>
                  👆 Select a template to get started
                </p>
              </section>
            )}
          </div>
        </div>

        <footer className={styles.footer}>
          <p>
            Created a dope meme? Share it on Twitter/Telegram with
            #DShitMeme!
          </p>
          <p className={styles.tipTax}>
            Meme creator powered by brutalist engineering ⚡
          </p>
        </footer>
      </div>
    </div>
  );
}
