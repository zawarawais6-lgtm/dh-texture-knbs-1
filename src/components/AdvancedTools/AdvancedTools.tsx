import React, { useState } from 'react';
import {
  SkinDefinition,
  TextureArchetype,
  KnobArchitectPreset,
  SliderArchitectPreset,
  LfoVisualPreset,
  UiCustomizationState,
  PanelTexture
} from '../../types/skin';
import { SANZO_WADA_PALETTES, FUTURISTIC_CYBER_PALETTES } from '../../data/sanzoWadaData';
import { TextureArchetypesBrowser } from '../ArchetypeBrowsers/TextureArchetypesBrowser';
import { KnobArchitectBrowser } from '../ArchetypeBrowsers/KnobArchitectBrowser';
import { SliderArchitectBrowser } from '../ArchetypeBrowsers/SliderArchitectBrowser';
import { LfoVisualizerBrowser } from '../ArchetypeBrowsers/LfoVisualizerBrowser';
import { UiCustomizerPanel } from '../UiCustomizer/UiCustomizerPanel';
import { Palette, Waves, Sparkles, Cpu, ExternalLink } from 'lucide-react';

interface AdvancedToolsProps {
  currentSkin: SkinDefinition;
  onUpdateSkin: (skin: SkinDefinition) => void;
  onSaveAsCustom: (skin: SkinDefinition) => void;
  onRandomize: () => void;
  onOpenExporter?: () => void;
  onApplyTexture?: (archetype: TextureArchetype) => void;
  onApplyKnob?: (preset: KnobArchitectPreset) => void;
  onApplySlider?: (preset: SliderArchitectPreset) => void;
  onApplyLfoVisual?: (preset: LfoVisualPreset) => void;
  customization?: UiCustomizationState;
  onUpdateCustomization?: (custom: UiCustomizationState) => void;
  onResetCustomization?: () => void;
  activeKnobPreset?: KnobArchitectPreset;
  activeTextureArchetype?: TextureArchetype;
  activeSliderPreset?: SliderArchitectPreset;
  activeLfoPreset?: LfoVisualPreset;
}

