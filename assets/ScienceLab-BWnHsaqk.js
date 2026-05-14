import{j as e}from"./vendor-math-H17eJiYO.js";import{r as n}from"./vendor-react-DWCtWWkq.js";import{u as C,w as S}from"./index-C2YGKN1l.js";import{A}from"./index-Zf317-0u.js";import{m as d}from"./proxy-D2nBN0CA.js";import"./vendor-utils-idSrD3ku.js";import"./vendor-ai-DlT_pbP0.js";const u=[{symbol:"H",name:"Hydrogen",color:"#fff",group:"nonmetal"},{symbol:"He",name:"Helium",color:"#ffc0cb",group:"noble"},{symbol:"Na",name:"Sodium",color:"#c0c0c0",group:"alkali"},{symbol:"Cl",name:"Chlorine",color:"#00ff00",group:"halogen"},{symbol:"O",name:"Oxygen",color:"#f00",group:"nonmetal"},{symbol:"Mg",name:"Magnesium",color:"#808080",group:"alkaline"},{symbol:"Fe",name:"Iron",color:"#8b0000",group:"metal"},{symbol:"Cu",name:"Copper",color:"#b87333",group:"metal"},{symbol:"S",name:"Sulfur",color:"#ffd700",group:"nonmetal"}];function H(){const m=C(),[a,o]=n.useState("experiment"),[p,x]=n.useState([{id:1,elements:[]},{id:2,elements:[]}]),[b,f]=n.useState(1),[l,r]=n.useState(null),[h,g]=n.useState(!1),[c,y]=n.useState("H"),j=i=>{x(s=>s.map(t=>t.id===b?{...t,elements:[...t.elements.slice(-1),i]}:t))},v=async()=>{const i=p.flatMap(s=>s.elements);if(i.length<2){m("Add at least two elements to beakers to mix!","warning");return}g(!0);try{const s=i.map(w=>w.name).join(" and "),t=await S(i[0].name,i[1].name),k=t.toLowerCase().includes("explosion")?"explosion":t.toLowerCase().includes("bubble")?"bubbles":t.toLowerCase().includes("color")?"color_change":"none";r({title:t.split(`
`)[0].replace(/#|Title: /g,""),desc:t,animation:k})}catch{m("Reaction failed. Try simpler elements.","error")}finally{g(!1)}},N=()=>{x([{id:1,elements:[]},{id:2,elements:[]}]),r(null)};return e.jsxs("div",{className:"science-lab-fullscreen animate-fade",children:[e.jsxs("div",{className:"lab-header",children:[e.jsxs("div",{className:"lab-nav",children:[e.jsx("button",{className:`nav-btn ${a==="experiment"?"active":""}`,onClick:()=>o("experiment"),children:"🧪 Experiment"}),e.jsx("button",{className:`nav-btn ${a==="atoms"?"active":""}`,onClick:()=>o("atoms"),children:"⚛️ Atom Analyzer"}),e.jsx("button",{className:`nav-btn ${a==="biology"?"active":""}`,onClick:()=>o("biology"),children:"🧬 Biology"})]}),e.jsx("button",{className:"btn btn-secondary btn-sm",onClick:()=>window.history.back(),children:"Exit Lab"})]}),e.jsxs("div",{className:"lab-content",children:[a==="experiment"&&e.jsxs("div",{className:"experiment-layout",children:[e.jsxs("div",{className:"sidebar-elements",children:[e.jsx("h3",{children:"Elements"}),e.jsx("div",{className:"element-grid",children:u.map(i=>e.jsxs("button",{className:"element-card",onClick:()=>j(i),children:[e.jsx("span",{className:"symbol",children:i.symbol}),e.jsx("span",{className:"name",children:i.name})]},i.symbol))})]}),e.jsxs("div",{className:"workspace",children:[e.jsx("div",{className:"beakers-row",children:p.map(i=>e.jsxs("div",{className:`beaker-slot ${b===i.id?"active":""}`,onClick:()=>f(i.id),children:[e.jsxs("div",{className:"beaker-label",children:["Beaker ",i.id]}),e.jsx("div",{className:"beaker-glass",children:i.elements.map((s,t)=>e.jsx("div",{className:"liquid",style:{height:"40%",bottom:0,background:s.color,opacity:.7}},t))})]},i.id))}),e.jsxs("div",{className:"controls",children:[e.jsx("button",{className:"btn btn-primary btn-lg mix-btn",onClick:v,disabled:h,children:h?"Mixing...":"⚡ INITIATE MIX"}),e.jsx("button",{className:"btn btn-ghost",onClick:N,children:"Reset"})]}),e.jsx(A,{children:l&&e.jsx(d.div,{initial:{y:50,opacity:0},animate:{y:0,opacity:1},className:"reaction-overlay",children:e.jsxs("div",{className:"reaction-card",children:[e.jsx("div",{className:"reaction-icon",children:l.animation==="explosion"?"💥":"🧪"}),e.jsx("h2",{children:l.title}),e.jsx("p",{children:l.desc}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>r(null),children:"Clear"})]})})})]})]}),a==="atoms"&&e.jsxs("div",{className:"atoms-layout",children:[e.jsx("div",{className:"atom-selector",children:u.map(i=>e.jsx("button",{className:`btn-sm ${c===i.symbol?"active":""}`,onClick:()=>y(i.symbol),children:i.name},i.symbol))}),e.jsxs("div",{className:"atom-display",children:[e.jsx("div",{className:"nucleus-large"}),e.jsx(d.div,{className:"orbit orbit-1",animate:{rotate:360},transition:{repeat:1/0,duration:4,ease:"linear"},children:e.jsx("div",{className:"electron-large"})}),e.jsx(d.div,{className:"orbit orbit-2",animate:{rotate:-360},transition:{repeat:1/0,duration:6,ease:"linear"},children:e.jsx("div",{className:"electron-large"})}),e.jsxs("div",{className:"atom-info",children:[e.jsxs("h2",{children:[c," Atom"]}),e.jsxs("p",{children:["Viewing 3D Bohr Model for ",c,"."]})]})]})]}),a==="biology"&&e.jsx("div",{className:"biology-layout",children:e.jsxs("div",{className:"cell-diag",children:[e.jsxs("div",{className:"cell-wall",children:[e.jsx("div",{className:"nucleus-cell",children:"DNA"}),e.jsx("div",{className:"mitochondria",children:"⚡"})]}),e.jsxs("div",{className:"diag-labels",children:[e.jsx("h3",{children:"Plant Cell Diagram"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Nucleus:"})," The control center"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Mitochondria:"})," The powerhouse"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Cell Wall:"})," Protection"]})]})]})]})})]}),e.jsx("style",{children:`
        .science-lab-fullscreen {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #0f172a; color: white; z-index: 2000;
          display: flex; flex-direction: column;
        }
        .lab-header { 
          padding: 12px 24px; background: #1e293b; display: flex; 
          justify-content: space-between; align-items: center; border-bottom: 1px solid #334155;
        }
        .lab-nav { display: flex; gap: 10px; }
        .nav-btn { 
          background: none; border: none; color: #94a3b8; padding: 8px 16px; 
          cursor: pointer; font-weight: 600; transition: all 0.2s;
        }
        .nav-btn.active { color: #38bdf8; border-bottom: 2px solid #38bdf8; }
        
        .lab-content { flex: 1; overflow: hidden; position: relative; }
        .experiment-layout { display: flex; height: 100%; }
        
        .sidebar-elements { 
          width: 280px; background: #1e293b; padding: 20px; 
          border-right: 1px solid #334155; overflow-y: auto;
        }
        .element-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }
        .element-card { 
          background: #334155; border: 1px solid #475569; padding: 12px; border-radius: 8px; 
          cursor: pointer; text-align: center; color: white; transition: all 0.2s;
        }
        .element-card:hover { border-color: #38bdf8; background: #475569; }
        .element-card .symbol { display: block; font-size: 1.2rem; font-weight: 800; }
        .element-card .name { font-size: 0.7rem; opacity: 0.7; }

        .workspace { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
        .beakers-row { display: flex; gap: 40px; margin-bottom: 40px; }
        .beaker-slot { 
          width: 150px; height: 200px; padding: 10px; border: 2px dashed #475569; 
          border-radius: 12px; cursor: pointer; position: relative;
        }
        .beaker-slot.active { border-color: #38bdf8; background: rgba(56, 189, 248, 0.05); }
        .beaker-label { text-align: center; font-size: 0.8rem; margin-bottom: 10px; color: #94a3b8; }
        .beaker-glass { 
          width: 100px; height: 130px; border: 3px solid rgba(255,255,255,0.4); 
          border-top: none; border-radius: 0 0 15px 15px; margin: 0 auto; position: relative; overflow: hidden;
        }
        .liquid { position: absolute; left: 0; right: 0; transition: all 0.5s; }

        .mix-btn { 
          background: #38bdf8; padding: 15px 40px; border-radius: 50px; font-weight: 800; 
          letter-spacing: 1px; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
        }

        .reaction-overlay { 
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
          background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10;
        }
        .reaction-card { 
          background: #1e293b; padding: 40px; border-radius: 24px; max-width: 500px; 
          text-align: center; border: 1px solid #38bdf8;
        }
        .reaction-icon { font-size: 4rem; margin-bottom: 20px; }

        .atoms-layout { height: 100%; display: flex; flex-direction: column; align-items: center; padding: 40px; }
        .atom-display { flex: 1; position: relative; display: flex; align-items: center; justify-content: center; width: 100%; }
        .nucleus-large { width: 40px; height: 40px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 30px #ef4444; z-index: 5; }
        .orbit { position: absolute; border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 50%; }
        .orbit-1 { width: 150px; height: 150px; }
        .orbit-2 { width: 250px; height: 250px; }
        .electron-large { width: 12px; height: 12px; background: #38bdf8; border-radius: 50%; position: absolute; top: -6px; left: 50%; }
        
        .biology-layout { height: 100%; display: flex; align-items: center; justify-content: center; }
        .cell-diag { display: flex; gap: 40px; align-items: center; }
        .cell-wall { width: 300px; height: 200px; border: 4px solid #2ecc71; border-radius: 40px; position: relative; display: flex; align-items: center; justify-content: center; }
        .nucleus-cell { width: 60px; height: 60px; background: #9b59b6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; }
      `})]})}export{H as default};
