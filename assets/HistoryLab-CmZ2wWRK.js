import{j as e}from"./vendor-math-H17eJiYO.js";import{r as a}from"./vendor-react-DWCtWWkq.js";import{u as v,z as j}from"./index-C2YGKN1l.js";import{db as x}from"./db-lHuwQJlQ.js";import{R as N,a as w}from"./Item-B6u22ouF.js";import"./vendor-utils-idSrD3ku.js";import"./vendor-ai-DlT_pbP0.js";import"./proxy-D2nBN0CA.js";function I(){const n=v(),[l,d]=a.useState([]),[h,p]=a.useState([]),[s,c]=a.useState(!1),[g,m]=a.useState(!0),o=10;a.useEffect(()=>{async function i(){m(!0);try{const r=await x.lab_content.where({labType:"history_timeline",grade:o}).first();let t=[];if(r&&r.content?t=r.content:(n("Generating new History timeline...","info"),t=await j("history_timeline",o),t&&t.length>0&&await x.lab_content.add({labType:"history_timeline",grade:o,content:t,generatedAt:new Date().toISOString()})),t&&t.length>0){const f=[...t].sort((y,u)=>y.year-u.year);p(f),d([...t].sort(()=>Math.random()-.5))}}catch(r){console.error(r),n("Failed to load timeline.","error")}finally{m(!1)}}i()},[o,n]);const b=()=>{l.every((r,t)=>r.year===h[t].year)?(c(!0),n("Correct Timeline! +50🍎","success")):n("Not quite right. Try again!","error")};return e.jsxs("div",{className:"lab-fullscreen animate-fade",children:[e.jsxs("div",{className:"lab-hdr",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("span",{style:{fontSize:"1.4rem"},children:"⏳"}),e.jsx("h2",{style:{margin:0,fontSize:"1.1rem"},children:"History Lab (CAPS)"})]}),e.jsx("button",{className:"btn btn-secondary btn-sm",onClick:()=>window.history.back(),children:"Exit Hub"})]}),e.jsx("div",{className:"lab-main",children:e.jsxs("div",{className:"card",style:{maxWidth:800,width:"100%"},children:[e.jsx("h3",{children:"🇿🇦 South African History Timeline"}),e.jsx("p",{style:{opacity:.7,marginBottom:30},children:"Drag the events into the correct chronological order from top to bottom."}),g?e.jsxs("div",{className:"loading-overlay",children:[e.jsx("div",{className:"spinner"}),e.jsx("div",{className:"loading-text",children:"Generating Dynamic Timeline..."})]}):e.jsx(N,{axis:"y",values:l,onReorder:d,className:"timeline-list",children:l.map(i=>e.jsxs(w,{value:i,className:`timeline-item ${s?"solved":""}`,children:[e.jsx("div",{className:"year-tag",children:s?i.year:"?"}),e.jsx("div",{className:"event-desc",children:i.event}),e.jsx("div",{className:"drag-handle",children:"☰"})]},i.id))}),e.jsxs("div",{style:{marginTop:30,textAlign:"center"},children:[e.jsx("button",{className:"btn btn-primary btn-lg",onClick:b,disabled:s,children:s?"Timeline Completed! ✅":"Check Timeline ⚡"}),s&&e.jsx("button",{className:"btn btn-ghost",style:{marginLeft:15},onClick:()=>{d([...HISTORICAL_EVENTS].sort(()=>Math.random()-.5)),c(!1)},children:"Reset"})]})]})}),e.jsx("style",{children:`
        .lab-fullscreen { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #0a0e1a; color: white; z-index: 2000; display: flex; flex-direction: column; }
        .lab-hdr { padding: 12px 24px; background: #111827; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1f2937; }
        .lab-main { flex: 1; overflow-y: auto; display: flex; align-items: center; justify-content: center; padding: 40px; }
        
        .timeline-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
        .timeline-item { 
          background: #1e293b; border: 1px solid #334155; padding: 15px 20px; 
          border-radius: 12px; display: flex; align-items: center; gap: 20px; 
          cursor: grab; transition: all 0.2s;
        }
        .timeline-item:active { cursor: grabbing; border-color: #38bdf8; }
        .timeline-item.solved { border-color: #2ecc71; background: rgba(46, 204, 113, 0.1); }
        
        .year-tag { 
          width: 80px; background: #334155; padding: 5px; border-radius: 6px; 
          text-align: center; font-weight: 800; color: #38bdf8;
        }
        .event-desc { flex: 1; font-size: 0.95rem; }
        .drag-handle { opacity: 0.3; font-size: 1.2rem; }
      `})]})}export{I as default};
