const sharp = require('sharp');
const fs = require('fs');

const svgContent = fs.readFileSync('icon.svg');

sharp(svgContent)
  .resize(512, 512)
  .png()
  .toFile('icon.png')
  .then(() => console.log('icon.png created (512x512)'))
  .catch(err => console.error(err));
