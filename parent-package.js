/* Parent Player Package: a printable PDF for one player.
   Game stats + Performance Lab results. Each player is measured against himself:
   no rankings, team comparisons or coach notes. */
window.CreedPkg=(function(){
  const LBL={GP:'Games',PA:'Plate appearances',AB:'At-bats',H:'Hits','1B':'Singles','2B':'Doubles','3B':'Triples',HR:'Home runs',XBH:'Extra-base hits',TB:'Total bases',R:'Runs',RBI:'RBI','2OUTRBI':'2-out RBI',
    AVG:'Average',OBP:'On-base %',SLG:'Slugging',OPS:'OPS',BABIP:'Avg on balls in play','BA/RISP':'Avg, runners in scoring pos.',
    QAB:'Quality at-bats','QAB%':'Quality at-bat %',BB:'Walks',SO:'Strikeouts','K-L':'Strikeouts looking',HBP:'Hit by pitch','C%':'Contact %','PA/BB':'PA per walk','BB/K':'Walks per strikeout',PS:'Pitches seen','PS/PA':'Pitches per PA','2S+3':'3+ pitches after 2 strikes','2S+3%':'% 3+ after 2 strikes','6+':'6+ pitch at-bats','6+%':'% 6+ pitch at-bats',
    HHB:'Hard-hit balls',ROE:'Reached on error',FC:"Fielder's choice",SAC:'Sacrifice bunts',SF:'Sacrifice flies',LOB:'Runners left on',GIDP:'Hit into double play',GITP:'Hit into triple play',CI:"Catcher's interference",'AB/HR':'At-bats per HR',
    SB:'Stolen bases','SB%':'Steal %',CS:'Caught stealing',PIK:'Picked off'};
  const LBP={IP:'Innings',GP:'Games pitched',GS:'Games started',BF:'Batters faced','#P':'Pitches','P/IP':'Pitches per inning','P/BF':'Pitches per batter',
    H:'Hits allowed',R:'Runs allowed',ER:'Earned runs',BB:'Walks',SO:'Strikeouts','K-L':'Strikeouts looking',HBP:'Hit batters',HR:'Home runs allowed',WP:'Wild pitches',BK:'Balks',
    ERA:'ERA',WHIP:'WHIP',BAA:'Opponent average',FIP:'FIP',BABIP:'Opp. avg on balls in play','BA/RISP':'Opp. avg, runners on 2nd/3rd','K/BF':'K per batter','K/BB':'K per walk','BB/INN':'Walks per inning',
    'S%':'Strike %','FPS%':'First-pitch strike %','FPSO%':'First-strike outs %','FPSW%':'First-strike walks %','FPSH%':'First-strike hits %','<3%':'Done in 3 pitches or less','SM%':'Swing and miss %',
    LOO:'Leadoff outs','1ST2OUT':'First 2 batters out','123INN':'1-2-3 innings','<13':'Innings under 13 pitches','0BBINN':'Zero-walk innings',BBS:'Walks that scored',LOBB:'Leadoff walks',LOBBS:'Leadoff walks scored',
    'WEAK%':'Weak contact %','HHB%':'Hard contact %','GO/AO':'Ground to air outs','LD%':'Line drive %','FB%':'Fly ball %','GB%':'Ground ball %',SB:'Steals allowed',CS:'Caught stealing',PIK:'Pickoffs',LOB:'Runners stranded'};
  const LBF={TC:'Total chances',A:'Assists',PO:'Putouts',DP:'Double plays',TP:'Triple plays',INN:'Innings caught',PB:'Passed balls',SB:'Steals allowed',SBATT:'Steal attempts',CS:'Runners thrown out','CS%':'Thrown out %',PIK:'Pickoffs',CI:"Catcher's interference"};
  const POS={P:'Pitcher',C:'Catcher','1B':'First base','2B':'Second base','3B':'Third base',SS:'Shortstop',LF:'Left field',CF:'Center field',RF:'Right field',SF:'Short field'};
  const outs=x=>{const [a,b]=String(x).split('.');return (+a)*3+(+(b||0));};
  const e=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const has=v=>v!==''&&v!=null&&v!=='-';
  const tiles=(o,keys,lb,big)=>`<div class="pk-tiles${big===true?' big':big?' '+big:''}">`+keys.filter(k=>has(o[k])).map(k=>`<div class="pk-t"><b>${e(o[k])}</b><span>${e(lb[k]||k)}</span></div>`).join('')+`</div>`;
  const bars=rows=>{const m=Math.max(...rows.map(r=>r[1]),1);return `<div class="pk-bars">`+rows.map(r=>`<div class="pk-bar"><span>${e(r[0])}</span><i><u style="width:${(r[1]/m*100).toFixed(1)}%"></u></i><b>${e(r[2])}</b></div>`).join('')+`</div>`;};
  const pct=x=>has(x)?parseFloat(x).toFixed(1)+'%':'–';
  const WAVE=`<svg class="pk-wave" viewBox="0 0 816 420" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pkw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AD2FF"/><stop offset="1" stop-color="#050608" stop-opacity=".1"/></linearGradient></defs><path fill="url(#pkw)" opacity=".2" d="M0 120Q204 20 408 120T816 120V420H0Z"/><path fill="url(#pkw)" opacity=".3" d="M0 210Q204 110 408 210T816 190V420H0Z"/><path fill="url(#pkw)" opacity=".42" d="M0 300Q204 220 408 300T816 280V420H0Z"/></svg>`;
  function frame(p,title,sub,body,n,total){
    return `<section class="pk-page"><header class="pk-h"><img src="${LOGO}" alt=""><div><h2>${e(title)}</h2><p>${e(sub)}</p></div><em>#${e(p.num)} ${e(name(p))}</em></header><div class="pk-body">${body}</div><footer class="pk-f"><span>Texas Creed · Faith. Character. Brotherhood. Baseball.</span><span>${n} of ${total}</span></footer></section>`;
  }
  const name=p=>(p.nick||p.first)+' '+p.last;
  const short=p=>p.first+' '+p.last;
  /* one line chart: gradient area, dots, first and last labels */
  let gid=0;
  function line(pts,fmt){
    const W=340,H=112,L=8,R=8,T=20,B=20; const ys=pts.map(p=>p.v), lo=Math.min(...ys), hi=Math.max(...ys), span=(hi-lo)||1;
    const X=i=>pts.length>1?L+i*(W-L-R)/(pts.length-1):W/2, Y=v=>T+(hi-v)/span*(H-T-B);
    const d=pts.map((p,i)=>`${i?'L':'M'}${X(i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(''); const id='pkg'+(++gid);
    const last=pts.length-1, anchor=i=>i===0?'start':i===last?'end':'middle';
    return `<svg class="pk-ch" viewBox="0 0 ${W} ${H}" role="img" aria-label="${e(fmt(pts[0].v))} to ${e(fmt(pts[last].v))}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8AD2FF" stop-opacity=".42"/><stop offset="1" stop-color="#8AD2FF" stop-opacity="0"/></linearGradient></defs>
      <path d="${d}L${X(last).toFixed(1)} ${H-B}L${X(0).toFixed(1)} ${H-B}Z" fill="url(#${id})"/><line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="rgba(245,247,250,.16)"/>
      <path d="${d}" fill="none" stroke="#76C9F2" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.map((p,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${i===last?4.5:3}" fill="${i===last?'#fff':'#76C9F2'}" stroke="#050608" stroke-width="1.5"/>`).join('')}
      <text x="${X(0).toFixed(1)}" y="${(Y(pts[0].v)-8).toFixed(1)}" text-anchor="start" class="v">${e(fmt(pts[0].v))}</text><text x="${X(last).toFixed(1)}" y="${(Y(pts[last].v)-8).toFixed(1)}" text-anchor="end" class="v">${e(fmt(pts[last].v))}</text>
      ${pts.map((p,i)=>`<text x="${X(i).toFixed(1)}" y="${H-6}" text-anchor="${anchor(i)}" class="x">${e(p.x)}</text>`).join('')}</svg>`;
  }
  const cardChart=(title,sub,pts,fmt,note)=>`<div class="pk-card"><h4>${e(title)}</h4><p>${e(sub)}${note?` · <em>${e(note)}</em>`:''}</p>${line(pts,fmt)}</div>`;
  function growth(rows){
    const out=[], tests=[...new Set(rows.map(r=>r.test))];
    CATS.forEach(c=>tests.filter(t=>TESTS[t].cat===c).forEach(t=>{
      const list=rows.filter(r=>r.test===t), lk=protoKey(list[list.length-1]), comp=list.filter(r=>protoKey(r)===lk);
      const m0=metrics(list[list.length-1])[0]; if(!m0) return;
      const pts=monthWindows(comp.map(r=>({r,m:metrics(r).find(x=>x.k===m0.k)})).filter(x=>x.m&&x.m.val!=null)).map(s=>({v:s.m.val,x:D(s.r.date).toLocaleDateString('en-US',{month:'short'})}));
      if(pts.length<2) return;
      const f=m0.sc==='s'?v=>v.toFixed(2)+'s':m0.sc==='mph'?v=>v.toFixed(1)+' mph':m0.sc==='pct'?v=>Math.round(v)+'%':m0.sc==='rubric'?v=>v+' / 5':v=>String(v);
      out.push(cardChart(TESTS[t].name,m0.l,pts,f,m0.pol==='low'?'lower is better':m0.sc==='rubric'?'coach rating':''));
    }));
    return out;
  }
  function labRows(rows){
    const out=[];
    const tests=[...new Set(rows.map(r=>r.test))];
    CATS.forEach(c=>tests.filter(t=>TESTS[t].cat===c).forEach(t=>{
      const list=rows.filter(r=>r.test===t), lk=protoKey(list[list.length-1]), comp=list.filter(r=>protoKey(r)===lk);
      metrics(list[list.length-1]).forEach(m0=>{
        const s=monthWindows(comp.map(r=>({r,m:metrics(r).find(x=>x.k===m0.k)})).filter(x=>x.m&&x.m.val!=null)); if(!s.length) return;
        const base=s[0].m, last=s[s.length-1].m; let pr=s[0]; s.forEach(x=>{ if(better(m0,x.m.val,pr.m.val)) pr=x; });
        const ch=s.length>1?showChange(base,last):{t:'',c:''};
        const plain=v=>showVal(v).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
        out.push({cat:c,test:TESTS[t].name,metric:m0.l,base:plain(base),last:plain(last),best:plain(pr.m),ch:ch.t||'First result',c:ch.c,n:s.length,rub:m0.sc==='rubric'});
      });
    }));
    return out;
  }
  const GUIDE=[['AVG','Hits divided by at-bats'],['OBP','How often he reaches base'],['SLG','Total bases per at-bat'],['OPS','OBP plus slugging'],['Quality at-bat','A hard-hit ball, extra-base hit, walk, sacrifice, or a long, tough at-bat'],['Contact %','At-bats without a strikeout'],['Hard-hit ball','A line drive or hard ground ball'],['ERA','Earned runs per 6 innings'],['WHIP','Walks plus hits per inning'],['First-pitch strike %','First pitches thrown for a strike'],['Total chances','Assists plus putouts'],['Assist','A throw that helps get an out']];
  function build(player,rows){
    const p=(window.CREED_STATS.players||[]).find(x=>short(x)===player); if(!p) return null;
    const S=window.CREED_STATS, b=p.bat, f=p.fld, t=p.pit, pitched=outs(t.IP)>0;
    const lab=labRows(rows), labPages=[]; for(let i=0;i<Math.max(1,lab.length);i+=27) labPages.push(lab.slice(i,i+27));
    const cards=growth(rows), gPages=[]; for(let i=0;i<cards.length;i+=8) gPages.push(cards.slice(i,i+8));
    const seasons=p.seasons||[], hasSeasons=seasons.length>1;
    const pitSeasons=seasons.filter(s=>s.pit&&outs(s.pit.IP)>0), hasPitSeasons=pitSeasons.length>1;
    const total=3+(pitched?1:0)+(hasSeasons?1:0)+(hasPitSeasons?1:0)+gPages.length+labPages.length; let n=1; const pages=[];
    const when=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
    pages.push(`<section class="pk-page pk-cover">${WAVE}<div class="pk-c"><img class="pk-logo" src="${LOGO}" alt="Texas Creed logo"><p class="pk-eye">Parent Player Package</p><h1>${e(name(p))}</h1><p class="pk-no">#${e(p.num)}</p>
      <div class="pk-hero"><div><b>${e(b.AVG)}</b><span>Average</span></div><div><b>${e(b.H)}</b><span>Hits</span></div><div><b>${e(b.RBI)}</b><span>RBI</span></div><div><b>${e(b.R)}</b><span>Runs</span></div></div>
      <p class="pk-sea">${e(S.season)} · Team record ${e(S.record)} · ${e(b.GP)} games played</p><p class="pk-date">Prepared ${e(when)}</p></div></section>`); n++;
    const hits=[['Singles',+b['1B'],b['1B']],['Doubles',+b['2B'],b['2B']],['Triples',+b['3B'],b['3B']],['Home runs',+b.HR,b.HR]];
    pages.push(frame(p,'At the Plate','Hitting',
      tiles(b,['AVG','OBP','SLG','OPS'],LBL,true)+
      `<div class="pk-two"><div class="pk-s"><h3>Hits</h3>${bars(hits)}</div><div class="pk-s"><h3>Balls in play</h3>${bars([['Line drives',+b['LD%'],pct(b['LD%'])],['Fly balls',+b['FB%'],pct(b['FB%'])],['Ground balls',+b['GB%'],pct(b['GB%'])]])}</div></div>`+
      `<div class="pk-s"><h3>Production</h3>${tiles(b,['GP','PA','AB','H','XBH','TB','R','RBI','2OUTRBI','BABIP','BA/RISP','AB/HR'],LBL)}</div>`+
      `<div class="pk-s"><h3>Approach</h3>${tiles(b,['QAB','QAB%','C%','HHB','SO','K-L','BB','HBP','PA/BB','BB/K','PS','PS/PA','2S+3','2S+3%','6+','6+%'],LBL)}</div>`,n,total)); n++;
    const spots=Object.keys(POS).map(k=>[POS[k],outs(f[k]),f[k]]).filter(r=>r[1]>0).sort((x,y)=>y[1]-x[1]);
    const caught=outs(f.INN)>0;
    pages.push(frame(p,'Bases & Field','Baserunning and defense',
      `<div class="pk-s"><h3>Baserunning</h3>${tiles(b,['SB','SB%','CS','PIK','ROE','FC','LOB','GIDP','GITP','SAC','SF','CI'],LBL)}</div>`+
      `<div class="pk-s"><h3>Fielding</h3>${tiles(f,['TC','A','PO','DP','TP'],LBF)}</div>`+
      (caught?`<div class="pk-s"><h3>Catching</h3>${tiles(f,['INN','PB','SBATT','SB','CS','CS%','PIK','CI'],LBF)}</div>`:'')+
      `<div class="pk-s"><h3>Innings by position</h3>${bars(spots)}<p class="pk-note">Total innings in the field: ${e(f.Total)}. An inning of 10.2 means 10 innings and 2 outs.</p></div>`,n,total)); n++;
    if(pitched){
      pages.push(frame(p,'On the Mound','Pitching',
        tiles(t,['IP','ERA','WHIP','S%'],LBP,true)+
        `<div class="pk-s"><h3>Workload & results</h3>${tiles(t,['GP','GS','BF','#P','P/IP','P/BF','H','R','ER','BB','SO','K-L','HBP','HR','WP','BK'],LBP,'six')}</div>`+
        `<div class="pk-s"><h3>Command</h3>${tiles(t,['FPS%','FPSO%','FPSW%','FPSH%','<3%','SM%','BB/INN','K/BF','K/BB','0BBINN','LOBB','LOBBS','BBS'],LBP,'six')}</div>`+
        `<div class="pk-s"><h3>Innings, contact & running game</h3>${tiles(t,['123INN','<13','LOO','1ST2OUT','BAA','BABIP','BA/RISP','FIP','WEAK%','HHB%','GO/AO','LD%','FB%','GB%','LOB','SB','CS','PIK'],LBP,'six')}</div>`,n,total)); n++;
    }
    if(hasSeasons){
      const sp=k=>seasons.filter(s=>has(s.bat[k])).map(s=>({v:parseFloat(s.bat[k]),x:s.short||s.season}));
      const K=['GP','PA','H','HR','RBI','R','SB','AVG','OBP','SLG','OPS','QAB%'];
      pages.push(frame(p,'Season by Season','Game stats over time',
        `<div class="pk-cards">${cardChart('Average','Hits per at-bat',sp('AVG'),v=>v.toFixed(3).replace(/^0/,''))}${cardChart('OPS','On-base plus slugging',sp('OPS'),v=>v.toFixed(3).replace(/^0/,''))}${cardChart('Quality at-bats','Percent of plate appearances',sp('QAB%'),v=>v.toFixed(1)+'%')}${cardChart('Contact rate','At-bats without a strikeout',sp('C%'),v=>v.toFixed(1)+'%')}${cardChart('Hits','Total for the season',sp('H'),v=>String(v))}${cardChart('RBI','Total for the season',sp('RBI'),v=>String(v))}</div>`+
        `<table class="pk-lab pk-sea-t"><thead><tr><th>Season</th>${K.map(k=>`<th>${e(k)}</th>`).join('')}</tr></thead><tbody>${seasons.map(s=>`<tr><td><b>${e(s.season)}</b></td>${K.map(k=>`<td>${e(s.bat[k])}</td>`).join('')}</tr>`).join('')}</tbody></table>`,n,total)); n++;
    }
    if(hasPitSeasons){
      const sq=k=>pitSeasons.filter(s=>has(s.pit[k])).map(s=>({v:k==='IP'?outs(s.pit[k])/3:parseFloat(s.pit[k]),x:s.short||s.season}));
      const K=['GP','IP','BF','H','R','ER','BB','SO','ERA','WHIP','S%','FPS%'];
      pages.push(frame(p,'Season by Season','Pitching over time',
        `<div class="pk-cards">${cardChart('Innings pitched','Total for the season',sq('IP'),v=>v.toFixed(1))}${cardChart('Strikeouts','Total for the season',sq('SO'),v=>String(v))}${cardChart('Strike rate','Percent of pitches',sq('S%'),v=>v.toFixed(1)+'%')}${cardChart('First-pitch strikes','Percent of batters',sq('FPS%'),v=>v.toFixed(1)+'%')}${cardChart('ERA','Earned runs per 6 innings',sq('ERA'),v=>v.toFixed(2),'lower is better')}${cardChart('WHIP','Walks plus hits per inning',sq('WHIP'),v=>v.toFixed(2),'lower is better')}</div>`+
        `<table class="pk-lab pk-sea-t"><thead><tr><th>Season</th>${K.map(k=>`<th>${e(k)}</th>`).join('')}</tr></thead><tbody>${pitSeasons.map(s=>`<tr><td><b>${e(s.season)}</b></td>${K.map(k=>`<td>${e(s.pit[k])}</td>`).join('')}</tr>`).join('')}</tbody></table>`,n,total)); n++;
    }
    gPages.forEach(g=>{ pages.push(frame(p,'Growth Over Time','Performance Lab sessions',`<div class="pk-cards">${g.join('')}</div>`,n,total)); n++; });
    labPages.forEach((chunk,i)=>{
      const body=lab.length?`<table class="pk-lab"><thead><tr><th>Test</th><th>Baseline</th><th>Latest</th><th>Best</th><th>Change</th><th>Sessions</th></tr></thead><tbody>${chunk.map(r=>`<tr><td><b>${e(r.test)}</b><small>${e(r.cat)} · ${e(r.metric)}${r.rub?' · coach rating':''}</small></td><td>${e(r.base)}</td><td class="k">${e(r.last)}</td><td>${e(r.best)}</td><td class="${r.c}">${e(r.ch)}</td><td>${r.n}</td></tr>`).join('')}</tbody></table>`:
        `<div class="pk-s pk-empty"><h3>Assessments are on the way</h3><p>${e(name(p))} doesn't have Performance Lab results yet. The first test sets the baseline.</p></div>`;
      pages.push(frame(p,'Performance Lab','Every player versus yesterday’s version of himself',body+(i===labPages.length-1?`<p class="pk-note">Results compare each session with ${e(p.first)}’s own baseline. Skipped or invalid attempts are not counted. Sessions with a different setup are left out of the comparison. Multiple entries within a month are averaged into one result.</p>`+(chunk.length<=12?`<div class="pk-s"><h3>What the numbers mean</h3><div class="pk-guide">${GUIDE.map(g=>`<div><b>${e(g[0])}</b><span>${e(g[1])}</span></div>`).join('')}</div></div>`:''):''),n,total)); n++;
    });
    return S.sample?pages.join('').replace(/<section class="pk-page/g,'<section class="pk-page pk-demo'):pages.join('');
  }
  function fit(w){ const s=Math.min(1,(innerWidth-24)/816); w.querySelectorAll('.pk-page').forEach(g=>{g.style.zoom=s;}); }
  const MODE='creed_pkg_mode';
  function startMode(){
    try{ const v=localStorage.getItem(MODE); if(v==='dark'||v==='light') return v; }catch(e){}
    return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  }
  function setMode(w,m,keep){
    w.classList.toggle('pk-light',m==='light'); document.documentElement.classList.toggle('pk-lt',m==='light');
    w.querySelectorAll('[data-pkm]').forEach(b=>{const on=b.dataset.pkm===m;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
    if(keep){ try{localStorage.setItem(MODE,m);}catch(e){} }
  }
  function close(){ const w=document.getElementById('pkgWrap'); if(w) w.remove(); document.body.classList.remove('pk-open'); document.documentElement.classList.remove('pk-lt'); }
  function open(player,rows){
    const html=build(player,rows); if(!html) return false;
    close();
    const w=document.createElement('div'); w.id='pkgWrap';
    w.innerHTML=`<div class="pk-tool"><div class="pk-mode" role="group" aria-label="Package colors"><button data-pkm="dark">Dark</button><button data-pkm="light">Light</button></div><button class="btn sm" id="pkgSave">Save as PDF</button><button class="btn dark sm" id="pkgClose">Close</button><span>Light uses less ink when printing. On iPhone, tap Save as PDF, then Share, then Save to Files.</span></div><div class="pk-doc">${html}</div>`;
    document.body.appendChild(w); document.body.classList.add('pk-open'); fit(w);
    setMode(w,startMode()); w.querySelectorAll('[data-pkm]').forEach(b=>b.onclick=()=>setMode(w,b.dataset.pkm,true));
    document.title=`Texas Creed Player Package - ${player}`;
    w.querySelector('#pkgSave').onclick=()=>window.print();
    w.querySelector('#pkgClose').onclick=()=>{ close(); document.title='Creed Performance Lab'; };
    window.addEventListener('resize',()=>{ if(document.getElementById('pkgWrap')) fit(w); });
    return true;
  }
  return {open,close,build};
})();
