const sharp = require('sharp');
const fs = require('fs');

const sizes = [16, 32, 48, 64, 128, 256];
const buffers = [];

async function createIco() {
  for (const size of sizes) {
    const buf = await sharp('icon.png')
      .resize(size, size)
      .png()
      .toBuffer();
    buffers.push(buf);
  }

  // Write a multi-size ICO manually
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // Type: icon
  icoHeader.writeUInt16LE(sizes.length, 4); // Count

  let offset = 6 + sizes.length * 16;
  const entries = [];
  const images = [];

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const buf = buffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Colors
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bit depth
    entry.writeUInt32LE(buf.length, 8); // Size
    entry.writeUInt32LE(offset, 12); // Offset
    entries.push(entry);
    images.push(buf);
    offset += buf.length;
  }

  fs.writeFileSync('icon.ico', Buffer.concat([icoHeader, ...entries, ...images]));
  console.log('icon.ico created with sizes:', sizes);
}

createIco().catch(err => console.error(err));
