import{j as e}from"./vendor-math-DlEAAsrb.js";import{f as C,u as E,h as S,r as n}from"./vendor-react-Df8dkrhI.js";import{a as L,g as M}from"./kids-theme-CkCEqrR6.js";import{g as b,b as z}from"./adaptivePlanner-D4DQ_zna.js";function P(){var f,u;const{gameId:c}=C(),d=E(),[o,g]=S(),s=L(c),r=n.useMemo(()=>s?b(s):null,[s]),[t,x]=n.useState(o.get("level")||((f=r==null?void 0:r.recommendedLevel)==null?void 0:f.toLowerCase())||"core"),[l,m]=n.useState(o.get("sessionMode")||((u=r==null?void 0:r.recommendedMode)==null?void 0:u.toLowerCase())||"practice"),[j,v]=n.useState(0),w=n.useMemo(()=>M().filter(a=>a.id!==c).map(a=>({...a,adaptive:b(a)})).sort((a,i)=>i.adaptive.state.mastery-a.adaptive.state.mastery).slice(0,4),[c,j]);if(n.useEffect(()=>{if(!r)return;const a=o.get("level")||r.recommendedLevel.toLowerCase(),i=o.get("sessionMode")||r.recommendedMode.toLowerCase();x(a),m(i)},[r,o]),!s)return e.jsx("div",{className:"page-wrapper animate-fade kids-theme",children:e.jsxs("div",{className:"card",style:{textAlign:"center",padding:60},children:[e.jsx("h1",{children:"🎮 Game Not Found"}),e.jsx("button",{className:"btn btn-primary",onClick:()=>d("/games"),children:"Open Game Lab"})]})});const y=`${s.path}${s.path.includes("?")?"&":"?"}level=${t}&mode=${l}`,k={practice:"Guided pacing with room to build confidence.",sprint:"Faster rounds and stronger speed pressure.",mastery:"Higher challenge with fewer second chances."},N={support:"Best for scaffolding, hints, and steady wins.",core:"Balanced difficulty for everyday practice.",advanced:"Stretch level for confident learners."};function h(a,i=l){x(a),m(i),g({level:a,sessionMode:i},{replace:!0})}function F(a){m(a),g({level:t,sessionMode:a},{replace:!0})}function p(a){z(s.id,a,l),v(i=>i+1)}return e.jsxs("div",{className:"game-fullscreen-container animate-fade kids-theme",children:[e.jsxs("aside",{className:"game-side-panel",children:[e.jsxs("div",{className:"game-panel-top",children:[e.jsxs("div",{className:"game-title-wrap",children:[e.jsx("div",{className:"game-icon",children:s.icon}),e.jsxs("div",{children:[e.jsx("h1",{children:s.title}),e.jsx("p",{children:s.description})]})]}),e.jsxs("div",{className:"game-meta-row",children:[e.jsx("span",{className:"game-title-pill",style:{background:`${s.accent}22`,color:s.accent},children:s.category}),e.jsx("span",{className:"game-title-pill",children:s.difficulty})]})]}),e.jsxs("div",{className:"game-panel-block",children:[e.jsx("h3",{children:"Objective"}),e.jsx("p",{children:s.objective})]}),e.jsxs("div",{className:"game-panel-block",children:[e.jsx("h3",{children:"Controls"}),e.jsx("p",{children:s.controls})]}),e.jsxs("div",{className:"game-panel-block",children:[e.jsx("h3",{children:"Skill Focus"}),e.jsx("div",{className:"game-skill-list",children:s.skills.map(a=>e.jsx("span",{className:"game-skill-pill",children:a},a))})]}),e.jsxs("div",{className:"game-panel-block",children:[e.jsx("h3",{children:"Adaptive Session"}),e.jsxs("p",{children:["Recommended: ",e.jsx("strong",{children:r.recommendedLevel})," level in ",e.jsx("strong",{children:r.recommendedMode})," mode."]}),e.jsx("p",{style:{marginTop:6},children:r.challenge}),e.jsx("div",{className:"session-picker",children:(s.levels||["Support","Core","Advanced"]).map(a=>e.jsx("button",{className:`session-pill ${t===a.toLowerCase()?"active":""}`,onClick:()=>h(a.toLowerCase()),children:a},a))}),e.jsx("div",{className:"session-picker",style:{marginTop:8},children:(s.modes||["Practice"]).map(a=>e.jsx("button",{className:`session-pill ${l===a.toLowerCase()?"active":""}`,onClick:()=>F(a.toLowerCase()),children:a},a))}),e.jsxs("div",{className:"card-glass",style:{padding:12,marginTop:10},children:[e.jsx("div",{style:{fontWeight:700},children:"Current Setup"}),e.jsx("div",{style:{fontSize:"0.86rem",marginTop:4},children:N[t]}),e.jsx("div",{style:{fontSize:"0.86rem",marginTop:4},children:k[l]}),e.jsxs("div",{style:{fontSize:"0.82rem",marginTop:8,color:"var(--text-muted)"},children:["Attempts logged: ",r.state.attempts," | Mastery: ",r.state.mastery,"%"]})]}),e.jsxs("div",{className:"feedback-actions",children:[e.jsx("button",{className:"btn btn-primary btn-sm",onClick:()=>p("solved"),children:"I Solved It"}),e.jsx("button",{className:"btn btn-secondary btn-sm",onClick:()=>p("support"),children:"Need Support"}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>{p("solved"),h("advanced","mastery")},children:"Too Easy"})]})]}),e.jsxs("div",{className:"game-panel-actions",children:[e.jsx("button",{className:"btn btn-primary",onClick:()=>d("/games"),children:"Browse Game Lab"}),e.jsx("button",{className:"btn btn-secondary",onClick:()=>window.open(s.path,"_blank","noopener,noreferrer"),children:"Open Standalone"}),e.jsx("button",{className:"btn btn-ghost",onClick:()=>d("/student"),children:"Back To Student Hub"})]}),e.jsxs("div",{className:"game-panel-block",children:[e.jsx("h3",{children:"Try Next"}),e.jsx("div",{className:"game-recommendations",children:w.map(a=>e.jsxs("button",{className:"game-reco-card",onClick:()=>d(`/game/${a.id}?level=${a.adaptive.recommendedLevel.toLowerCase()}&sessionMode=${a.adaptive.recommendedMode.toLowerCase()}`),children:[e.jsx("span",{children:a.icon}),e.jsx("strong",{children:a.title}),e.jsxs("small",{children:[a.category," · ",a.adaptive.recommendedLevel]})]},a.id))})]})]}),e.jsx("main",{className:"game-frame-shell",children:e.jsx("iframe",{src:y,className:"game-iframe",title:s.title,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0})}),e.jsx("style",{children:`
        .game-fullscreen-container {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: linear-gradient(135deg, #E1F5FE, #81D4FA 50%, #4FC3F7);
          display: flex;
          gap: 20px;
          padding: 20px;
        }

        .game-side-panel {
          width: 360px;
          max-width: 32vw;
          background: #FFFFFF;
          border: 4px solid #E0E0E0;
          border-radius: 30px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow-y: auto;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        .game-panel-top h1 {
          margin: 0 0 6px;
          font-size: 2rem;
          color: #333;
          font-family: 'Fredoka One', 'Comic Neue', sans-serif;
        }

        .game-panel-top p,
        .game-panel-block p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          font-weight: 500;
        }

        .game-title-wrap {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .game-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: #F5F5F5;
          font-size: 2.2rem;
          flex-shrink: 0;
          border: 3px solid #EEE;
        }

        .game-meta-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 14px;
        }

        .game-panel-block h3 {
          margin: 0 0 8px;
          color: #FF5252;
          font-size: 1.1rem;
          font-family: 'Fredoka One', 'Comic Neue', sans-serif;
        }

        .game-panel-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .session-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .session-pill {
          background: #f8fafc;
          border: 2px solid #cbd5e1;
          border-radius: 999px;
          padding: 7px 12px;
          color: #0f172a;
          font-weight: 700;
        }
        .session-pill.active {
          background: #dbeafe;
          border-color: #60a5fa;
        }
        .feedback-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 10px;
        }

        .game-title-pill {
          background: #F5F5F5;
          color: #333;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          border: 2px solid #E0E0E0;
          display: inline-flex;
          align-items: center;
        }

        .game-skill-list {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .game-skill-pill {
          background: #E8F5E9;
          color: #2E7D32;
          border: 2px solid #81C784;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .game-recommendations {
          display: grid;
          gap: 10px;
        }

        .game-reco-card {
          background: #F5F5F5;
          border: 3px solid #E0E0E0;
          border-radius: 20px;
          padding: 14px;
          color: #333;
          text-align: left;
          display: grid;
          gap: 4px;
          cursor: pointer;
        }

        .game-reco-card:hover {
          background: #FFF;
          border-color: #4FC3F7;
        }

        .game-reco-card span {
          font-size: 1.5rem;
        }

        .game-reco-card strong {
          font-size: 1.05rem;
          font-family: 'Fredoka One', 'Comic Neue', sans-serif;
        }

        .game-reco-card small {
          color: #666;
          font-weight: 600;
        }

        .game-frame-shell {
          flex: 1;
          min-width: 0;
          border-radius: 30px;
          overflow: hidden;
          border: 4px solid #E0E0E0;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          background: #020617;
        }

        .game-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        @media (max-width: 1100px) {
          .game-fullscreen-container {
            flex-direction: column;
          }

          .game-side-panel {
            width: 100%;
            max-width: none;
            max-height: 42vh;
          }
          .feedback-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 700px) {
          .game-fullscreen-container {
            padding: 12px;
            gap: 12px;
          }

          .game-side-panel {
            padding: 18px;
            border-radius: 18px;
          }

          .game-frame-shell {
            border-radius: 18px;
          }
        }
      `})]})}export{P as default};
