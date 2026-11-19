# Third-Party Notices

This project (`geoverse`) includes or generates assets derived from the following third-party resources:

1. **world-atlas / Natural Earth**
   - Source: `world-atlas` (`land-50m.json`, `countries-110m.json`), derived from Natural Earth vector map data.
   - License: Public Domain (Natural Earth) / ISC (`world-atlas`).
   - Usage: Simplified land polygons and country boundaries extracted into `src/data/geo/world-land.json` via `tools/extract-geo.mjs`.

2. **China Provincial Boundaries & River Polylines (`src/data/geo/china-geo.json`)**
   - Derived from simplified educational outline polylines shared with sibling project `historical-map-playground` and public geographic reference coordinates for major world rivers.
   - Note: Simplified for educational visualization only; not intended for surveying or official cartographic use.

3. **Microsoft Edge Online Neural Voices (`edge-tts`)**
   - Voices used: `zh-CN-YunxiaNeural` (小念), `zh-CN-YunxiNeural` (爸爸).
   - Generated audio files in `public/voice/` are intended for personal, family, and non-commercial educational use only.

4. **Google Fonts**
   - `Comic Neue` (SIL Open Font License 1.1) and `Ma Shan Zheng` (SIL Open Font License 1.1), loaded via `<link>` in `index.html` with system font fallbacks.

5. **NASA Visible Earth / Three.js 3D Globe Textures (`public/textures/`)**
   - `earth-day.jpg` (Blue Marble), `earth-night.jpg` (Black Marble Night Lights), `earth-bump.jpg` (Topography), `earth-water.jpg` (Ocean mask), and `earth-clouds.jpg` (Clouds): derived from NASA Earth Observatory / Visible Earth public-domain imagery distributed via `three-globe` (MIT) and `three.js` examples (MIT), downscaled locally for fast educational web loading.
