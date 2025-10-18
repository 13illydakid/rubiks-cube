Components structure cleanup (Oct 17, 2025)

What changed
- Removed duplicate .js files where .jsx equivalents exist and are used:
  - components/SolverUI/SolverUI.js
  - components/SolverUI/SideSolverUI.js
  - components/SolverUI/SideSolverControls.js
  - components/MenuOptions/MenuOptions.js
  - components/MenuOptionsOther/MenuOptionsOther.js
  - components/ColorPicker/ColorPicker.js
  - components/ColorPicker/ColorButton.js
  - components/ColorPicker/SideColorPicker.js
  - components/ColorPicker/SideColorPickerController.js
  - components/ColorPickerInfo/ColorPickerInfo.js
- Removed unused components:
  - components/FaceColors/TopFaceColor.js
  - components/FaceColors/TopFaceColor.css
  - components/ColorPicker/TopFaceColorPicker.js

Notes
- Remaining ColorPicker code:
  - components/ColorPicker/ColorPicker.jsx (main CP UI)
  - components/ColorPicker/SideColorPicker.jsx (used in SideView)
  - components/ColorPicker/SideColorPickerController.jsx
  - components/ColorPicker/ColorButton.jsx
  - components/ColorPicker/ColorPickerUIFunctions.js
  - components/ColorPicker/ColorPicker.css
- Info banner remains at components/ColorPickerInfo/ColorPickerInfo.jsx
- Menus:
  - components/MenuOptions/MenuOptionsUnified.jsx (replaces separate left/right menus)
- Views:
  - Single responsive entry: components/ResponsiveView/ResponsiveView.jsx
  - Removed: components/SideView/SideView.jsx
  - Removed: components/MobileView/MobileView.jsx
  - Kept: components/View.jsx (used internally by ResponsiveView for mid breakpoint and desktop base layout)

Follow-up ideas
- If desired, inline View.jsx layout into ResponsiveView to have a single file own all menu/content rendering, then delete View.jsx.
- Consider pruning now-unused MenuOptionsOther folder if present and verify no imports reference it (we already switched to MenuOptionsUnified).

If you want, we can further consolidate MenuOptions + MenuOptionsOther into a single MenuOptions with left/right groups, but that requires JSX tweaks.
