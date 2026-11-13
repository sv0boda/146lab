import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
async function walk(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){
 if(entry.name.startsWith('.')||entry.name==='node_modules')continue;
 const file=path.join(dir,entry.name);
 if(entry.isDirectory())await walk(file);
 else if(entry.isFile()&&entry.name.endsWith('.html')){
  let html=await fs.readFile(file,'utf8');const old=html;
  html=html.replace(/href="https:\/\/t\.me\/vladsvoboda\/?"/g,'href="#contact" data-contact="telegram"');
  if(html.includes('data-contact="telegram"')&&!html.includes('src="/assets/contact.js"'))html=html.replace('</head>','<script defer src="/assets/contact.js"></script></head>');
  if(html!==old)await fs.writeFile(file,html);
 }
}}
await walk(root);
