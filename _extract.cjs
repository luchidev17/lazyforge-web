const fs=require('fs');
const path=require('path');
const root='C:\\Users\\User\\.cursor\\projects\\c-Users-User-Desktop-Games-ProyectoMod\\agent-transcripts';
function walk(d, out=[]) {
  for (const e of fs.readdirSync(d,{withFileTypes:true})) {
    const p=path.join(d,e.name);
    if (e.isDirectory()) walk(p,out); else if (e.name.endsWith('.jsonl')) out.push(p);
  }
  return out;
}
let globalBest=null, globalFile=null;
for (const f of walk(root)) {
  const t=fs.readFileSync(f,'utf8');
  let app=null;
  const re2=/\"new_string\":\"((?:\\\\.|[^\"\\\\])*)\"/g;
  let m;
  while((m=re2.exec(t))) {
    try {
      const s=JSON.parse('\"'+m[1]+'\"');
      if (s.includes('function App') && s.includes('export default') && s.length>(app?.length||0)) app=s;
    } catch(e){}
  }
  if (app && app.length>(globalBest?.length||0)) { globalBest=app; globalFile=f; }
}
console.log('global best', globalBest?.length, globalFile);
if (globalBest) fs.writeFileSync('C:\\Users\\User\\Desktop\\Games\\ProyectoMod\\_recovered_app.jsx', globalBest, 'utf8');
