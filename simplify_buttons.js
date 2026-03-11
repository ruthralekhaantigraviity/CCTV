const fs = require('fs');

const cssPath = 'client/src/index.css';

if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');

    // Simplify blue buttons: white background, grey border, dark text
    const blueButtonRegex = /\.bg-blue-600,\s*button\.bg-blue-600,\s*a\.bg-blue-600 {[\s\S]*?}/;
    const blueButtonReplace = `.bg-blue-600,
button.bg-blue-600,
a.bg-blue-600 {
  background-color: #ffffff !important;
  color: #0f172a !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  outline: none !important;
  transition: all 0.2s ease;
}`;
    css = css.replace(blueButtonRegex, blueButtonReplace);

    // Simplify .btn-primary
    const btnPrimaryRegex = /\.btn-primary {[\s\S]*?}/;
    const btnPrimaryReplace = `.btn-primary {
  background-color: #ffffff !important;
  color: #0f172a !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  outline: none !important;
  transition: all 0.2s ease;
}`;
    css = css.replace(btnPrimaryRegex, btnPrimaryReplace);

    // Simplify slate-900 (black) buttons
    const slateButtonRegex = /button\.bg-slate-900,\s*\.bg-slate-900 {[\s\S]*?}/;
    const slateButtonReplace = `button.bg-slate-900,
.bg-slate-900 {
  background-color: #ffffff !important;
  color: #0f172a !important;
  box-shadow: none !important;
  border: 1px solid #e2e8f0 !important;
  outline: none !important;
}`;
    css = css.replace(slateButtonRegex, slateButtonReplace);

    fs.writeFileSync(cssPath, css);
    console.log('index.css updated successfully with plain buttons.');
} else {
    console.error('index.css not found.');
}
