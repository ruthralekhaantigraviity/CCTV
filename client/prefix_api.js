const fs = require('fs');
const path = require('path');

const clientSrcDirs = [
    path.join(__dirname, 'src/pages'),
    path.join(__dirname, 'src/components'),
    path.join(__dirname, 'src/context'),
];

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Handle axios.get('/api/...') -> axios.get(`${import.meta.env.VITE_API_URL || ''}/api/...`)
            const axiosRegex = /axios\.(get|post|put|patch|delete)\(['"](\/api\/[^'"]+)['"]/g;
            if (axiosRegex.test(content)) {
                content = content.replace(axiosRegex, 'axios.$1(`${import.meta.env.VITE_API_URL || \'\'}$2`');
                modified = true;
            }

            // Handle fetch('/api/...') -> fetch(`${import.meta.env.VITE_API_URL || ''}/api/...`)
            const fetchRegex = /fetch\(['"](\/api\/[^'"]+)['"]/g;
            if (fetchRegex.test(content)) {
                content = content.replace(fetchRegex, 'fetch(`${import.meta.env.VITE_API_URL || \'\'}$1`');
                modified = true;
            }

            // Handle template literals: fetch(`/api/...`) -> fetch(`${import.meta.env.VITE_API_URL || ''}/api/...`)
            // We only replace if it starts exactly with `/api/` inside the backticks.
            const fetchTemplateRegex = /fetch\(`(\/api\/[^`]+)`/g;
            if (fetchTemplateRegex.test(content)) {
                content = content.replace(fetchTemplateRegex, 'fetch(`${import.meta.env.VITE_API_URL || \'\'}$1`');
                modified = true;
            }
            const axiosTemplateRegex = /axios\.(get|post|put|patch|delete)\(`(\/api\/[^`]+)`/g;
            if (axiosTemplateRegex.test(content)) {
                content = content.replace(axiosTemplateRegex, 'axios.$1(`${import.meta.env.VITE_API_URL || \'\'}$2`');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('✅ Updated:', file);
            }
        }
    }
}

clientSrcDirs.forEach(processDirectory);
