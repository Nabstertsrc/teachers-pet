import{j as e}from"./vendor-math-H17eJiYO.js";import{r as n}from"./vendor-react-DWCtWWkq.js";import{u as N,r as d,t as a}from"./index-mesJlUq9.js";import{A as g}from"./index-Zf317-0u.js";import{m as l}from"./proxy-D2nBN0CA.js";import"./vendor-utils-idSrD3ku.js";import"./vendor-ai-DlT_pbP0.js";const C=[{id:"battery",name:"Power Source",icon:"🔋",type:"source",desc:"A battery provides the electrical energy needed to push electrons through the circuit."},{id:"bulb",name:"Light Bulb",icon:"💡",type:"output",desc:"A load that converts electrical energy into light and heat."},{id:"switch",name:"Switch",icon:"⏻",type:"control",desc:"Controls the flow of electricity. When closed, the circuit is complete. When open, the flow stops."},{id:"wire",name:"Copper Wire",icon:"〰️",type:"connector",desc:"A conductor that allows electrons to flow easily between components."}];function A(){const x=N(),[o,f]=n.useState("circuits"),[t,b]=n.useState([]),[c,h]=n.useState(!1),[i,w]=n.useState(0),[m,y]=n.useState(0);n.useEffect(()=>()=>d(),[]);const u=r=>{d(),f(r)},v=r=>{d(),t.length<5?(b([...t,{...r,uid:Date.now()}]),a(r.desc,{rate:1.1})):(x("Circuit board is full!","warning"),a("The circuit board is full. Please clear it to start over."))},s=t.some(r=>r.id==="battery")&&t.some(r=>r.id==="bulb")&&(t.some(r=>r.id==="switch")?c:!0),j=()=>{d();const r=!c;h(r),r&&t.some(p=>p.id==="battery")&&t.some(p=>p.id==="bulb")?a("Circuit closed! Electricity is flowing and the bulb is lit.",{pitch:1.2}):r?a("Switch closed, but the circuit is missing a power source or a bulb.",{pitch:.9}):a("Circuit opened. The flow of electricity has stopped.",{pitch:1})},k=r=>{w(r),r>120&&i<=120&&a("Warning! Structural failure imminent. The load is too heavy for this arch design.",{pitch:.8,rate:1.2})};return e.jsxs("div",{className:"gl-stage-fullscreen animate-fade",children:[e.jsxs("div",{className:"stage-hdr",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12},children:[e.jsx("span",{style:{fontSize:"1.8rem"},children:"🛠️"}),e.jsxs("div",{children:[e.jsx("span",{className:"subject-tag-play",children:"STEM & Technology"}),e.jsx("h3",{style:{margin:0},children:"Interactive Engineering Lab"})]})]}),e.jsxs("div",{className:"lab-tabs-premium",children:[e.jsx("button",{className:`nav-btn-premium ${o==="circuits"?"active":""}`,onClick:()=>u("circuits"),children:"🔌 Circuits"}),e.jsx("button",{className:`nav-btn-premium ${o==="mechanics"?"active":""}`,onClick:()=>u("mechanics"),children:"⚙️ Mechanics"}),e.jsx("button",{className:`nav-btn-premium ${o==="structures"?"active":""}`,onClick:()=>u("structures"),children:"🏗️ Structures"})]}),e.jsx("button",{className:"close-stage-btn",onClick:()=>{d(),window.history.back()},children:"✕"})]}),e.jsxs("div",{className:"game-container-full",children:[o==="circuits"&&e.jsxs("div",{className:"circuits-layout-premium",children:[e.jsxs("div",{className:"tech-toolbar-premium",children:[e.jsx("h3",{children:"Components Box"}),e.jsx("p",{style:{opacity:.7,fontSize:"0.9rem",marginBottom:"1rem"},children:"Click to add parts to the breadboard. Listen to their functions."}),e.jsx("div",{className:"comp-grid-premium",children:C.map(r=>e.jsxs("button",{className:"comp-btn-premium",onClick:()=>v(r),children:[e.jsx("span",{style:{fontSize:"2rem"},children:r.icon}),e.jsx("span",{style:{fontWeight:800},children:r.name})]},r.id))}),e.jsx("button",{className:"btn-ghost-premium-sm",style:{marginTop:"2rem",width:"100%"},onClick:()=>{b([]),h(!1),d()},children:"Reset Board"})]}),e.jsxs("div",{className:"circuit-board-premium",children:[e.jsxs("div",{className:"board-grid-premium",children:[e.jsx(g,{children:t.map((r,p)=>e.jsxs(l.div,{className:`board-comp-premium ${r.id==="bulb"&&s?"glowing-bulb":""} ${r.id==="wire"&&s?"live-wire":""}`,initial:{scale:0,opacity:0},animate:{scale:1,opacity:1},exit:{scale:0,opacity:0},onClick:()=>r.id==="switch"&&j(),children:[e.jsx("span",{className:"comp-icon-large",children:r.id==="bulb"&&s?"💡":r.id==="switch"&&c?"🔌":r.icon}),e.jsxs("div",{className:"comp-label-premium",children:[r.name," ",r.id==="switch"?c?"(ON)":"(OFF)":""]})]},r.uid))}),t.length===0&&e.jsx("div",{className:"empty-hint-premium",children:"Construct your circuit here..."})]}),e.jsxs("div",{className:`status-panel-premium ${s?"active-flow":""}`,children:[e.jsx("div",{className:`status-light-premium ${s?"on":""}`}),e.jsx("span",{children:s?"CIRCUIT CLOSED: ENERGY FLOWING":"CIRCUIT OPEN: NO FLOW"})]})]})]}),o==="mechanics"&&e.jsx("div",{className:"mechanics-layout-premium",children:e.jsxs("div",{className:"premium-card-lg",children:[e.jsx("h3",{children:"⚙️ Simple Machines: The Lever"}),e.jsx("p",{style:{opacity:.8,marginBottom:"2rem"},children:"Adjust the effort to see how a lever multiplies force."}),e.jsxs("div",{className:"lever-viz-premium",children:[e.jsx("div",{className:"fulcrum-premium"}),e.jsxs(l.div,{className:"lever-arm-premium",animate:{rotate:m>50?15:m<-50?-15:0},transition:{type:"spring",stiffness:100},children:[e.jsxs("div",{className:"load-box",children:["📦 ",e.jsx("span",{className:"weight-label",children:"Heavy Load"})]}),e.jsxs("div",{className:"effort-box",children:["💪 ",e.jsx("span",{className:"weight-label",children:"Your Effort"})]})]})]}),e.jsxs("div",{className:"control-slider-container",children:[e.jsxs("label",{children:["Adjust Effort Force: ",m]}),e.jsx("input",{type:"range",min:"-100",max:"100",value:m,onChange:r=>{y(parseInt(r.target.value)),r.target.value==60&&a("The effort overcomes the load!")},className:"premium-slider"})]})]})}),o==="structures"&&e.jsx("div",{className:"structures-layout-premium",children:e.jsxs("div",{className:"premium-card-lg",children:[e.jsx("h3",{children:"🏗️ Structure Test: The Arch Bridge"}),e.jsx("p",{style:{opacity:.8,marginBottom:"2rem"},children:"Test how the arch distributes compression forces. Increase the load!"}),e.jsxs("div",{className:"bridge-viz-premium",children:[e.jsx(l.div,{className:"bridge-arch-premium",animate:{scaleY:1-i/300,y:i/6},style:{borderColor:i>120?"#ef4444":"#38bdf8"}}),e.jsx(l.div,{className:"bridge-deck-premium",animate:{y:i/3,rotate:i>140?10:0},style:{background:i>120?"#ef4444":"#38bdf8"},children:e.jsx(l.div,{className:"bridge-truck",animate:{x:[0,200,0]},transition:{repeat:1/0,duration:4,ease:"linear"},children:"🚚"})})]}),e.jsxs("div",{className:"control-slider-container",children:[e.jsxs("label",{children:["Load Weight: ",i," Tonnes"]}),e.jsx("input",{type:"range",min:"0",max:"150",value:i,onChange:r=>k(parseInt(r.target.value)),className:"premium-slider"}),e.jsx(g,{children:i>120&&e.jsx(l.div,{initial:{opacity:0,y:10},animate:{opacity:1,y:0},className:"warning-alert-premium",children:"⚠️ STRUCTURAL FAILURE IMMINENT!"})})]})]})})]}),e.jsx("style",{children:`
        .gl-stage-fullscreen { position: fixed; top: 0; left: 0; width: 100%; height: 100dvh; background: #020617; z-index: 9999; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; color: white; font-family: 'Outfit', sans-serif; }
        .stage-hdr { padding: 1.5rem 3.5rem; background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
        .close-stage-btn { background: #ef4444; width: 50px; height: 50px; border-radius: 18px; border: none; color: white; cursor: pointer; font-size: 1.5rem; transition: 0.2s; }
        .close-stage-btn:hover { background: #dc2626; transform: scale(1.05); }
        .subject-tag-play { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); padding: 0.4rem 1.2rem; border-radius: 1rem; color: #38bdf8; font-size: 0.9rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem; display: inline-block; }
        .game-container-full { flex: 1; padding: 2rem; display: flex; align-items: center; justify-content: center; position: relative; overflow-y: auto; }

        .lab-tabs-premium { display: flex; gap: 1rem; background: rgba(15, 23, 42, 0.5); padding: 0.5rem; border-radius: 2rem; border: 1px solid rgba(255,255,255,0.05); }
        .nav-btn-premium { background: transparent; border: none; color: #94a3b8; padding: 0.8rem 1.5rem; border-radius: 1.5rem; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .nav-btn-premium:hover { color: #fff; }
        .nav-btn-premium.active { background: linear-gradient(135deg, #38bdf8, #818cf8); color: #020617; box-shadow: 0 0 20px rgba(56, 189, 248, 0.3); }

        .premium-card-lg { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 3rem; padding: 3rem; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3); backdrop-filter: blur(10px); max-width: 800px; width: 100%; }
        .premium-card-lg h3 { font-size: 2rem; margin-bottom: 1rem; color: #38bdf8; }

        /* Circuits Premium */
        .circuits-layout-premium { display: flex; width: 100%; height: 100%; max-width: 1200px; gap: 2rem; }
        .tech-toolbar-premium { width: 350px; background: rgba(15, 23, 42, 0.6); padding: 2rem; border-radius: 2.5rem; border: 1px solid rgba(255,255,255,0.05); }
        .comp-grid-premium { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .comp-btn-premium { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255,255,255,0.1); padding: 1.5rem; border-radius: 1.5rem; color: white; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; transition: 0.3s; }
        .comp-btn-premium:hover { border-color: #38bdf8; background: rgba(56, 189, 248, 0.1); transform: translateY(-5px); }
        .btn-ghost-premium-sm { background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 1rem; border-radius: 1.5rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .btn-ghost-premium-sm:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .circuit-board-premium { flex: 1; background: rgba(15, 23, 42, 0.4); border-radius: 3rem; border: 2px dashed rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; position: relative; }
        .board-grid-premium { display: flex; flex-wrap: wrap; gap: 2rem; align-items: center; justify-content: center; min-height: 200px; width: 100%; padding: 2rem; }
        .board-comp-premium { display: flex; flex-direction: column; align-items: center; gap: 10px; cursor: pointer; background: rgba(30, 41, 59, 0.8); padding: 1.5rem; border-radius: 2rem; border: 1px solid rgba(255,255,255,0.1); transition: 0.3s; }
        .board-comp-premium:hover { border-color: #fbbf24; }
        .comp-icon-large { font-size: 3.5rem; }
        .comp-label-premium { font-size: 0.9rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
        .empty-hint-premium { font-size: 1.5rem; color: #64748b; font-weight: 800; font-style: italic; }
        
        .glowing-bulb { filter: drop-shadow(0 0 30px #facc15); border-color: #facc15 !important; }
        .live-wire { filter: drop-shadow(0 0 10px #38bdf8); }

        .status-panel-premium { margin-top: 3rem; display: flex; align-items: center; gap: 1rem; padding: 1rem 2rem; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 2rem; font-weight: 800; letter-spacing: 1px; transition: 0.4s; }
        .status-panel-premium.active-flow { background: rgba(163, 230, 53, 0.1); border-color: #a3e635; color: #a3e635; box-shadow: 0 0 30px rgba(163, 230, 53, 0.2); }
        .status-light-premium { width: 16px; height: 16px; border-radius: 50%; background: #ef4444; transition: 0.3s; }
        .status-light-premium.on { background: #a3e635; box-shadow: 0 0 15px #a3e635; }

        /* Mechanics & Structures Premium */
        .mechanics-layout-premium, .structures-layout-premium { display: flex; justify-content: center; width: 100%; }
        
        .lever-viz-premium { height: 250px; position: relative; margin: 3rem 0; display: flex; justify-content: center; align-items: flex-end; }
        .fulcrum-premium { position: absolute; bottom: 0; width: 0; height: 0; border-left: 40px solid transparent; border-right: 40px solid transparent; border-bottom: 80px solid #64748b; z-index: 5; }
        .lever-arm-premium { position: absolute; bottom: 80px; width: 80%; height: 16px; background: linear-gradient(90deg, #94a3b8, #cbd5e1); border-radius: 8px; z-index: 10; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .load-box, .effort-box { position: absolute; top: -60px; font-size: 3rem; display: flex; flex-direction: column; align-items: center; }
        .load-box { left: 5%; }
        .effort-box { right: 5%; }
        .weight-label { font-size: 1rem; color: #f8fafc; font-weight: 800; background: rgba(15, 23, 42, 0.8); padding: 0.2rem 0.8rem; border-radius: 1rem; margin-top: 10px; }

        .bridge-viz-premium { height: 250px; position: relative; margin: 3rem 0; border-bottom: 8px solid #1e293b; display: flex; justify-content: center; align-items: flex-end; }
        .bridge-arch-premium { position: absolute; bottom: 0; width: 70%; height: 120px; border: 8px solid; border-bottom: none; border-radius: 50% 50% 0 0; transition: border-color 0.3s; }
        .bridge-deck-premium { position: absolute; bottom: 120px; width: 90%; height: 16px; border-radius: 8px; transition: background 0.3s; }
        .bridge-truck { position: absolute; top: -50px; font-size: 3rem; }

        .control-slider-container { background: rgba(15, 23, 42, 0.4); padding: 2rem; border-radius: 2rem; text-align: left; }
        .control-slider-container label { display: block; font-weight: 800; font-size: 1.2rem; color: #38bdf8; margin-bottom: 1rem; text-transform: uppercase; }
        .premium-slider { width: 100%; -webkit-appearance: none; height: 10px; border-radius: 5px; background: #1e293b; outline: none; }
        .premium-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 25px; height: 25px; border-radius: 50%; background: #38bdf8; cursor: pointer; transition: 0.2s; }
        .premium-slider::-webkit-slider-thumb:hover { transform: scale(1.2); box-shadow: 0 0 15px #38bdf8; }

        .warning-alert-premium { color: #ef4444; font-weight: 900; font-size: 1.2rem; margin-top: 1.5rem; text-align: center; animation: pulse 1s infinite; background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 1rem; border: 1px dashed #ef4444; }

        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* Responsive */
        @media (max-width: 1024px) {
          .circuits-layout-premium { flex-direction: column; }
          .tech-toolbar-premium { width: 100%; }
        }
        @media (max-width: 768px) {
          .stage-hdr { flex-direction: column; gap: 1.5rem; padding: 1.5rem; text-align: center; }
          .lab-tabs-premium { flex-wrap: wrap; justify-content: center; }
          .close-stage-btn { position: absolute; top: 1rem; right: 1rem; width: 40px; height: 40px; font-size: 1.2rem; }
          .premium-card-lg { padding: 1.5rem; }
          .lever-arm-premium { width: 90%; }
          .load-box, .effort-box { font-size: 2rem; }
        }
      `})]})}export{A as default};
