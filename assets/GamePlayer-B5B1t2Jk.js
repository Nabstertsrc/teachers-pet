import{j as e}from"./vendor-math-H17eJiYO.js";import{f as r,u as s}from"./vendor-react-DWCtWWkq.js";const a="/teachers-pet/",l={"fluffy-jump":{title:"Fluffy Jump",path:`${a}fluffy-jump/index.html`,icon:"☁️"},"word-quest":{title:"Word Quest",path:`${a}word-quest/index.html`,icon:"📝"},"snake-game":{title:"Snake Game",path:`${a}snake-game/index.html`,icon:"🐍"}};function c(){const{gameId:n}=r(),i=s(),t=l[n];return t?e.jsxs("div",{className:"game-fullscreen-container animate-fade",children:[e.jsxs("div",{className:"game-overlay-header",children:[e.jsx("button",{className:"btn btn-secondary btn-sm",onClick:()=>i("/student"),children:"⬅️ Back to Student Hub"}),e.jsxs("div",{className:"game-title-pill",children:[t.icon," ",t.title]})]}),e.jsx("iframe",{src:t.path,className:"game-iframe",title:t.title,allow:"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0}),e.jsx("style",{children:`
        .game-fullscreen-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 2000;
          background: #000;
          display: flex;
          flex-direction: column;
        }
        .game-overlay-header {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
          z-index: 2001;
        }
        .game-overlay-header button {
          pointer-events: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .game-title-pill {
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .game-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `})]}):e.jsx("div",{className:"page-wrapper animate-fade",children:e.jsxs("div",{className:"card",style:{textAlign:"center",padding:60},children:[e.jsx("h1",{children:"🎮 Game Not Found"}),e.jsx("button",{className:"btn btn-primary",onClick:()=>i("/student"),children:"Back to Student Hub"})]})})}export{c as default};
