const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir(srcDir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Step 1: Replace with temp tokens
    content = content.replace(/charcoal-light/g, '__TEMP_CHARCOAL_LIGHT__');
    content = content.replace(/parchment-dark/g, '__TEMP_PARCHMENT_DARK__');
    content = content.replace(/charcoal/g, '__TEMP_CHARCOAL__');
    content = content.replace(/parchment/g, '__TEMP_PARCHMENT__');
    
    // Step 2: Replace temp tokens with swapped values
    content = content.replace(/__TEMP_CHARCOAL_LIGHT__/g, 'parchment-dark');
    content = content.replace(/__TEMP_PARCHMENT_DARK__/g, 'charcoal-light');
    content = content.replace(/__TEMP_CHARCOAL__/g, 'parchment');
    content = content.replace(/__TEMP_PARCHMENT__/g, 'charcoal');
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Theme replacement complete.');
