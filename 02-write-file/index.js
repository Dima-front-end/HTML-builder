const fs = require('fs');

fs.open('./02-write-file/file.txt', 'a', (err, fd) => {
  if (err) throw err;
  console.log('Введите текст для записи в файл, или введите "exit" для выхода:');

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (data) => {
    const input = data.trim();

    if (input === 'exit') {
      console.log('Завершение программы...');
      process.exit();
    }

    fs.appendFile(fd, input + '\n', (err) => {
      if (err) throw err;
      console.log(`Текст "${input}" успешно записан в файл!`);
    });

    console.log('Введите текст для записи в файл, или введите "exit" для выхода:');
  });
  
  process.on('SIGINT', () => {
    console.log('Завершение программы...');
    process.exit();
  });
});