const fs = require('fs').promises;
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const distDir = path.join(__dirname, 'project-dist');

async function replaceTemplateTags(template) {
  const templateTags = template.match(/{{.+?}}/g);
  if (!templateTags) return template;

  let result = template;
  for (const tag of templateTags) {
    const componentName = tag.slice(2, -2);
    const componentPath = path.join(componentsDir, `${componentName}.html`);
    const component = await fs.readFile(componentPath, 'utf-8');
    result = result.replace(tag, component);
  }
  return result;
}

async function copyAssets() {
  const targetDir = path.join(distDir, 'assets');
  await fs.mkdir(targetDir, { recursive: true });
  const assetNames = await fs.readdir(assetsDir);
  for (const name of assetNames) {
    const sourcePath = path.join(assetsDir, name);
    const targetPath = path.join(targetDir, name);
    const isDirectory = (await fs.stat(sourcePath)).isDirectory();
    if (isDirectory) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

async function mergeStyles() {
  const targetFile = path.join(distDir, 'style.css');
  const styleNames = await fs.readdir(stylesDir);
  let result = '';
  for (const name of styleNames) {
    const filePath = path.join(stylesDir, name);
    const ext = path.extname(name);
    if (ext !== '.css') continue;
    const style = await fs.readFile(filePath, 'utf-8');
    result += style;
  }
  await fs.writeFile(targetFile, result);
}

async function copyDirectory(source, target) {
  await fs.mkdir(target, { recursive: true });
  const fileNames = await fs.readdir(source);
  for (const name of fileNames) {
    const sourcePath = path.join(source, name);
    const targetPath = path.join(target, name);
    const isDirectory = (await fs.stat(sourcePath)).isDirectory();
    if (isDirectory) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await fs.copyFile(sourcePath, targetPath);
    }
  }
}

async function createDistDir() {
  await fs.mkdir(distDir, { recursive: true });
}

async function main() {
  await createDistDir();

  const templatePath = path.join(__dirname, 'template.html');
  const template = await fs.readFile(templatePath, 'utf-8');
  const result = await replaceTemplateTags(template);
  const indexPath = path.join(distDir, 'index.html');
  await fs.writeFile(indexPath, result);

  await mergeStyles();
  await copyAssets();
}

main()
  .then(() => console.log('Build completed'))
  .catch((err) => console.error(`Build failed: ${err}`));
