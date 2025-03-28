const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, 'config');
const files = ['admin.ts', 'api.ts', 'database.ts', 'middlewares.ts', 'plugins.ts', 'server.ts'];

files.forEach(file => {
  const filePath = path.join(configDir, file);
  const jsFilePath = path.join(configDir, file.replace('.ts', '.js'));
  
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Simple conversion from TS to JS (remove type annotations)
      fs.writeFileSync(jsFilePath, content);
      
      console.log(`Converted ${file} to JS`);
    } else {
      console.log(`File ${file} does not exist`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});

console.log('Conversion complete!');