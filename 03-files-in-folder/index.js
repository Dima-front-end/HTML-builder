const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      if (stats.isFile()) {
        const ext = path.extname(file).substring(1);
        const fileSize = stats.size / 1000; // переводим байты в килобайты
        console.log(`${file}-${ext}-${fileSize.toFixed(3)}kb`);
      }
    });
  });
});