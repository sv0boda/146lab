// Package only the approved public appearances and their assets for Pages.
// Generated sources stay intact so private previews can still be rebuilt.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'_site');
const origin='https://www.146lab.com';
const analytics=JSON.parse(await fs.readFile(path.join(root,'tools/analytics-config.json'),'utf8'));
if(Boolean(analytics.scriptUrl)!==Boolean(analytics.websiteId))throw Error('Analytics requires both scriptUrl and websiteId.');
if(analytics.scriptUrl&&(new URL(analytics.scriptUrl).protocol!=='https:'||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(analytics.websiteId)))throw Error('Analytics requires an HTTPS script URL and a website UUID.');
const iconLinks="<link rel=\"icon\" href=\"/favicon.ico?v=blue-cursor-1\" sizes=\"any\"><link rel=\"icon\" type=\"image/svg+xml\" href=\"/assets/favicon.svg?v=blue-cursor-1\"><link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/apple-touch-icon.png?v=blue-cursor-1\"><link rel=\"manifest\" href=\"/site.webmanifest?v=blue-cursor-1\">";
const withIcons=html=>html.replace(/<link\b[^>]*rel="(?:icon|apple-touch-icon|manifest)"[^>]*>/g,'').replace('</head>',iconLinks+'</head>');
await fs.rm(out,{recursive:true,force:true});
await fs.mkdir(out,{recursive:true});
const copy=async rel=>{
 await fs.mkdir(path.dirname(path.join(out,rel)),{recursive:true});
 await fs.cp(path.join(root,rel),path.join(out,rel),{recursive:true,filter:src=>!path.basename(src).startsWith('.')});
};
for(const rel of ['assets','tracker','www','about/original','146.mp3','favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png','android-chrome-192x192.png','android-chrome-512x512.png','site.webmanifest','study/index','study/commander'])await copy(rel);
const put=async(rel,text)=>{await fs.mkdir(path.dirname(path.join(out,rel)),{recursive:true});await fs.writeFile(path.join(out,rel),text);};
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const analyticsTag=analytics.scriptUrl?`<script defer src="/assets/analytics.js" data-analytics-source="${escape(analytics.scriptUrl)}" data-website-id="${escape(analytics.websiteId)}"></script>`:'';
async function publicHTML(rel){
 const file=path.join(out,rel);
 let html=await fs.readFile(file,'utf8');
 html=html.replace(/<meta name="robots" content="noindex,nofollow">/g,'')
  .replace(/<p class="rss-preview-note">[\s\S]*?<\/p>/g,'')
  .replace(/<title>(.*?) · (?:Index|Commander) · 146 Lab<\/title>/,'<title>$1 · 146 Lab</title>');
 const route='/'+rel.replace(/index\.html$/,'');
 const canonical=origin+route.replace('/study/commander/','/study/index/');
 html=html.replace('</head>',`<link rel="canonical" href="${canonical}">${analyticsTag}</head>`);
 await fs.writeFile(file,withIcons(html));
}
const routes=[];
async function walk(dir){
 for(const item of await fs.readdir(path.join(out,dir),{withFileTypes:true})){
  const rel=path.posix.join(dir,item.name);
  if(item.isDirectory())await walk(rel);
  else if(item.name==='index.html'){await publicHTML(rel);routes.push('/'+rel.replace(/index\.html$/,''));}
  else if(item.name==='rss.xml'){
   const s=await fs.readFile(path.join(out,rel),'utf8');
   await put(rel,s.replaceAll('https://goddess.taile28e0a.ts.net:8443',origin));
  }
 }
}
await walk('study/index');await walk('study/commander');
let entrance=await fs.readFile(path.join(root,'study/index.html'),'utf8');
entrance=withIcons(entrance);
entrance=entrance.replace(/<meta name="robots" content="noindex,nofollow">/g,'');
await put('index.html',entrance.replace('</head>',`<link rel="canonical" href="${origin}/"></head>`));
await put('study/index.html',entrance.replace('</head>',`<link rel="canonical" href="${origin}/"></head>`));
// Keep previously shared content URLs usable, including their query and fragment.
for(const route of routes.filter(r=>r.startsWith('/study/index/'))){
 const legacy=route.replace('/study/index/','/');
 if(legacy==='/')continue;
 const target=route;
 await put(legacy.slice(1)+'index.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>146 Lab</title><link rel="canonical" href="${origin+target}"><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script><noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript></head><body><a href="${target}">Continue to 146 Lab</a></body></html>`);
}
await put('rss.xml',(await fs.readFile(path.join(root,'rss.xml'),'utf8')).replaceAll('https://goddess.taile28e0a.ts.net:8443',origin));
await put('robots.txt',`User-agent: *\nAllow: /\nDisallow: /tracker/\nSitemap: ${origin}/sitemap.xml\n`);
await put('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/',...routes.filter(r=>r.startsWith('/study/index/'))].map(r=>`<url><loc>${origin+escape(r)}</loc></url>`).join('')}</urlset>`);
await put('404.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · 146 Lab</title><link rel="stylesheet" href="/assets/lab.css"><link rel="stylesheet" href="/assets/six-studies.css"></head><body class="six v-index"><main class="reading-page"><h1>That page isn’t here.</h1><p><a href="/study/index/">Browse the lab</a> or <a href="/study/index/all/">find a page in the index</a>.</p></main></body></html>`);
await put('.nojekyll','');
console.log(`Release packaged: ${routes.length} pages, entrance, legacy redirects, feeds and unchanged tracker.`);
