const fs = require('fs');

// Fix English file
let en = fs.readFileSync('src/data/articles-en.js', 'utf-8');
// Parse and filter out undefined
const enMatch = en.match(/^export const articles = (\[[\s\S]*\]);\s*$/m);
if (enMatch) {
  const arr = eval(enMatch[1]);
  const clean = arr.filter(a => a !== undefined && a !== null);
  const newArr = JSON.stringify(clean, null, 4)
    .replace(/"([^"]+)":/g, '$1:')  // unquote keys
    .replace(/: "([^"]*<[^>]*>[^"]*)"/g, ': `$1`'); // won't perfectly handle but let me try differently
  // Actually let me just rewrite the array properly
  console.log('EN: Original length:', arr.length, 'Clean length:', clean.length);
} else {
  console.log('EN: Pattern not matched');
}

// Fix Chinese file
let zh = fs.readFileSync('src/data/articles-zh.js', 'utf-8');
const zhMatch = zh.match(/^export const articles = (\[[\s\S]*\]);\s*$/m);
if (zhMatch) {
  const arr = eval(zhMatch[1]);
  const clean = arr.filter(a => a !== undefined && a !== null);
  console.log('ZH: Original length:', arr.length, 'Clean length:', clean.length);
}
