import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LfoVisualPreset } from '../../types/skin';
import { lfoVisualPresets } from '../../data/lfoVisualPresets';
import { Activity, Check, Copy, Search, Play, Pause } from 'lucide-react';

interface LfoVisualizerBrowserProps {
  onApplyLfoVisual: (preset: LfoVisualPreset) => void;
  activeLfoPreset?: LfoVisualPreset;
}

export const LfoVisualizerBrowser: React.FC<LfoVisualizerBrowserProps> = ({
  onApplyLfoVisual,
  activeLfoPreset
}) => {
  const categories = useMemo(() => {
    const set = new Set<string>();
    lfoVisualPresets.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set).sort()];
  }, []);
  const [selectedPreset, setSelectedPreset] = useState<LfoVisualPreset>(
    activeLfoPreset ?? lfoVisualPresets[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedId, setAppliedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [waveSpeed, setWaveSpeed] = useState(1.0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pageSize = 20;

  const filteredPresets = useMemo(() => {
    let list = lfoVisualPresets;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.gridStyle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPresets.length / pageSize);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPresets.slice(start, start + pageSize);
  }, [filteredPresets, currentPage, pageSize]);

  useEffect(() => {
    let animId: number;
    let phase = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#06080C';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.strokeStyle = selectedPreset.gridColor;
      ctx.fillStyle = selectedPreset.gridColor;
      ctx.lineWidth = 1;

      // 1. DIVERSE & AUTHENTIC CRT OSCILLOSCOPE GRATICULES
      if (selectedPreset.gridStyle === 'fine-mesh') {
        const step = 24;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        // Center axis ticks
        for (let x = 0; x < w; x += 6) {
          ctx.beginPath();
          ctx.moveTo(x, h / 2 - 3);
          ctx.lineTo(x, h / 2 + 3);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 6) {
          ctx.beginPath();
          ctx.moveTo(w / 2 - 3, y);
          ctx.lineTo(w / 2 + 3, y);
          ctx.stroke();
        }
      } else if (selectedPreset.gridStyle === 'crosshair') {
        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(w, h / 2);
        ctx.moveTo(w / 2, 0);
        ctx.lineTo(w / 2, h);
        ctx.stroke();
        // Calibrated target rings
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.2, 0, Math.PI * 2);
        ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.38, 0, Math.PI * 2);
        ctx.stroke();
        // Corner bracket reticles
        const b = 18;
        ctx.strokeRect(16, 16, b, b);
        ctx.strokeRect(w - 16 - b, 16, b, b);
        ctx.strokeRect(16, h - 16 - b, b, b);
        ctx.strokeRect(w - 16 - b, h - 16 - b, b, b);
      } else if (selectedPreset.gridStyle === 'polar-radial') {
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) * 0.44;
        // Radial spoke axes
        for (let a = 0; a < 12; a++) {
          const ang = (a / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
          ctx.stroke();
        }
        // Concentric range circles
        for (let r = 0.25; r <= 1.0; r += 0.25) {
          ctx.beginPath();
          ctx.arc(cx, cy, maxR * r, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (selectedPreset.gridStyle === 'dot-matrix') {
        const step = 20;
        for (let x = step; x < w; x += step) {
          for (let y = step; y < h; y += step) {
            ctx.beginPath();
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (selectedPreset.gridStyle === 'logarithmic') {
        // Log frequency grid
        const logDecades = [0.05, 0.1, 0.15, 0.22, 0.32, 0.45, 0.6, 0.78, 1.0];
        logDecades.forEach((ratio) => {
          const x = ratio * w;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        });
        // Decibel lines
        [-24, -18, -12, -6, 0, 6].forEach((db) => {
          const y = h / 2 - (db / 30) * (h * 0.4);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        });
      } else {
        // reticle-hud
        const step = 32;
        for (let x = 0; x < w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        // HUD frame
        ctx.strokeRect(20, 20, w - 40, h - 40);
        ctx.beginPath();
        ctx.moveTo(w / 2 - 30, h / 2);
        ctx.lineTo(w / 2 + 30, h / 2);
        ctx.moveTo(w / 2, h / 2 - 30);
        ctx.lineTo(w / 2, h / 2 + 30);
        ctx.stroke();
      }
      ctx.restore();

      // Center reference zero-crossing line
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      if (isPlaying) {
        phase = (phase + 0.028 * waveSpeed) % (Math.PI * 2000);
      }

      // Mathematical waveform synthesis based on preset harmonics & model
      const computeWaveform = (t: number): number => {
        const hCount = selectedPreset.harmonics || 1;
        if (hCount === 1) {
          return Math.sin(t);
        } else if (hCount === 2) {
          return Math.sin(t) * 0.8 + Math.sin(2 * t) * 0.35;
        } else if (hCount === 3) {
          return Math.sin(t) * 0.75 + Math.sin(3 * t) * 0.25 + Math.sin(5 * t) * 0.1;
        } else if (hCount === 4) {
          return (Math.sin(t) - 0.5 * Math.sin(2 * t) + 0.33 * Math.sin(3 * t) - 0.25 * Math.sin(4 * t)) * 0.85;
        } else {
          return Math.sin(t + 0.85 * Math.sin(2.5 * t + phase * 0.6)) * 0.9;
        }
      };

      // 2. ELECTRON BEAM WAVEFORM DRAWING PASS
      const drawWave = (freq: number, amp: number, color: string, alpha: number, offset: number) => {
        ctx.save();
        ctx.shadowColor = selectedPreset.beamGlowColor;
        ctx.shadowBlur = selectedPreset.glowRadius;
        ctx.strokeStyle = color;
        ctx.lineWidth = selectedPreset.waveThickness;
        ctx.globalAlpha = alpha;

        if (selectedPreset.gridStyle === 'polar-radial') {
          // Circular / Polar 2D Lissajous Radar Loop
          const cx = w / 2;
          const cy = h / 2;
          const rBase = Math.min(w, h) * 0.36;
          ctx.beginPath();
          const steps = 240;
          for (let i = 0; i <= steps; i++) {
            const ang = (i / steps) * Math.PI * 2;
            const waveMod = computeWaveform(ang * (selectedPreset.harmonics + 1) + phase + offset);
            const r = rBase * (0.82 + 0.22 * amp * waveMod);
            const px = cx + Math.cos(ang) * r;
            const py = cy + Math.sin(ang) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();

          if (selectedPreset.fillGradient) {
            ctx.fillStyle = `${selectedPreset.beamGlowColor}18`;
            ctx.fill();
          }
        } else {
          // Linear Time-Base Oscilloscope Trace
          ctx.beginPath();
          for (let x = 0; x < w; x++) {
            const t = (x / w) * Math.PI * 4 * freq + phase + offset;
            const waveVal = computeWaveform(t);
            const y = h / 2 + waveVal * (h * 0.32 * amp);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Optional Phosphor Under-Glow Fill
          if (selectedPreset.fillGradient && alpha > 0.8) {
            ctx.save();
            ctx.lineTo(w, h / 2);
            ctx.lineTo(0, h / 2);
            ctx.closePath();
            const fillGrad = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.8);
            fillGrad.addColorStop(0, `${selectedPreset.beamGlowColor}25`);
            fillGrad.addColorStop(0.5, 'transparent');
            fillGrad.addColorStop(1, `${selectedPreset.beamGlowColor}25`);
            ctx.fillStyle = fillGrad;
            ctx.fill();
            ctx.restore();
          }
        }
        ctx.restore();
      };

      // Phosphor Persistence Ghost Trail
      if (selectedPreset.persistenceTrail > 0.2) {
        drawWave(1.0, 0.95, selectedPreset.phosphorColor, 0.22 * selectedPreset.persistenceTrail, -0.28 * selectedPreset.persistenceTrail);
      }
      // Main Focused Electron Beam
      drawWave(1.0, 1.0, selectedPreset.phosphorColor, 1.0, 0);

      // CRT Lens Vignette & Ambient Darkness
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.72);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedPreset, isPlaying, waveSpeed]);

  const handleApply = (preset: LfoVisualPreset) => {
    setSelectedPreset(preset);
    onApplyLfoVisual(preset);
    setAppliedId(preset.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  const handleCopyCode = (preset: LfoVisualPreset) => {
    const code = `// YUP / JUCE CRT LFO Routine: ${preset.name}
void renderLfoScope_${preset.id}(juce::Graphics& g, juce::Rectangle<float> bounds, float timePhase)
{
    g.fillAll(juce::Colour(0xff06080c));
    g.setColour(juce::Colour::fromString("${preset.phosphorColor}"));
}`;
    navigator.clipboard.writeText(code);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">1,188+ LFO Visual Oscilloscope Presets</h2>
            <span className="text-xs font-mono text-cyan-400/80 ml-2">Smooth Continuous Phase Loop</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Audition and apply 1,188+ distinct CRT phosphor beams, graticule meshes, and electron bloom curves to the VST LFO Rack.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 1,188+ LFOs (e.g. quantum, matrix, beam)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 hover:bg-white/10 border border-white/20 text-xs font-bold text-white cursor-pointer shrink-0 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Freeze Scope' : 'Resume'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/60 text-slate-300 hover:text-white border border-white/15 hover:border-white/30'
            }`}
          >
            {cat} {cat === 'All' ? `(${lfoVisualPresets.length})` : ''}
          </button>
        ))}
      </div>

      {/* Main Interactive Oscilloscope Rig */}
      <div className="relative rounded-2xl border border-white/20 bg-slate-900/60 backdrop-blur-xl p-4 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 rounded-xl overflow-hidden border border-white/20 shadow-inner bg-black">
          <canvas
            ref={canvasRef}
            width={720}
            height={320}
            className="w-full h-[280px] md:h-[320px] block"
          />

          <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono border backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: selectedPreset.phosphorColor,
                borderColor: `${selectedPreset.phosphorColor}50`
              }}
            >
              PRESET: #{selectedPreset.id} {selectedPreset.name}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/75 text-cyan-300 border border-cyan-400/40">
              GRATICULE: {selectedPreset.gridStyle}
            </span>
          </div>
        </div>

        <div className="w-full md:w-72 flex flex-col justify-between p-3.5 rounded-xl bg-black/40 border border-white/15 gap-3">
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Scope Live Tuning
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                  <span>Beam Speed</span>
                  <span className="text-cyan-400">{waveSpeed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={waveSpeed}
                  onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                  <span>Beam Glow Radius</span>
                  <span className="text-cyan-400">{selectedPreset.glowRadius}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="24"
                  value={selectedPreset.glowRadius}
                  onChange={(e) =>
                    setSelectedPreset((prev) => ({
                      ...prev,
                      glowRadius: parseInt(e.target.value, 10)
                    }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                  <span>Waveform Thickness</span>
                  <span className="text-cyan-400">{selectedPreset.waveThickness}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.2"
                  value={selectedPreset.waveThickness}
                  onChange={(e) =>
                    setSelectedPreset((prev) => ({
                      ...prev,
                      waveThickness: parseFloat(e.target.value)
                    }))
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => handleApply(selectedPreset)}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                appliedId === selectedPreset.id
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
              }`}
            >
              {appliedId === selectedPreset.id ? (
                <>
                  <Check className="w-4 h-4" /> Applied to DelayHost VST!
                </>
              ) : (
                'Apply to VST LFO Rack'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {paginatedList.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`cursor-pointer rounded-2xl border p-3 flex flex-col justify-between gap-2.5 transition-all backdrop-blur-md ${
                isSelected
                  ? 'border-cyan-400 bg-slate-900/80 shadow-lg shadow-cyan-500/20'
                  : 'border-white/15 bg-slate-900/40 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">{preset.name}</span>
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm shrink-0"
                  style={{
                    backgroundColor: preset.phosphorColor,
                    boxShadow: `0 0 8px ${preset.phosphorColor}`
                  }}
                />
              </div>

              <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                {preset.description}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-mono text-slate-400">
                <span>{preset.gridStyle}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(preset);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-[10px] font-bold cursor-pointer"
                  >
                    Apply
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(preset);
                    }}
                    className="p-1 rounded-lg bg-black/40 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-white cursor-pointer"
                    title="Copy Scope Code"
                  >
                    {copiedId === preset.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3.5 bg-slate-900/60 backdrop-blur-xl border border-white/20 rounded-2xl text-xs flex-wrap gap-2">
          <div className="text-slate-300">
            Page <span className="font-bold text-white">{currentPage}</span> of{' '}
            <span className="font-bold text-white">{totalPages}</span> ({filteredPresets.length} presets)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-xl bg-black/40 border border-white/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 cursor-pointer"
            >
              ← Prev
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-7 h-7 rounded-xl font-mono text-xs transition-colors cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-black/30 border border-white/15 text-slate-300 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-1 rounded-xl bg-black/40 border border-white/20 text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