export const AdvancedTools: React.FC<AdvancedToolsProps> = ({
  currentSkin,
  onUpdateSkin,
  onSaveAsCustom,
  onRandomize,
  onOpenExporter,
  onApplyTexture,
  onApplyKnob,
  onApplySlider,
  onApplyLfoVisual,
  customization,
  onUpdateCustomization,
  onResetCustomization,
  activeSliderPreset,
  activeLfoPreset
}) => {
  const [activeTab, setActiveTab] = useState<
    'palette' | 'texture' | 'customizer' | 'textures1000' | 'knobs1000' | 'sliders1000' | 'lfos1000' | 'yup'
  >('customizer');
  const [yupBackend, setYupBackend] = useState<'metal' | 'vulkan' | 'd3d12' | 'webgpu'>('metal');
  const [vectorAaQuality, setVectorAaQuality] = useState<'subpixel' | '4xmsaa' | '8xfxaa'>('subpixel');

  const TEXTURE_MODELS: { model: PanelTexture; label: string; desc: string; badge?: string; link?: string }[] = [
    {
      model: 'GrittyTexture',
      label: 'Adobe Concrete Grit',
      desc: 'Dust, asphalt grit, sandpaper scratch & speckle overlay',
      badge: 'Adobe Stock',
      link: 'https://stock.adobe.com/search?k=gritty+texture'
    },
    {
      model: 'FineMineralGrit',
      label: 'Magnific Mineral Sand',
      desc: 'Fine mineral sand, organic chalk dust & stippled film matrix',
      badge: 'Magnific',
      link: 'https://www.magnific.com/free-photos-vectors/gritty-texture'
    },
    {
      model: 'LiquidGrainGradient',
      label: 'Liquid Grain Flow',
      desc: 'Wavy fluid gradient with heavy risograph noise dither',
      badge: 'Behance Liquid',
      link: 'https://www.behance.net/gallery/245045951/Liquid-grainy-gradients?tracking_source=search_projects%7Cgrainy+texture'
    },
    {
      model: 'DeepLayers',
      label: 'Deep Layers Strata',
      desc: 'Topographical organic contour levels with altitude drop shadows',
      badge: 'Behance Deep Layers',
      link: 'https://www.behance.net/gallery/117856369/Deep-Layers-Volume-1?tracking_source=search_projects%7Cgrainy+texture'
    },
    {
      model: 'DarkGrainyGrit',
      label: '90 Dark Obsidian Grit',
      desc: 'Deep black field with micro-star grain & photocopier xerox grit',
      badge: 'Behance 90 Dark',
      link: 'https://www.behance.net/gallery/229601337/90-Dark-Grainy-Textures?tracking_source=search_projects|grainy+texture&l=21'
    },
    { model: 'HalftoneDotPattern', label: 'Pop Halftone', desc: 'Risograph dot raster grid' },
    { model: 'BrushedMetal', label: 'Brushed Metal', desc: 'Linear lathe specular streaks' },
    { model: 'GridOverlay', label: 'Tech Grid', desc: 'Fine HUD coordinate grid lines' },
    { model: 'CyberCircuit', label: 'Cyber Circuit', desc: 'PCB traces, logic paths & connection pads' },
    { model: 'SolarizedFilm', label: 'Solarized Film', desc: 'Analog darkroom color-rim inversion' },
    { model: 'FlatMatte', label: 'Flat Matte', desc: 'Clean satin finish with soft vignette' },
    { model: 'CarbonFiber', label: 'Carbon Fiber', desc: 'Twill weave aerospace composite fiber' },
    { model: 'CRTPhosphor', label: 'CRT Phosphor', desc: 'RGB shadow mask electron raster lines' }
  ];

  const updateColor = (key: keyof SkinDefinition, hex: string) => {
    onUpdateSkin({
      ...currentSkin,
      [key]: hex
    });
  };

  return (
    <div className="bg-[#141820] border border-white/10 rounded-xl p-4 flex flex-col gap-4 text-xs shadow-xl">
      {/* Tool Header & Navigation */}
      <div className="flex flex-col gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-wide">
              Advanced Skin & UI Studio Tools
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              · Real-time tuning for VST parameters, textures, knobs, sliders & LFOs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRandomize}
              className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-slate-300 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              🎲 Randomize
            </button>
            <button
              type="button"
              onClick={() => onSaveAsCustom(currentSkin)}
              className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded transition-colors cursor-pointer shadow-md"
            >
              ★ Save Custom
            </button>
          </div>
        </div>

        {/* Studio Sub-Tabs Bar */}
        <div className="flex items-center gap-1 p-1 bg-black/50 backdrop-blur-md rounded-xl border border-white/15 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('customizer')}
            className={`px-3 py-1.5 font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'customizer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚙️ UI Customizer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('textures1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'textures1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🧱 Textures (1,188+)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('knobs1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'knobs1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🧭 Knobs (1,188+)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sliders1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sliders1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>🎚️ Sliders (1,188+)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lfos1000')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'lfos1000'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>〰️ LFOs (1,188+)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('palette')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'palette'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Palette Lab</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('texture')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'texture'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Texture Forge</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('yup')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'yup'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-cyan-400/80 hover:text-cyan-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>YUP GPU</span>
          </button>
        </div>
      </div>

      {/* TAB: UI CUSTOMIZER (POSITION, STYLE, COLOR, HEIGHT, GLOW) */}
      {activeTab === 'customizer' && customization && onUpdateCustomization && onResetCustomization && (
        <UiCustomizerPanel
          currentSkin={currentSkin}
          customization={customization}
          onUpdateCustomization={onUpdateCustomization}
          onResetToDefaults={onResetCustomization}
        />
      )}

      {/* TAB: 1,000 TEXTURES */}
      {activeTab === 'textures1000' && onApplyTexture && (
        <TextureArchetypesBrowser
          currentSkin={currentSkin}
          onApplyTexture={onApplyTexture}
        />
      )}

      {/* TAB: 1,000 KNOBS */}
      {activeTab === 'knobs1000' && onApplyKnob && (
        <KnobArchitectBrowser
          onApplyKnob={onApplyKnob}
          activeKnobStyle={currentSkin.knobStyle}
        />
      )}

      {/* TAB: 1,000 SLIDERS */}
      {activeTab === 'sliders1000' && onApplySlider && (
        <SliderArchitectBrowser
          onApplySlider={onApplySlider}
          activeSliderPreset={activeSliderPreset}
        />
      )}

      {/* TAB: 1,000 LFOs */}
      {activeTab === 'lfos1000' && onApplyLfoVisual && (
        <LfoVisualizerBrowser
          onApplyLfoVisual={onApplyLfoVisual}
          activeLfoPreset={activeLfoPreset}
        />
      )}

      {/* TAB: PALETTE LAB */}
      {activeTab === 'palette' && (
        <div className="relative z-10 flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-300 mb-2 uppercase tracking-wider">
              6 Core Color Roles (Mapped to YUP / JUCE)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {[
                { key: 'panelDark', label: 'panelDark', desc: 'Chassis Back' },
                { key: 'panelDarker', label: 'panelDarker', desc: 'Wells & Bezels' },
                { key: 'cream', label: 'cream', desc: 'Text & Scales' },
                { key: 'amber', label: 'amber', desc: 'Main Glow Accent' },
                { key: 'ledRed', label: 'ledRed', desc: 'Active LED / Tip' },
                { key: 'ledOff', label: 'ledOff', desc: 'Inactive LED' }
              ].map(({ key, label, desc }) => {
                const hex = (currentSkin as any)[key] || '#000000';
                return (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-black/40 border border-white/15 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[10px] text-slate-300">
                        {label}
                      </span>
                      <div
                        className="w-4 h-4 rounded-full border border-black/40 shadow-sm shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => updateColor(key as any, e.target.value.toUpperCase())}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={hex}
                        onChange={(e) => updateColor(key as any, e.target.value.toUpperCase())}
                        className="w-full text-[10px] font-mono uppercase bg-black/60 text-white px-1.5 py-0.5 rounded border border-white/20 text-center"
                      />
                    </div>
                    <span className="text-[9px] text-slate-400 truncate">{desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Apply: Sanzo Wada Japanese Palettes */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Sanzo Wada Japanese Harmonies
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
              {SANZO_WADA_PALETTES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onUpdateSkin({
                      ...currentSkin,
                      name: `${p.name} Theme`,
                      panelDark: p.colors[0],
                      panelDarker: '#141414',
                      cream: p.colors[p.colors.length - 1],
                      amber: p.colors[1] || '#E8A13A',
                      ledRed: p.colors[2] || '#E6402B',
                      ledOff: '#331515'
                    });
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/50 text-left flex flex-col gap-1 cursor-pointer transition-all hover:bg-black/60"
                >
                  <span className="font-semibold text-[10px] text-slate-200 truncate">{p.name}</span>
                  <div className="flex h-3 w-full rounded-md overflow-hidden shadow-inner">
                    {p.colors.map((c, idx) => (
                      <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Apply: Futuristic Cyber Palettes */}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Futuristic Cyber / Synthwave Palettes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {FUTURISTIC_CYBER_PALETTES.map((cp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onUpdateSkin({
                      ...currentSkin,
                      name: `${cp.name}`,
                      panelDark: cp.colors[0],
                      panelDarker: cp.colors[1],
                      cream: cp.colors[2],
                      amber: cp.colors[3],
                      ledRed: cp.colors[4],
                      ledOff: cp.colors[5]
                    });
                  }}
                  className="p-2 rounded-xl bg-black/40 border border-white/10 hover:border-cyan-400/50 text-left flex flex-col gap-1 cursor-pointer transition-all hover:bg-black/60"
                >
                  <span className="font-semibold text-[10px] text-slate-200 truncate">{cp.name}</span>
                  <div className="flex h-3 w-full rounded-md overflow-hidden shadow-inner">
                    {cp.colors.map((c, i) => (
                      <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: TEXTURE FORGE */}
      {activeTab === 'texture' && (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Texture Archetype
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TEXTURE_MODELS.map((tm) => {
                const isSelected = currentSkin.panelTexture === tm.model;
                return (
                  <div
                    key={tm.model}
                    onClick={() => onUpdateSkin({ ...currentSkin, panelTexture: tm.model })}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                        : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/30'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[11px] flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          {tm.label}
                          {tm.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                              {tm.badge}
                            </span>
                          )}
                        </span>
                        {isSelected && <span className="text-cyan-400 text-[10px]">● Active</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-tight">{tm.desc}</div>
                    </div>
                    {tm.link && (
                      <div className="pt-1 border-t border-white/5 flex items-center justify-between">
                        <a
                          href={tm.link}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[9px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <span>Reference Example</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-3.5 rounded-xl bg-black/40 border border-white/15">
            <span className="font-semibold text-[11px] text-slate-300 uppercase tracking-wider">
              Texture Parameters
            </span>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Roughness</span>
                <span className="font-mono text-cyan-400">
                  {((currentSkin.textureRoughness ?? 0.5) * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={currentSkin.textureRoughness ?? 0.5}
                onChange={(e) =>
                  onUpdateSkin({ ...currentSkin, textureRoughness: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Contrast</span>
                <span className="font-mono text-cyan-400">
                  {(currentSkin.textureContrast ?? 1.0).toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={currentSkin.textureContrast ?? 1.0}
                onChange={(e) =>
                  onUpdateSkin({ ...currentSkin, textureContrast: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Vignette Depth</span>
                <span className="font-mono text-cyan-400">
                  {((currentSkin.vignetteStrength ?? 0.35) * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="0.9"
                step="0.05"
                value={currentSkin.vignetteStrength ?? 0.35}
                onChange={(e) =>
                  onUpdateSkin({ ...currentSkin, vignetteStrength: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Liquid Flow Angle</span>
                <span className="font-mono text-cyan-400">
                  {currentSkin.liquidFlowAngle ?? 45}°
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={currentSkin.liquidFlowAngle ?? 45}
                onChange={(e) =>
                  onUpdateSkin({ ...currentSkin, liquidFlowAngle: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: YUP C++20 GPU ENGINE */}
      {activeTab === 'yup' && (
        <div className="relative z-10 flex flex-col gap-4">
          <div className="bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-400/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  YUP Modern C++20 Realtime Audio & GPU Framework
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded">
                  v2026
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                GPU-accelerated vector drawing using Rive vector renderer (Metal, Vulkan, Direct3D 12, WebGPU).
              </p>
            </div>
            <a
              href="https://github.com/kunitoki/yup"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all cursor-pointer self-start sm:self-center text-xs shrink-0 flex items-center gap-1 shadow"
            >
              <span>View GitHub Repo ↗</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/15 flex flex-col gap-2">
              <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span>🖥️</span> GPU Graphics Backend
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'metal', label: 'Apple Metal' },
                  { id: 'vulkan', label: 'Vulkan' },
                  { id: 'd3d12', label: 'Direct3D 12' },
                  { id: 'webgpu', label: 'WebGPU / GL' }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setYupBackend(b.id as any)}
                    className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                      yupBackend === b.id
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <div className="font-bold text-[10px]">{b.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/15 flex flex-col gap-2">
              <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span>📐</span> Vector Anti-Aliasing
              </span>
              <div className="flex flex-col gap-1.5">
                {[
                  { id: 'subpixel', label: 'Sub-Pixel Analytic AA' },
                  { id: '4xmsaa', label: '4x MSAA Hardware' },
                  { id: '8xfxaa', label: '8x Fast Approximate AA' }
                ].map((aa) => (
                  <button
                    key={aa.id}
                    type="button"
                    onClick={() => setVectorAaQuality(aa.id as any)}
                    className={`p-2 rounded-xl text-left border cursor-pointer transition-all ${
                      vectorAaQuality === aa.id
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-200'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/25'
                    }`}
                  >
                    <div className="font-semibold text-[10px]">{aa.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
