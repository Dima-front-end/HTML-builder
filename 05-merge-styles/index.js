const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const distFile = path.join(distDir, 'bundle.css');

const writeStream = fs.createWriteStream(distFile);

const files = fs.promises.readdir(stylesDir);

files.then(fileList => {
  fileList.filter(fileName => path.extname(fileName) === '.css').forEach(fileName => {
    const filePath = path.join(stylesDir, fileName);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(writeStream, { end: false });
  });

  writeStream.on('finish', () => {
    console.log('All styles were merged successfully!');
  });
}).catch(err => console.error(err));
