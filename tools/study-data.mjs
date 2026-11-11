import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
export const egg='..-. ..- -.-. -.- / -.-- --- ..- / -.--. .--- -.- / -.- . -.- / .. .-.. -.-- -.--.-';
export const pages=[];
async function collect(dir){for(const f of await fs.readdir(path.join(site,dir),{withFileTypes:true})){
 const rel=path.posix.join(dir,f.name);if(rel==='about/original')continue;
 if(f.isDirectory())await collect(rel);else if(f.name==='index.html'){
  const html=await fs.readFile(path.join(site,rel),'utf8'),main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/),h1=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if(!main||!h1||/http-equiv="refresh"/i.test(html))continue;
  const url='/'+rel.replace(/index.html$/,'');
  const titles={'/writing/':'Writing','/writing/book/':'The book','/experiments/':'Experiments','/experiments/belka/ru/':'Belka (Russian)','/about/':'About Vlad','/questions/':'Questions'};
  const kind=/^\/(writing\/(en|ru)|experiments)\/[^/]+\//.test(url)?(url.startsWith('/experiments/')?'Experiment':'Writing'):'Index';
  pages.push({url,title:titles[url]||plain(h1[1]),body:main[1],reading:/<main[^>]*reading-page/.test(html),lang:html.match(/<html lang="([^"]+)"/)?.[1]||'en',kind,
   desc:plain(html.match(/<p class="lede">([\s\S]*?)<\/p>/)?.[1]||html.match(/<meta name="description" content="([^"]*)"/)?.[1]||''),
   excerpt:plain(main[1].match(/<(?:article|div) class="prose"[^>]*>\s*<p>([\s\S]*?)<\/p>/)?.[1]||''),
   date:(plain(html.match(/<time[^>]*>(.*?)<\/time>/s)?.[1]||html.match(/<p class="eyebrow">(.*?)<\/p>/s)?.[1]||'').match(/20\d\d/)||['—'])[0]});
 }
}}
for(const dir of ['writing','experiments','about','questions'])await collect(dir);
export const get=url=>pages.find(p=>p.url===url);
export const logo=(await fs.readFile(path.join(site,'about/original/index.html'),'utf8')).match(/<pre>([\s\S]*?)<\/pre>/)[1].replace(/<[^>]*>/g,'').replace(/^\n/,'').trimEnd();
export const questions=[
 {q:'How do we make experience visible?',short:'Perception',urls:['/experiments/belka/','/writing/en/soul-internet/']},
 {q:'What does freedom ask of us?',short:'Freedom',urls:['/writing/en/is-freedom-a-lack-of-responsibility/','/experiments/greed-is-god/','/experiments/belka/']},
 {q:'What changes when a story changes medium?',short:'Storytelling',urls:['/experiments/bmw-850-ci/','/writing/book/','/experiments/ocean-within/']}
];
export const selected=['/experiments/belka/','/writing/en/how-i-met-your-dog/','/experiments/greed-is-god/','/experiments/ocean-within/'].map(get);
export const variants=[
 {id:'index',code:'A1',name:'Index',family:'archive',desc:'A compact directory. White space, blue links, quiet reading.',gesture:'Browse a name; follow its connections.'},
 {id:'atlas',code:'A2',name:'Atlas',family:'archive',desc:'Text makes the map. Branches, coordinates and paths between work.',gesture:'Choose a question to trace a different route.'},
 {id:'ledger',code:'A3',name:'Ledger',family:'archive',desc:'Strict black and white. Large type, a margin index, a record of work.',gesture:'Read the lab like a personal publication.'},
 {id:'shell',code:'T1',name:'Shell',family:'terminal',desc:'The page is a transcript. Directories, commands and their output.',gesture:'Try ls, cd experiments, cat belka. Tab completes.'},
 {id:'commander',code:'T2',name:'Commander',family:'terminal',desc:'Two panes, one blue screen. Select a file and inspect its contents.',gesture:'Use ↑ ↓ to select; Enter to read. Clicking works too.'},
 {id:'bbs',code:'T3',name:'BBS',family:'terminal',desc:'An 80-column bulletin board. Numbered doors and an archive of dispatches.',gesture:'Choose a number, or follow a link.'}
];
export const routeSet=new Set([...pages.map(p=>p.url),'/','/all/','/morse/']);
export const baseFor=id=>'/study/'+id;
export function mapped(id,body){return body.replace(/href="(\/[^"#?]*)([^" ]*)"/g,(full,url,tail)=>routeSet.has(url)?`href="${baseFor(id)}${url}${tail}"`:full);}
export async function write(rel,html){const target=path.join(site,rel);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,html+'\n');}
export function converter(){return `<div class="page-intro"><p class="eyebrow">Utility / signals</p><h1>Morse converter</h1><p class="lede">A different way to say it.</p></div><div class="morse-module"><label for="morse-input">Message</label><textarea id="morse-input" rows="5" spellcheck="false" placeholder="Write something, or enter dots and dashes…"></textarea><p class="small">Letters: spaces. Words: /.</p><div class="morse-actions"><button type="button" id="decode">Decode → text</button><button type="button" id="encode">Encode → Morse</button><button type="button" id="morse-clear">Clear</button></div><h2 class="output-label">Received</h2><output id="morse-output" aria-live="polite">Waiting for a signal.</output><p id="morse-status" role="status"></p></div><details class="morse-key"><summary>The alphabet [+]</summary><div id="morse-alphabet"></div></details>`;}
