import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function translatedBodies(url,body){
 const slug=url==='/about/'?'about':url.split('/').filter(Boolean).at(-1);
 if(!url.startsWith('/experiments/')&&!url.startsWith('/personal/')&&url!=='/about/')return {};
 const result={};
 for(const lang of ['ru','uk']){
  const file=path.join(root,'content/translations',`${slug}.${lang}.json`);
  let data;try{data=JSON.parse(await fs.readFile(file,'utf8'));}catch(e){if(e.code==='ENOENT')continue;throw e;}
  const hash=crypto.createHash('sha256').update(body).digest('hex');
  if(data.sourceHash!==hash)throw Error(`Translation source changed: ${url} (${lang}). Review the translation before building.`);
  if(data.html){result[lang]=await fs.readFile(path.join(root,'content/translations',data.html),'utf8');continue;}
  let i=0;
  result[lang]=body.replace(/(?<=>)[^<>]+(?=<)/g,text=>{
   if(!text.trim())return text;
   const value=data.strings[i++];if(value===undefined)throw Error(`Missing translation: ${url} text ${i}`);
   return text.match(/^\s*/)[0]+escape(value)+text.match(/\s*$/)[0];
  });
  result[lang]=result[lang].replace(/\b(alt|aria-label|title)="([^"]*)"/g,(whole,attr,value)=>data.attributes?.[value]?`${attr}="${escape(data.attributes[value])}"`:whole);
  if(i!==data.strings.length)throw Error(`Translation count mismatch: ${url}`);
 }
 return result;
}
