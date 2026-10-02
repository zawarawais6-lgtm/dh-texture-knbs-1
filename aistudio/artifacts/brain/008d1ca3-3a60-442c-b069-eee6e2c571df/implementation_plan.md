# DelayHost 2 — Audio Rig Realignment, Control Creator & Typography Overhaul

This plan details the full implementation of all features outlined in the uploaded specification and addresses each reported issue: universal text customization, direct knob/slider customization across all pages, fixing the Control Creator knob previewer, restoring the Sync Time dropdown bar, repositioning Ducking and Delay Asym, and fixing the LFO waveform display.

---

### User Confirmed Decisions

- **Text Customization Trigger**: "Hold Alt or click an Edit Text toggle button". An active visual indicator (badge/outline) highlights editable text, opening the Faceplate Text Inspector on click.
- **Sync Time Menu**: Positioned in a dedicated tempo sync bar across the top of the Delay section on the Main page.
- **Ducking & Delay Asym Knobs**: Relocated from the switches row to the Output & Master section on the far right.
- **Control Customization**: Single-click / customize trigger on every knob and slider on Main, LFOs, Nodes, and Macros tabs (not just Macros).
- **LFO Waveform Rendering**: True mathematical sine/triangle/saw curves scaled smoothly within bounds with zero wavefolding artifacts and circular radar indicators.
- **Control Creator Previewer**: Corrected SVG arc calculation, knurled teeth rendering, and smooth rotary ballistics matching the reference UI.

---

### Phase 1: Universal Faceplate Text Customization
1. **Interactive Text Mode & Alt-Key Detection**:
   - Add a global "Edit Text" toggle button in the VST container toolbar and implement `Alt` key holding listener.
   - When text editing is active, all text labels across Main, LFOs, Nodes, Macros, and the top chassis display a subtle dashed focus indicator with an edit cursor.
   - Clicking any label opens the **Text & Faceplate Inspector** with that label pre-selected.
2. **Text Inspector Capabilities**:
   - Rename or hide labels.
   - Real-time surface effect styling: *Engraved / Debossed*, *Embossed*, *Silk-Screen Printed*, *Backlit LED Glow*, and *Milled Metal*.
   - Typeface selection (*Clean Sans*, *Monospace Tabular*, *Display Bold*, *Editorial Serif*, *Industrial Stencil*) and font sizing.

---

### Phase 2: Universal Control Selection & Control Creator Previewer Fix
1. **Enable Customization for All Knobs & Sliders**:
   - Fix mouse event handling in `KnobRenderer` and control wrappers so clicking opens the **Control Creator** for that specific parameter (`main_delay`, `main_feedback`, `main_mix`, `main_glide`, `main_input_gain`, `main_output_gain`, `main_width`, `main_asym`, `main_duck`, `lfo1_rate`, `lfo1_depth`, `lfo1_phase`, `macro_1`–`16`, etc.).
   - Add a quick "Customize Control" mode toggle and parameter dropdown picker in the drawer for instantaneous selection.
2. **Fix Control Creator Knob Previewer**:
   - Fix SVG arc path calculation (`polarToCartesian`, sweep flag, and angle conversion) to eliminate inverted or broken gauge rendering.
   - Fix knurled dent gear teeth rendering: accurately space notches around the dial perimeter and rotate them smoothly with drag interaction.
   - Provide realistic cap beveling, reflection sheen, and accurate pointer needle/line graphics matching the uploaded reference screenshot.

---

### Phase 3: Main Page Layout Rebalancing
1. **Restore Dedicated Tempo Sync Bar**:
   - Insert a dedicated tempo sync header across the top of the Delay section with:
     - Free Time vs Tempo Sync toggle switch.
     - Restored **Sync Time Dropdown Menu** (`1/1`, `1/2.`, `1/2`, `1/2T`, `1/4.`, `1/4`, `1/4T`, `1/8.`, `1/8`, `1/8T`, `1/16.`, `1/16`, `1/16T`, `1/32`).
     - Millisecond readout when in free time and beat subdivision readout when synced.
2. **Relocate Ducking & Delay Asym Knobs**:
   - Move `Ducking` and `Delay Asym` to the Output & Master section on the far right alongside `Output Gain` and `Stereo Width`.
   - Restore clean dual-switch hardware styling for `Ping Pong` and `Analog Warmth` in the lower row.

---

### Phase 4: LFO Waveform Ballistics & Visualization Fix
1. **Eliminate Wavefolding & Clamping Artifacts**:
   - Replace complex folded wave calculations with true mathematical curves:
     - Pure Sine: $y = \sin(2\pi \cdot t)$
     - Pure Triangle: linear ramps between $-1$ and $+1$
     - Pure Saw / Square / Pulse with smooth scaling.
   - Scale amplitudes smoothly to fit precisely within the $[-1, +1]$ display boundary so signals never clip into wavefolding.
2. **Aspect-Corrected Vector Display**:
   - Fix SVG aspect scaling so radar playhead dots are rendered as perfect circles without distortion or oval warping.
   - Retain phosphor glow and CRT scanline styling while keeping the trace vector razor-sharp.

---

### Phase 5: Verification & End-to-End Testing
1. Verify text editing on every page (Main, LFOs, Nodes, Macros, Header) using both the toolbar toggle and Alt+Click.
2. Verify clicking any knob or slider opens the Control Creator and correctly applies styling overrides.
3. Test the fixed Control Creator previewer across small, medium, and large dials with animated drag.
4. Verify the restored Sync Time dropdown bar and right-side Ducking/Asym layout.
5. Check LFO waveforms across all shapes and ensure the single-click JUCE ZIP export operates cleanly.
