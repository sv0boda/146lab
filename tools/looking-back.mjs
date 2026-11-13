// Enhance reflections, leaving earlier-publication disclosures untouched.
export function lookingBack(body,lang='en'){
 const ru=lang==='ru';let target;
 body=body.replace(/<details\b([^>]*class="[^"]*\blooking-back\b[^"]*"[^>]*)>\s*<summary>([\s\S]*?)<\/summary>/g,(whole,attrs,summary)=>{
  if(!/^(Looking back|Оглядываясь назад)(?:\s|<|$)/.test(summary.trim()))return whole;
  const id=attrs.match(/\bid="([^"]+)"/)?.[1]||'looking-back';target=id;
  const topic=summary.match(/<span[^>]*>([\s\S]*?)<\/span>/)?.[1]?.trim();
  const label=ru?'Оглядываясь назад':'Looking back';
  const hint=ru?'Что получилось, что не получилось и что изменилось.':'What worked, what didn’t, and what changed.';
  return `<details${attrs}${/\bid=/.test(attrs)?'':` id="${id}"`} data-reflection><summary>${label}<span class="reflection-explanation">${hint}</span></summary>${topic?`<p class="reflection-context">${topic}</p>`:''}`;
 });
 if(!target)return body;
 const link=`<p class="reflection-jump"><a href="#${target}" data-reflection-jump>↓ ${ru?'Оглядываясь назад — что я думаю об этом сейчас':'Looking back — what I think about it now'}</a></p>`;
 if(/<div class="page-intro">[\s\S]*?<\/div>/.test(body))return body.replace(/(<div class="page-intro">[\s\S]*?<\/div>)/,'$1'+link);
 return body.replace(/(<h1\b[^>]*>[\s\S]*?<\/h1>)/,'$1'+link);
}
