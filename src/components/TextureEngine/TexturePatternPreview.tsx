import React, { useRef, useEffect } from 'react';
import { TextureArchetype } from '../../types/skin';

interface TexturePatternPreviewProps {
  archetype: TextureArchetype;
  height?: number;
}

export const TexturePatternPreview: React.FC<TexturePatternPreviewProps> = ({
  archetype,
  height = 112
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 240;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bg1 = archetype.primaryTint || '#181A1F';
    const bg2 = archetype.secondaryTint || '#0F1216';
    const accent = archetype.accentTint || '#F59E0B';

    // Linear gradient
    const grad = ctx.createLinearGradient(0, 0, 240, height);
    grad.addColorStop(0, bg1);
    grad.addColorStop(1, bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 240, height);

    // Accent wave / flow
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.bezierCurveTo(80, height * 0.3, 160, height, 240, height * 0.4);
    ctx.lineTo(240, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Noise specks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * 240, Math.random() * height, 1, 1);
    }
  }, [archetype, height]);

  return <canvas ref={canvasRef} className="w-full h-full object-cover" />;
};
