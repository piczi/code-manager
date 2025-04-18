import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sourceDir = path.resolve(__dirname, '../node_modules/monaco-editor/min/vs');
const targetDir = path.resolve(__dirname, '../public/node_modules/monaco-editor/min/vs');

fs.ensureDirSync(path.dirname(targetDir));
fs.copySync(sourceDir, targetDir);

console.log('Monaco Editor files copied successfully!'); 