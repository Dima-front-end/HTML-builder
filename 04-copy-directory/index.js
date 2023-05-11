const fs = require('fs');
const path = require('path');

function copyDir() {
  const filesDir = path.join(__dirname, 'files');
  const copyDir = path.join(__dirname, 'files-copy');

  // Создание папки files-copy
  fs.mkdir(copyDir, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    // Чтение содержимого папки files
    fs.readdir(filesDir, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      // Копирование файлов
      for (const file of files) {
        const srcFile = path.join(filesDir, file);
        const destFile = path.join(copyDir, file);

        fs.stat(srcFile, (err, fileStat) => {
          if (err) {
            console.error(err);
            return;
          }

          if (fileStat.isFile()) {
            fs.copyFile(srcFile, destFile, (err) => {
              if (err) {
                console.error(err);
              }
            });
          } else if (fileStat.isDirectory()) {
            copyDirRecursive(srcFile, destFile);
          }
        });
      }

      // Удаление файлов из files-copy, если они удалены из files
      fs.readdir(copyDir, (err, copiedFiles) => {
        if (err) {
          console.error(err);
          return;
        }

        for (const copiedFile of copiedFiles) {
          if (!files.includes(copiedFile)) {
            const fileToRemove = path.join(copyDir, copiedFile);

            fs.stat(fileToRemove, (err, fileStat) => {
              if (err) {
                console.error(err);
                return;
              }

              if (fileStat.isFile()) {
                fs.unlink(fileToRemove, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });
              } else if (fileStat.isDirectory()) {
                removeDirRecursive(fileToRemove);
              }
            });
          }
        }
      });
    });
  });
}

function copyDirRecursive(src, dest) {
  fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.readdir(src, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      for (const file of files) {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);

        fs.stat(srcFile, (err, fileStat) => {
          if (err) {
            console.error(err);
            return;
          }

          if (fileStat.isFile()) {
            fs.copyFile(srcFile, destFile, (err) => {
              if (err) {
                console.error(err);
              }
            });
          } else if (fileStat.isDirectory()) {
            copyDirRecursive(srcFile, destFile);
          }
        });
      }
    });
  });
}

function removeDirRecursive(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      fs.unlinkSync(filePath);
    } else if (fileStat.isDirectory()) {
      removeDirRecursive(filePath);
    }
  }

  fs.rmdirSync(dir);
}

copyDir();