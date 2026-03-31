'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
}

export default function MemeCreatorPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memeTitle, setMemeTitle] = useState('');
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/memes/templates');
        if (!response.ok) throw new Error('Failed to fetch templates');
        const data = await response.json();
        setTemplates(data);
        if (data.length > 0) {
          setSelectedTemplate(data[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw template placeholder or custom image
    if (customImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawTextOverlays(ctx, canvas);
      };
      img.src = customImage;
    } else {
      // Draw placeholder
      ctx.fillStyle = '#2D2D2D';
      ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);
      ctx.fillStyle = '#666';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Template: ' + selectedTemplate, canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText('(Upload image or use template)', canvas.width / 2, canvas.height / 2 + 20);
      drawTextOverlays(ctx, canvas);
    }
  }, [selectedTemplate, customImage, textOverlays]);

  const drawTextOverlays = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    textOverlays.forEach((overlay) => {
      ctx.fillStyle = overlay.color;
      ctx.font = `bold ${overlay.fontSize}px ${overlay.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.fillText(overlay.text, overlay.x, overlay.y);

      // Draw selection box if selected
      if (selectedTextId === overlay.id) {
        ctx.strokeStyle = '#F4D03F';
        ctx.lineWidth = 2;
        const metrics = ctx.measureText(overlay.text);
        ctx.strokeRect(
          overlay.x - metrics.width / 2 - 5,
          overlay.y - overlay.fontSize - 5,
          metrics.width + 10,
          overlay.fontSize + 10
        );
      }
    });
  };

  const handleAddTextOverlay = () => {
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: 'New Text',
      x: 200,
      y: 100,
      fontSize: 32,
      color: '#F4D03F',
      fontFamily: 'Arial',
    };
    setTextOverlays([...textOverlays, newText]);
    setSelectedTextId(newText.id);
  };

  const handleUpdateText = (id: string, field: keyof TextOverlay, value: any) => {
    setTextOverlays(
      textOverlays.map((overlay) =>
        overlay.id === id ? { ...overlay, [field]: value } : overlay
      )
    );
  };

  const handleRemoveText = (id: string) => {
    setTextOverlays(textOverlays.filter((overlay) => overlay.id !== id));
    if (selectedTextId === id) {
      setSelectedTextId(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadMeme = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `meme-${Date.now()}.png`;
    link.click();
  };

  const handleSaveMeme = async () => {
    if (!token || !memeTitle) {
      setError('Please enter a title and ensure you are logged in');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const imageData = canvas?.toDataURL('image/png');

      const response = await fetch('/api/memes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          title: memeTitle,
          description: 'Created with Meme Creator',
          textOverlays,
          imageData,
          tags: ['user-created'],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save meme');
      }

      const data = await response.json();
      router.push(`/memes/${data.meme.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">Loading templates...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <h1 className="text-4xl font-bold text-shit-yellow font-display mb-8">MEME CREATOR</h1>

        {error && (
          <div className="bg-glitch-red bg-opacity-20 border-l-4 border-glitch-red p-4 rounded text-glitch-red mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border-4 border-shit-yellow p-4 rounded">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border-2 border-gray-700 rounded bg-gray-800"
              />
            </div>

            {/* Canvas Actions */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleDownloadMeme}
                className="flex-1 px-6 py-3 bg-industrial-orange text-gray-950 font-bold border-2 border-orange-700 hover:bg-orange-600 transition-colors rounded"
              >
                DOWNLOAD
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-6 py-3 bg-gray-700 text-gray-300 font-bold border-2 border-gray-600 hover:border-shit-yellow transition-colors rounded"
              >
                UPLOAD IMAGE
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Title Input */}
            <div className="bg-gray-900 border-4 border-shit-yellow p-4 rounded">
              <label className="block text-sm font-bold text-gray-400 mb-2">Meme Title</label>
              <input
                type="text"
                value={memeTitle}
                onChange={(e) => setMemeTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono placeholder-gray-500 focus:outline-none focus:border-shit-yellow"
              />
            </div>

            {/* Template Selection */}
            <div className="bg-gray-900 border-4 border-shit-brown p-4 rounded">
              <label className="block text-sm font-bold text-gray-400 mb-2">Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border-2 border-gray-700 rounded text-white font-mono focus:outline-none focus:border-shit-yellow"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Text Overlays */}
            <div className="bg-gray-900 border-4 border-toxic-green p-4 rounded space-y-4">
              <h3 className="font-bold text-toxic-green">TEXT OVERLAYS</h3>

              {textOverlays.length === 0 ? (
                <p className="text-gray-400 text-sm">No text overlays yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {textOverlays.map((overlay) => (
                    <div
                      key={overlay.id}
                      onClick={() => setSelectedTextId(overlay.id)}
                      className={`p-3 rounded border-2 cursor-pointer transition-colors ${
                        selectedTextId === overlay.id
                          ? 'border-shit-yellow bg-gray-800'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={overlay.text}
                          onChange={(e) => handleUpdateText(overlay.id, 'text', e.target.value)}
                          className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-shit-yellow"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={overlay.fontSize}
                            onChange={(e) =>
                              handleUpdateText(overlay.id, 'fontSize', parseInt(e.target.value))
                            }
                            min="8"
                            max="128"
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-xs"
                          />
                          <input
                            type="color"
                            value={overlay.color}
                            onChange={(e) =>
                              handleUpdateText(overlay.id, 'color', e.target.value)
                            }
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveText(overlay.id)}
                          className="w-full px-2 py-1 text-xs text-glitch-red hover:text-glitch-red-dark transition-colors"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAddTextOverlay}
                className="w-full px-4 py-2 bg-toxic-green text-gray-950 font-bold rounded hover:bg-opacity-80 transition-colors"
              >
                + ADD TEXT
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveMeme}
              disabled={isSaving || !memeTitle}
              className="w-full px-6 py-3 bg-shit-yellow text-gray-950 font-bold border-2 border-shit-brown hover:bg-shit-yellow-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
            >
              {isSaving ? 'SAVING...' : 'SAVE MEME'}
            </button>

            {/* Back Link */}
            <Link
              href="/gallery"
              className="block text-center px-6 py-2 text-gray-400 border-2 border-gray-700 rounded hover:border-gray-500 transition-colors"
            >
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
