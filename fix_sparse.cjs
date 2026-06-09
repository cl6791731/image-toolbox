const fs = require('fs');

['en', 'zh'].forEach(lang => {
  const file = `src/data/articles-${lang}.js`;
  let raw = fs.readFileSync(file, 'utf-8');
  
  // Find the array definition using a manual approach
  const startIdx = raw.indexOf('export const articles = [');
  if (startIdx === -1) { console.log(lang, ': pattern not found'); return; }
  
  // Find the matching closing bracket by counting brackets
  let bracketCount = 0;
  let endIdx = -1;
  let inString = false;
  let stringChar = '';
  let inTemplate = false;
  for (let i = startIdx + 'export const articles = '.length; i < raw.length; i++) {
    const ch = raw[i];
    const prev = i > 0 ? raw[i-1] : '';
    
    if (inTemplate) {
      if (ch === '`' && prev !== '\\') inTemplate = false;
      continue;
    }
    if (ch === '`' && prev !== '\\') { inTemplate = true; continue; }
    
    if (inString) {
      if (ch === stringChar && prev !== '\\') inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; stringChar = ch; continue; }
    
    if (ch === '[') bracketCount++;
    if (ch === ']') {
      bracketCount--;
      if (bracketCount === 0) { endIdx = i; break; }
    }
  }
  
  if (endIdx === -1) { console.log(lang, ': could not find closing bracket'); return; }
  
  const arrStr = raw.substring(startIdx + 'export const articles = '.length, endIdx + 1);
  
  try {
    const arr = eval(arrStr);
    console.log(lang, ': Found', arr.length, 'elements');
    
    // Check for sparse
    const sparse = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === undefined) sparse.push(i);
    }
    
    if (sparse.length > 0) {
      console.log(lang, ': Sparse at indices:', sparse);
      
      for (const idx of sparse.reverse()) {
        // Find the position in raw text and remove the extra comma
      }
    }
  } catch(e) {
    console.log(lang, ': eval error:', e.message);
  }
});
