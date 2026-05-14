import{j as e}from"./vendor-math-H17eJiYO.js";import{r as a}from"./vendor-react-DWCtWWkq.js";import{u as N,r as l,t as o,B as C}from"./index-mesJlUq9.js";import{db as b}from"./db-lHuwQJlQ.js";import{R as T,a as z}from"./Item-B6u22ouF.js";import"./vendor-utils-idSrD3ku.js";import"./vendor-ai-DlT_pbP0.js";import"./proxy-D2nBN0CA.js";function D(){const s=N(),[c,d]=a.useState([]),[p,f]=a.useState([]),[n,g]=a.useState(!1),[u,h]=a.useState(!0),m=10;a.useEffect(()=>()=>l(),[]),a.useEffect(()=>{async function t(){h(!0);try{const i=await b.lab_content.where({labType:"history_timeline",grade:m}).first();let r=[];if(i&&i.content?r=i.content:(s("Generating new History timeline...","info"),o("Generating a new historical timeline for you."),r=await C("history_timeline",m),r&&r.length>0&&await b.lab_content.add({labType:"history_timeline",grade:m,content:r,generatedAt:new Date().toISOString()})),r&&r.length>0){const j=[...r].sort((w,k)=>w.year-k.year);f(j),d([...r].sort(()=>Math.random()-.5)),o("Timeline loaded. Drag the events into the correct chronological order.")}}catch(i){console.error(i),s("Failed to load timeline.","error")}finally{h(!1)}}t()},[m,s]);const x=()=>{l(),c.every((i,r)=>i.year===p[r].year)?(g(!0),s("Correct Timeline! +50🍎","success"),o("Excellent! You have successfully reconstructed the historical timeline.")):(s("Not quite right. Try again!","error"),o("Not quite right. Review the events and try reordering them."))},y=()=>{l(),d([...p].sort(()=>Math.random()-.5)),g(!1),o("Timeline scrambled. Try again.")},v=t=>{l(),o(t)};return e.jsxs("div",{className:"gl-stage-fullscreen animate-fade",children:[e.jsxs("div",{className:"stage-hdr",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("span",{style:{fontSize:"1.8rem"},children:"⏳"}),e.jsxs("div",{children:[e.jsx("span",{className:"subject-tag-play",style:{color:"#facc15",borderColor:"#facc15",background:"rgba(250, 204, 21, 0.1)"},children:"History"}),e.jsx("h3",{style:{margin:0},children:"Interactive Timeline Lab"})]})]}),e.jsx("button",{className:"close-stage-btn",onClick:()=>{l(),window.history.back()},children:"✕"})]}),e.jsx("div",{className:"game-container-full",children:e.jsxs("div",{className:"premium-card-lg",style:{maxWidth:"800px",width:"100%"},children:[e.jsx("h3",{style:{color:"#facc15",fontSize:"2rem",marginBottom:"1rem",textAlign:"center"},children:"🇿🇦 Chronological Challenge"}),e.jsx("p",{style:{opacity:.8,marginBottom:"2rem",textAlign:"center",fontSize:"1.1rem"},children:"Drag the historical events into the correct chronological order from top (oldest) to bottom (newest)."}),u?e.jsxs("div",{className:"empty-state-premium",style:{minHeight:"300px"},children:[e.jsx("div",{className:"spinner-large",style:{borderColor:"rgba(250, 204, 21, 0.2)",borderTopColor:"#facc15"}}),e.jsx("div",{style:{color:"#facc15",marginTop:"1rem",fontWeight:800},children:"Consulting the Archives..."})]}):e.jsxs("div",{className:"timeline-container-premium",children:[e.jsx("div",{className:"timeline-line-premium"}),e.jsx(T,{axis:"y",values:c,onReorder:d,className:"timeline-list-premium",children:c.map(t=>e.jsxs(z,{value:t,className:`timeline-item-premium ${n?"solved":""}`,whileHover:{scale:1.02},whileDrag:{scale:1.05,zIndex:10},children:[e.jsx("div",{className:"year-tag-premium",children:n?t.year:"???"}),e.jsx("div",{className:"event-desc-premium",children:t.event}),e.jsxs("div",{className:"item-actions-premium",children:[e.jsx("button",{className:"pronounce-btn-inline",onClick:()=>v(t.event),title:"Read Aloud",children:"🔊"}),e.jsx("div",{className:"drag-handle-premium",children:"☰"})]})]},t.id))})]}),!u&&e.jsxs("div",{style:{marginTop:"3rem",textAlign:"center",display:"flex",justifyContent:"center",gap:"1rem"},children:[e.jsx("button",{className:"btn-premium-large",style:{background:n?"#a3e635":"linear-gradient(135deg, #facc15, #fb923c)",color:"#020617",width:"auto",padding:"1.2rem 3rem"},onClick:x,disabled:n,children:n?"Timeline Completed! ✅":"Check Timeline ⚡"}),n&&e.jsx("button",{className:"btn-ghost-premium-sm",style:{padding:"1.2rem 2rem",fontSize:"1.2rem"},onClick:y,children:"↻ Try Again"})]})]})}),e.jsx("style",{children:`
        .gl-stage-fullscreen { position: fixed; top: 0; left: 0; width: 100%; height: 100dvh; background: #020617; z-index: 9999; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; color: white; font-family: 'Outfit', sans-serif; }
        .stage-hdr { padding: 1.5rem 3.5rem; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
        .close-stage-btn { background: #ef4444; width: 50px; height: 50px; border-radius: 18px; border: none; color: white; cursor: pointer; font-size: 1.5rem; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
        .close-stage-btn:hover { background: #dc2626; transform: scale(1.05); }
        .subject-tag-play { padding: 0.4rem 1.2rem; border-radius: 1rem; font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; border: 1px solid; display: inline-block; margin-bottom: 0.3rem; }
        .game-container-full { flex: 1; padding: 2rem; display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; }

        .premium-card-lg { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 2.5rem; box-shadow: 0 20px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px); padding: 3rem; }
        .btn-premium-large { border: none; border-radius: 1.2rem; font-size: 1.2rem; font-weight: 900; cursor: pointer; transition: 0.3s; text-transform: uppercase; letter-spacing: 1px; }
        .btn-premium-large:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(250, 204, 21, 0.3); }
        .btn-ghost-premium-sm { background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 0.5rem; color: #fff; }
        .btn-ghost-premium-sm:hover { background: rgba(255,255,255,0.1); }

        .empty-state-premium { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed rgba(255,255,255,0.1); border-radius: 2rem; background: rgba(2, 6, 23, 0.4); }
        .spinner-large { width: 60px; height: 60px; border: 6px solid; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .timeline-container-premium { position: relative; padding-left: 2rem; }
        .timeline-line-premium { position: absolute; left: 15px; top: 0; bottom: 0; width: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }

        .timeline-list-premium { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 1.5rem; margin: 0; }
        .timeline-item-premium { 
          background: rgba(30, 41, 59, 0.8); border: 2px solid rgba(255,255,255,0.05); padding: 1.5rem 2rem; 
          border-radius: 1.5rem; display: flex; align-items: center; gap: 2rem; 
          cursor: grab; transition: 0.2s; position: relative;
        }
        .timeline-item-premium:active { cursor: grabbing; border-color: #facc15; box-shadow: 0 10px 25px rgba(250, 204, 21, 0.2); }
        .timeline-item-premium.solved { border-color: #a3e635; background: rgba(163, 230, 53, 0.1); cursor: default; }
        
        .year-tag-premium { 
          width: 90px; background: rgba(2, 6, 23, 0.8); padding: 0.8rem; border-radius: 1rem; 
          text-align: center; font-weight: 900; color: #facc15; font-size: 1.2rem;
          border: 1px solid rgba(250, 204, 21, 0.3); flex-shrink: 0;
        }
        .timeline-item-premium.solved .year-tag-premium { color: #a3e635; border-color: #a3e635; }

        .event-desc-premium { flex: 1; font-size: 1.2rem; line-height: 1.5; font-weight: 500; }
        
        .item-actions-premium { display: flex; align-items: center; gap: 1.5rem; }
        .drag-handle-premium { opacity: 0.5; font-size: 2rem; color: #94a3b8; }
        
        .pronounce-btn-inline { border-radius: 50%; width: 45px; height: 45px; display: inline-flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; transition: 0.2s; border: 1px solid rgba(250, 204, 21, 0.3); background: rgba(250, 204, 21, 0.1); color: #facc15; }
        .pronounce-btn-inline:hover { transform: scale(1.1); color: #020617; background: #facc15; }

        @media (max-width: 768px) {
          .stage-hdr { flex-direction: column; gap: 1.5rem; padding: 1.5rem; text-align: center; }
          .close-stage-btn { position: absolute; top: 1rem; right: 1rem; width: 40px; height: 40px; font-size: 1.2rem; }
          .timeline-container-premium { padding-left: 0; }
          .timeline-line-premium { display: none; }
          .timeline-item-premium { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.5rem; }
          .item-actions-premium { width: 100%; justify-content: space-between; }
        }
      `})]})}export{D as default};
