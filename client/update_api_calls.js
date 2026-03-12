const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const clientSrcDirs = [
    'c:/Users/kmrut/OneDrive/Desktop/task cctv/client/src/pages',
    'c:/Users/kmrut/OneDrive/Desktop/task cctv/client/src/components',
    'c:/Users/kmrut/OneDrive/Desktop/task cctv/client/src/context',
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Only care about files hitting endpoints
            if (content.includes('/api/')) {
                // If it uses axios, change import and prefix
                if (content.includes('import axios from \'axios\'')) {
                    // figure out relative path to src/utils/api
                    const relativeSplit = dir.split('src')[1]; // eg: \pages\admin
                    const depth = relativeSplit ? relativeSplit.split(path.sep).filter(Boolean).length : 0;
                    const relativePrefix = depth === 0 ? './' : '../'.repeat(depth);
                    const apiImportLine = `import axios from '${relativePrefix}utils/api';`;
                    
                    content = content.replace(/import axios from 'axios';?/g, apiImportLine);
                    modified = true;
                }
                
                // For fetch calls, since we can't easily globally intercept without a SW, 
                // we'll replace fetch('/api/...') with axios.get('/api/...') for simplicity where possible,
                // but doing it automatically is risky. So we just inject VITE_API_URL if it's a fetch string.
                if (content.match(/fetch\(['"`]\/api\//)) {
                    content = content.replace(/fetch\(['"](\/api\/[^'"]+)['"]/g, 'fetch(`${import.meta.env.VITE_API_URL || ""}$1`');
                    content = content.replace(/fetch\(`(\/api\/[^`]+)`/g, 'fetch(`${import.meta.env.VITE_API_URL || ""}$1`');
                    modified = true;
                }
                
                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('✅ Updated:', fullPath);
                }
            }
        }
    }
}

clientSrcDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
    }
});
