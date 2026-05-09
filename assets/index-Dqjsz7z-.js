const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Dashboard-C33usAYy.js","assets/vendor-math-DlEAAsrb.js","assets/vendor-react-Df8dkrhI.js","assets/storage-D8UsB4__.js","assets/db-Cw-BAkFp.js","assets/vendor-utils-CRC7zdVY.js","assets/vendor-ai-DlT_pbP0.js","assets/LessonGenerator-MGUBqpl4.js","assets/export-BZC966B3.js","assets/Mermaid-DPqlg7ri.js","assets/index-B07Rvtaw.js","assets/AnnualPlan-zUBAGP4f.js","assets/QuestionPaper-ZNAlWR_c.js","assets/Timetable-DSDM4TAR.js","assets/Gradebook-Bir_GVyR.js","assets/Resources-BxWN08EA.js","assets/StudentPortal-PBotKJA1.js","assets/Todo-cFZFt1Pn.js","assets/ParentComm-BB9fNF6C.js","assets/Attendance-Bz3TL5Zz.js","assets/RubricGenerator-BmAWyKzl.js","assets/ReportCard-Qlyr3ays.js","assets/Settings-D9kmiDwB.js","assets/Professionalism-DEgB6DQh.js","assets/CareerTools-xlu1ZwzO.js","assets/StudentDashboard-kMt1AOVG.js","assets/kids-theme-CkCEqrR6.js","assets/kids-theme-B5__vV-N.css","assets/adaptivePlanner-D4DQ_zna.js","assets/IPTPortfolio-KClpCCzh.js","assets/AcademicCoach-HmEMBOU3.js","assets/ClassroomIdeas-W3s8GUzr.js","assets/Assignments-E6FYINdv.js","assets/LearningPath-FE0-j-ts.js","assets/AutoOrganizer-BwOrOiqy.js","assets/pdfProcessor-CpGTJ1Q0.js","assets/Achievements-B7E4F057.js","assets/OpportunitiesHub-Csyk366C.js","assets/Institutions-8gVfTFEz.js","assets/MathsLab-DVzKchjS.js","assets/MathsLab-C90HeB7u.css","assets/ScienceLab-DlKofUyz.js","assets/index-D7wqjhQs.js","assets/proxy-C8b9OayX.js","assets/ReadingLab-PnvJdNcP.js","assets/MathsGames-BMoH4UTk.js","assets/GameHub-XfrDioXy.js","assets/StudyLab-DerwOn2i.js","assets/SocialSciencesHub-DgwsAiD0.js","assets/EnglishLab-CcrZgExn.js","assets/EMSHub-B1VY4G6d.js","assets/LifeOrientationHub-hAQo9w9T.js","assets/TechnologyLab-FSI-IA-W.js","assets/HistoryLab-C-jiwNx1.js","assets/NaturalSciencesLab-Dgi55GyH.js","assets/GamePlayer-CP-hisYf.js","assets/About-B4--v1De.js"])))=>i.map(i=>d[i]);
import{j as e}from"./vendor-math-DlEAAsrb.js";import{a as z,r as f,u as V,N as E,R as p,B as F,b as q,d as U,e as m}from"./vendor-react-Df8dkrhI.js";import{_ as h}from"./vendor-utils-CRC7zdVY.js";import{G as Y}from"./vendor-ai-DlT_pbP0.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();var P={},$=z;P.createRoot=$.createRoot,P.hydrateRoot=$.hydrateRoot;const L=f.createContext(null),it=()=>f.useContext(L),O=f.createContext(null),N=()=>f.useContext(O);function H({children:a}){const[t,n]=f.useState(!1),[o,s]=f.useState(!1),[r,i]=f.useState(!1),[l,c]=f.useState(()=>localStorage.getItem("tp_theme")||"office"),[y,b]=f.useState([]),[S,x]=f.useState([{role:"assistant",content:`👋 Hi! I'm your Unified Teaching Assistant. Use these commands to get started:

/reflect - Portfolio reflections
/check - Harvard citation check
/idea - Classroom activities

Or just ask me anything!`}]),[u,d]=f.useState(!1),v=f.useRef(0);f.useEffect(()=>{document.documentElement.setAttribute("data-theme",l),localStorage.setItem("tp_theme",l)},[l]);const w=f.useCallback((j,A="info",k=3500)=>{const I=++v.current;b(T=>[...T,{id:I,message:j,type:A}]),setTimeout(()=>b(T=>T.filter(G=>G.id!==I)),k)},[]),D=f.useCallback(j=>b(A=>A.filter(k=>k.id!==j)),[]),M=f.useCallback(async j=>{i(!0),x(A=>[...A,{role:"user",content:j}])},[]);return e.jsx(O.Provider,{value:{sidebarCollapsed:t,setSidebarCollapsed:n,mobileMenuOpen:o,setMobileMenuOpen:s,aiPanelOpen:r,setAiPanelOpen:i,aiMessages:S,setAiMessages:x,aiLoading:u,setAiLoading:d,askAI:M,toast:w,theme:l,setTheme:c},children:e.jsxs(L.Provider,{value:w,children:[a,e.jsx(W,{toasts:y,dismiss:D})]})})}function W({toasts:a,dismiss:t}){const n={info:"ℹ️",success:"✅",error:"❌",warning:"⚠️"};return e.jsx("div",{className:"toast-container",children:a.map(o=>e.jsxs("div",{className:`toast toast-${o.type}`,onClick:()=>t(o.id),style:{cursor:"pointer"},children:[e.jsx("span",{children:n[o.type]||"ℹ️"}),e.jsx("span",{style:{fontSize:"0.88rem",color:"var(--text)"},children:o.message})]},o.id))})}const R=window.SpeechRecognition||window.webkitSpeechRecognition;function J({onResult:a,onEnd:t,onError:n,continuous:o=!1,lang:s="en-ZA"}){if(!R)return console.warn("Speech Recognition not supported"),null;const r=new R;return r.continuous=o,r.interimResults=!0,r.lang=s,r.maxAlternatives=1,r.onresult=i=>{const l=Array.from(i.results).map(y=>y[0].transcript).join(""),c=i.results[i.results.length-1].isFinal;a==null||a(l,c)},r.onend=()=>t==null?void 0:t(),r.onerror=i=>n==null?void 0:n(i.error),r}function _(a,{rate:t=1,pitch:n=1,lang:o="en-ZA"}={}){if(!window.speechSynthesis)return;window.speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(a);s.rate=t,s.pitch=n,s.lang=o;const r=window.speechSynthesis.getVoices(),i=r.find(l=>l.lang.startsWith("en")&&l.name.includes("Female"))||r.find(l=>l.lang.startsWith("en"));i&&(s.voice=i),window.speechSynthesis.speak(s)}function B(){var a;(a=window.speechSynthesis)==null||a.cancel()}function K(a){const t=a.toLowerCase().trim();if(t.includes("go to dashboard")||t.includes("open dashboard"))return{action:"navigate",target:"/"};if(t.includes("go to lessons")||t.includes("open lessons"))return{action:"navigate",target:"/lessons"};if(t.includes("open timetable")||t.includes("go to timetable"))return{action:"navigate",target:"/timetable"};if(t.includes("open gradebook")||t.includes("go to gradebook"))return{action:"navigate",target:"/gradebook"};if(t.includes("open settings")||t.includes("go to settings"))return{action:"navigate",target:"/settings"};if(t.includes("open question paper")||t.includes("go to question paper"))return{action:"navigate",target:"/question-paper"};if(t.includes("open annual plan")||t.includes("go to annual plan"))return{action:"navigate",target:"/annual-plan"};if(t.includes("open resources")||t.includes("go to resources"))return{action:"navigate",target:"/resources"};if(t.includes("open todo")||t.includes("go to todo")||t.includes("open tasks"))return{action:"navigate",target:"/todo"};if(t.includes("open student")||t.includes("student portal"))return{action:"navigate",target:"/student"};const n=t.match(/generate (?:a )?lesson (?:on |about )?(.+?)(?:\s+for grade\s+(\w+))?$/i);if(n)return{action:"generate-lesson",topic:n[1],grade:n[2]||""};const o=t.match(/(?:create|generate) (?:a )?question paper (?:for )?(.+?)(?:\s+grade\s+(\w+))?$/i);if(o)return{action:"generate-question-paper",subject:o[1],grade:o[2]||""};if(t.includes("read this")||t.includes("read to me"))return{action:"read"};if(t.includes("stop")||t.includes("cancel")||t.includes("quiet"))return{action:"stop"};const s=t.match(/add (?:a )?task[:\s]+(.+)/i);return s?{action:"add-task",task:s[1]}:t.includes("reflect on")||t.includes("start reflection")?{action:"ai-reflect",content:t.replace(/reflect on|start reflection/i,"").trim()}:t.includes("check this")||t.includes("harvard check")?{action:"ai-check",content:t.replace(/check this|harvard check/i,"").trim()}:t.includes("idea for")||t.includes("classroom ideas")?{action:"ai-idea",content:t.replace(/idea for|classroom ideas/i,"").trim()}:t.includes("ask ai")||t.includes("tell ai")?{action:"ai-chat",content:t.replace(/ask ai|tell ai/i,"").trim()}:{action:"unknown",transcript:t}}const C=f.createContext(null),Q=()=>f.useContext(C);function X({children:a}){const[t,n]=f.useState(!1),[o,s]=f.useState(""),[r]=f.useState(()=>!!(window.SpeechRecognition||window.webkitSpeechRecognition)),i=f.useRef(null),l=V(),{toast:c,askAI:y}=N(),b=f.useCallback(()=>{var u;(u=i.current)==null||u.stop(),i.current=null,n(!1)},[]),S=f.useCallback(()=>{if(t){b();return}s("");const u=J({onResult:(d,v)=>{s(d),v&&(x(d),i.current=null,n(!1))},onEnd:()=>{n(!1),i.current=null},onError:d=>{c(`Voice error: ${d}`,"error"),n(!1)}});if(!u){c("Voice not supported in this browser","warning");return}i.current=u,u.start(),n(!0)},[t]),x=f.useCallback(u=>{var v;const d=K(u);switch(d.action){case"navigate":l(d.target),_(`Opening ${d.target.replace("/","").replace("-"," ")||"dashboard"}`),c(`🎙️ Going to ${d.target}`,"info");break;case"generate-lesson":l("/lessons",{state:{prefill:{topic:d.topic,grade:d.grade}}}),_(`Opening lesson generator for ${d.topic}`),c(`🎙️ Lesson generator ready for: ${d.topic}`,"info");break;case"generate-question-paper":l("/question-paper",{state:{prefill:{subject:d.subject,grade:d.grade}}}),_("Opening question paper builder"),c(`🎙️ Question paper: ${d.subject}`,"info");break;case"read":const w=((v=document.querySelector(".page-wrapper"))==null?void 0:v.innerText)||"";_(w.slice(0,500));break;case"stop":B(),c("🔇 Stopped reading","info");break;case"add-task":l("/todo",{state:{prefill:{title:d.task}}}),c(`✅ Adding task: ${d.task}`,"success");break;case"ai-reflect":y(`/reflect ${d.content}`),_(`Starting portfolio reflection ${d.content?"on your day":""}`);break;case"ai-check":y(`/check ${d.content}`),_("Checking text for Harvard style and tone");break;case"ai-idea":y(`/idea ${d.content}`),_(`Generating classroom activities for ${d.content}`);break;case"ai-chat":y(d.content);break;default:c(`🎙️ Heard: "${u}" — Command not recognized`,"warning")}},[l]);return e.jsx(C.Provider,{value:{listening:t,transcript:o,supported:r,startListening:S,stopListening:b,setTranscript:s},children:a})}const Z=[{title:"LESSON PREP",icon:"📂",items:[{path:"/lessons",label:"Lesson Generator",icon:"📚"},{path:"/classroom-ideas",label:"Classroom Ideas",icon:"💡"},{path:"/annual-plan",label:"Annual Teaching Plan",icon:"📅"}]},{title:"ASSESSMENTS",icon:"📂",items:[{path:"/question-paper",label:"Question Papers",icon:"📝"},{path:"/rubric",label:"Rubric Builder",icon:"📏"}]},{title:"ADMINISTRATION",icon:"📂",items:[{path:"/gradebook",label:"Gradebook",icon:"📊"},{path:"/attendance",label:"Attendance",icon:"📝"},{path:"/timetable",label:"Timetable",icon:"🗓️"},{path:"/report-card",label:"Report Cards",icon:"📜"}]},{title:"PROFESSIONAL",icon:"📂",items:[{path:"/professionalism",label:"QMS & Intervention",icon:"🛡️"},{path:"/ipt-portfolio",label:"IPT Portfolio",icon:"📘"},{path:"/academic-coach",label:"Academic Coach",icon:"🎓"},{path:"/career-tools",label:"Career Tools",icon:"🚀"},{path:"/opportunities",label:"Career Hub",icon:"🌍"}]},{title:"STUDENT HUB",icon:"📂",items:[{path:"/student",label:"Dashboard",icon:"🏠"},{path:"/student-portal",label:"Student Portal",icon:"🎓"},{path:"/study-lab",label:"AI Study Lab",icon:"🔬"},{path:"/auto-organizer",label:"Auto-Organizer",icon:"📂"},{path:"/assignments",label:"Assignments",icon:"📋"},{path:"/learning-path",label:"Learning Path",icon:"🗺️"},{path:"/maths-lab",label:"Maths Lab",icon:"📐"},{path:"/science-lab",label:"Science Lab",icon:"⚗️"},{path:"/reading-lab",label:"Reading Lab",icon:"📖"},{path:"/social-sciences-hub",label:"Social Sciences",icon:"🌍"},{path:"/english-lab",label:"English Lab",icon:"📝"},{path:"/ems-hub",label:"EMS Hub",icon:"💼"},{path:"/life-orientation",label:"Life Orientation",icon:"🧭"},{path:"/technology-lab",label:"Technology Lab",icon:"🛠️"},{path:"/history-lab",label:"History Lab",icon:"⏳"},{path:"/natural-sciences-lab",label:"Natural Sciences",icon:"🧬"},{path:"/achievements",label:"Achievements",icon:"🏆"},{path:"/institutions",label:"Universities",icon:"🏛️"}]},{title:"BRAIN GAMES",icon:"📂",items:[{path:"/games",label:"Game Lab",icon:"🎮"},{path:"/game/fluffy-jump",label:"Fluffy Jump",icon:"☁️"},{path:"/game/word-quest",label:"Word Quest",icon:"📝"},{path:"/maths-games",label:"Maths Brain Games",icon:"🧠"},{path:"/game/snake-game",label:"Snake Game",icon:"🐍"},{path:"/game/number-ninja",label:"Number Ninja",icon:"🥷"},{path:"/game/memory-matrix",label:"Memory Matrix",icon:"🧩"}]},{title:"TOOLS",icon:"📂",items:[{path:"/resources",label:"Resources",icon:"📖"},{path:"/todo",label:"To-Do List",icon:"✅"},{path:"/parent-comm",label:"Parent Comm",icon:"📧"},{path:"/about",label:"About Platform",icon:"ℹ️"}]}];function ee(){const{sidebarCollapsed:a,setSidebarCollapsed:t,setAiPanelOpen:n,mobileMenuOpen:o}=N(),[s,r]=f.useState(["LESSON PREP","STUDENT HUB"]),i=c=>{r(y=>y.includes(c)?y.filter(b=>b!==c):[...y,c])},l=c=>{const y=s.includes(c.title);return e.jsxs("div",{className:"nav-folder",children:[e.jsxs("div",{className:`nav-folder-header ${y?"open":""}`,onClick:()=>i(c.title),title:c.title,children:[e.jsx("span",{className:"nav-icon folder-icon",children:y?"▾":"▸"}),!a&&e.jsx("span",{className:"nav-label",children:c.title}),!a&&e.jsx("span",{className:"folder-arrow",children:y?"▾":"▸"})]}),y&&e.jsx("div",{className:"nav-folder-content",children:c.items.map(b=>e.jsxs(E,{to:b.path,className:({isActive:S})=>`nav-item sub-item ${S?"active":""}`,title:b.label,children:[e.jsx("span",{className:"nav-icon",children:b.icon}),!a&&e.jsx("span",{className:"nav-label",children:b.label})]},b.path))})]},c.title)};return e.jsxs("aside",{className:`sidebar ${a?"collapsed":""} ${o?"mobile-open":""}`,children:[e.jsxs("div",{className:"sidebar-header",children:[e.jsxs("div",{className:"sidebar-logo",children:[e.jsx("span",{className:"logo-icon",children:"🍎"}),!a&&e.jsxs("span",{className:"logo-text",children:["Teacher's Pet ",e.jsx("small",{style:{fontSize:"0.6rem",opacity:.5},children:"v1.1"})]})]}),e.jsx("button",{className:"collapse-btn",onClick:()=>t(c=>!c),children:a?"›":"‹"})]}),e.jsxs("nav",{className:"sidebar-nav",children:[e.jsxs(E,{to:"/",end:!0,className:({isActive:c})=>`nav-item ${c?"active":""}`,title:"Dashboard",children:[e.jsx("span",{className:"nav-icon",children:"🏠"}),!a&&e.jsx("span",{className:"nav-label",children:"Home"})]}),Z.map(l)]}),e.jsxs("div",{className:"sidebar-footer",children:[e.jsxs("button",{className:"nav-item",onClick:()=>n(c=>!c),title:"AI Assistant",children:[e.jsx("span",{className:"nav-icon",children:"🤖"}),!a&&e.jsx("span",{className:"nav-label",children:"AI Assistant"})]}),e.jsxs(E,{to:"/settings",className:({isActive:c})=>`nav-item ${c?"active":""}`,title:"Settings",children:[e.jsx("span",{className:"nav-icon",children:"⚙️"}),!a&&e.jsx("span",{className:"nav-label",children:"Settings"})]})]})]})}function te({collapsed:a}){const{listening:t,transcript:n,supported:o,startListening:s}=Q();return o?e.jsxs("div",{className:`voice-bar ${a?"sidebar-collapsed":""}`,children:[e.jsx("button",{className:`voice-btn ${t?"listening":""}`,onClick:s,title:t?"Stop listening (click to cancel)":"Start voice command",children:t?"🛑":"🎙️"}),e.jsx("div",{className:"voice-transcript",children:t?e.jsxs("span",{style:{color:"var(--accent)",display:"flex",alignItems:"center",gap:8},children:[e.jsxs("span",{className:"generating-dots",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),n||"Listening…"]}):e.jsx("span",{children:n?`"${n}"`:'Say a command — e.g. "Generate a lesson on photosynthesis for Grade 9"'})}),e.jsxs("div",{className:"hide-mobile",style:{display:"flex",gap:8,flexShrink:0},children:[e.jsx("div",{className:"badge badge-primary",style:{fontSize:"0.72rem"},children:"🎙️ Voice Active"}),e.jsx("div",{style:{fontSize:"0.75rem",color:"var(--text-muted)",alignSelf:"center"},children:'Try: "Open timetable" · "Create question paper"'})]})]}):null}const ae=()=>{try{const a=localStorage.getItem("tp_settings");return a?JSON.parse(a):{}}catch{return{}}},ne=a=>new Promise(t=>setTimeout(t,a)),se=(a="")=>a.replace(/^```[a-zA-Z]*\n?/,"").replace(/\n?```$/,"").trim();function oe(a,t=null){try{const n=se(a);return JSON.parse(n)}catch{try{const n=a.match(/\{[\s\S]*\}/);if(n)return JSON.parse(n[0]);const o=a.match(/\[[\s\S]*\]/);return o?JSON.parse(o[0]):t}catch{return t}}}function re(a,t){const n=String(a||"").replace(/[^\d+\-*/().=xX\s]/g,"").trim(),o=n.match(/^([+-]?\d*)\s*[xX]\s*([+-]\s*\d+)?\s*=\s*([+-]?\d+)$/);if(o){const s=o[1].replace(/\s+/g,""),r=(o[2]||"0").replace(/\s+/g,""),i=Number(o[3]),l=s===""||s==="+"?1:s==="-"?-1:Number(s),c=Number(r||0);if(!Number.isNaN(l)&&!Number.isNaN(c)&&!Number.isNaN(i)&&l!==0){const y=(i-c)/l;return`## Offline Maths Solver (Fallback)

Given: \\(${l}x ${c>=0?"+":"-"} ${Math.abs(c)} = ${i}\\)

1. Move constant to the right: \\(${l}x = ${i-c}\\)
2. Divide by \\(${l}\\): \\(x = ${y}\\)

Final answer: **x = ${y}**

_Grade ${t} explanation generated in offline fallback mode._`}}try{if(/^[\d+\-*/().\s]+$/.test(n)){const s=Function(`"use strict"; return (${n})`)();if(typeof s=="number"&&Number.isFinite(s))return`## Offline Maths Solver (Fallback)

Expression: \\(${n}\\)

Result: **${s}**

_No AI provider available, so this was solved locally._`}}catch{}return`## Maths Helper (Fallback)

I could not reach the AI provider right now. Please verify your API key/network in **Settings**, then retry.

Problem submitted:

> ${a}`}function ie(a,t){return`## ${a} - Grade ${t} (Fallback Lesson)

### 1. Quick Concept
- Understand the core definition of **${a}**.
- Identify where it appears in real problems.

### 2. Worked Structure
1. Read the question carefully.
2. Identify known values.
3. Choose the correct formula/rule.
4. Substitute and simplify.
5. Check if answer is reasonable.

### 3. Practice
- Example A: Basic recall question
- Example B: Multi-step application
- Example C: Word problem translation

### 4. Pro Tip
- Keep an error log: write each mistake and its correction pattern.

_This lesson is shown because AI service is currently unavailable._`}async function g(a,t="",n=3){var c,y;if(typeof window<"u"&&!navigator.onLine)throw new Error("No internet connection detected. Please check your network.");const o=ae(),s=o.geminiKey||void 0,r=o.deepseekKey||void 0,i=async b=>{if(!s)throw new Error("No Gemini API key");return(await new Y(s).getGenerativeModel({model:b,...t&&{systemInstruction:t}}).generateContent(a)).response.text()},l=async()=>{if(!r)throw new Error("No DeepSeek API key");const b=await fetch("https://api.deepseek.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({model:"deepseek-chat",messages:[{role:"system",content:t},{role:"user",content:a}]})});if(!b.ok)throw new Error(`DeepSeek error: ${b.status}`);return(await b.json()).choices[0].message.content};for(let b=0;b<n;b++)try{if(s){const S=["gemini-2.5-flash","gemini-2.5-flash-lite","gemini-2.0-flash","gemini-1.5-flash","gemini-1.5-flash-latest"];let x=null;for(const u of S)try{return await i(u)}catch(d){if(x=d,(c=d.message)!=null&&c.includes("404")){console.warn(`Gemini model ${u} not found, trying next...`);continue}break}if(console.warn("All Gemini models failed, falling back to DeepSeek...",x==null?void 0:x.message),r)return await l();throw x}if(r)return await l();throw new Error("No AI API keys provided")}catch(S){const x=((y=S.message)==null?void 0:y.toLowerCase())||"";if(x.includes("failed to fetch")||x.includes("networkerror")||x.includes("internet"))throw new Error("Network error: Please check your internet connection and try again.");if((x.includes("429")||x.includes("500")||x.includes("503"))&&b<n-1){await ne(2e3*(b+1));continue}throw S}}async function ct({subject:a,grade:t,topic:n,duration:o,objectives:s,language:r="English",style:i="formal",extraDetails:l=""}){const c=`You are a high-level educational consultant and curriculum designer. 
Your goal is to create PRE-PRINT READY, professional lesson plans.
STRICT FORMATTING RULES:
1. Use clear, bold Markdown headings (H1, H2, H3).
2. Use professional tables for timings and activities.
3. Use bullet points for objectives and resources.
4. INTEGRATE VISUALS: If a concept is complex (e.g., Water Cycle, Digestive System, Logic Gates, Market Equilibrium), you MUST include a \`\`\`mermaid code block to visualize it.
5. Tone: Academic, encouraging, and highly structured.`,y=`Create a complete lesson plan with the following details:
- Subject: ${a}
- Grade/Level: ${t}
- Topic: ${n}
- Duration: ${o} minutes
- Learning Objectives: ${s}
- Language of instruction: ${r}
- Teaching style: ${i}
${l?`- Additional details: ${l}`:""}

Include these sections:
## 1. Lesson Overview
## 2. Prior Knowledge Required
## 3. Resources & Materials
## 4. Introduction / Hook (with timing)
## 5. Main Body / Development (with timing and teacher/learner activities)
## 6. Guided Practice / Activities
## 7. Assessment & Differentiation
## 8. Conclusion & Reflection
## 9. Homework / Extension Tasks
## 10. Reflection Notes (for teacher to complete after lesson)`;return g(y,c)}async function lt({subject:a,grade:t,terms:n,weeksPerTerm:o,curriculum:s="CAPS"}){const r=s.includes("CAPS")||s.includes("South Africa"),i=`You are a curriculum specialist designing professional Annual Teaching Plans (ATPs).
FORMATTING:
1. Use H1 for the Subject and Grade.
2. Use large Markdown tables for the breakdown.
3. Use high-contrast formatting (Bold keys, clear separators).
4. Tone: Official, compliant, and organized.`,c=`Create a complete Annual Teaching Plan for:
- Subject: ${a}
- Grade: ${t}
- Curriculum: ${s}
- Terms: ${n}

Format Requirements:
1. Use Markdown tables for each term.
2. ${r?"Columns: WEEK | LISTENING AND SPEAKING | READING AND VIEWING | WRITING AND PRESENTING | LANGUAGE STRUCTURES AND CONVENTIONS":"Columns: WEEK | TOPIC | SUBTOPICS | ASSESSMENT"}
3. Group weeks in pairs (e.g., 1-2, 3-4) to match official ATP pacing.
4. Include detailed bullet points for activities and sub-skills in each cell.
5. Add a "Resources Required" section after each term table.`;return g(c,i)}async function dt({subject:a,grade:t,topic:n,totalMarks:o,sections:s,difficulty:r,includeAnswers:i}){const l=`You are a senior assessment specialist and examiner. 
Your goal is to create a PROFESSIONAL EXAM PAPER that looks official and is ready for duplication.
STRICT FORMATTING:
1. Header: School Name, Subject, Grade, Total Marks, Time.
2. Instructions: Clear, numbered instructions for the student.
3. Questions: Use proper numbering (e.g., 1.1, 1.2). Include mark allocations in brackets like [5] or (2).
4. VISUALS: For at least one section, include a "Source-Based" question. Refer to a diagram: "Question 2: Refer to the diagram of the [Topic] below and answer the questions that follow."
5. DIAGRAMS: You MUST provide the diagram using \`\`\`mermaid syntax if the subject allows (Science, Math, Tech, Geo, etc.).
6. Page layout: Use clear separation between sections.`,c=`Create a ${a} question paper for Grade ${t} on the topic: "${n}"
- Total marks: ${o}
- Difficulty: ${r}
- Sections: ${s}
- Include memorandum: ${i?"Yes":"No"}

Structure:
- Professional Header (School, Subject, Grade, Date, Time, Marks)
- Clear Sections (A, B, C etc.)
- Use various question types: MCQ, Short Answer, Long Answer, Paragraph.
- Mark allocations like [5] or [2+2=4]
- Diagrams: Use \`\`\`mermaid blocks for visual aids (e.g., flowcharts, cycles, or simple structures).
${i?"- Detailed Memorandum at the end":""}`;return g(c,l)}async function ut({subject:a,grade:t,topic:n,lessonContent:o=""}){const s="You are a student-friendly tutor creating engaging, easy-to-understand study guides. Use emojis, examples, and simple language.",r=`Create a comprehensive study guide for:
- Subject: ${a}  - Grade: ${t}
- Topic: ${n}
${o?`Based on this content:
${o.slice(0,1e3)}`:""}

Include: Key concepts, definitions, worked examples, memory tips, quick quiz (5 questions with answers), summary checklist.`;return g(r,s)}async function pt({subject:a,grade:t,topic:n,count:o=10}){const s="You create concise, effective flashcards for students. Return ONLY valid JSON array.",r=`Create ${o} flashcards for ${a} Grade ${t}, topic: "${n}".
Return ONLY a JSON array: [{"front": "question/term", "back": "answer/definition"}, ...]`,i=await g(r,s);try{const l=i.match(/\[[\s\S]*\]/);return JSON.parse(l?l[0]:i)}catch{return[]}}async function ce(a,t=""){const n=`You are Teacher's Pet AI, a helpful assistant for teachers and students. ${t}`,o=a.slice(-10).map(r=>`${r.role==="user"?"User":"Assistant"}: ${r.content}`).join(`
`),s=a[a.length-1];return g(`${o}

User: ${s.content}
Assistant:`,n)}async function mt(){return g('Give ONE short, inspiring quote for teachers. Just the quote and author, nothing else. Format: "Quote" — Author')}async function ht({subject:a,grade:t,topic:n}){const o=`Suggest 5 educational resources (websites, videos, books) for teaching ${a} Grade ${t}, topic: "${n}". Format as JSON array: [{"title":"","type":"website|video|book","url":"","description":""}]`,s=await g(o);try{const r=s.match(/\[[\s\S]*\]/);return JSON.parse(r?r[0]:s)}catch{return[]}}async function ft({subject:a,grade:t,taskDescription:n,criteriaCount:o=4,levelCount:s=4}){const r="You are a curriculum expert creating detailed marking rubrics.",i=`Create a marking rubric for a ${a} task for Grade ${t}.
Task: ${n}
Levels: ${s} levels (e.g. 1-4)
Criteria: ${o} distinct criteria
Format: Return as a Markdown table with levels as columns and criteria as rows. Include specific descriptors for each cell.`;return g(i,r)}async function gt({studentName:a,subject:t,performance:n,personality:o,length:s="medium"}){const r="You are a professional teacher writing constructive, balanced student report comments.",i=`Write a ${s} report comment for ${a} in ${t}.
Performance: ${n}
Personality/Behavior: ${o}
Ensure it is professional, highlights strengths, and gives 1 area for improvement. Avoid clichés.`;return g(i,r)}async function yt({type:a,studentName:t,subject:n,details:o}){const s="You are a professional teacher writing a helpful email to a parent.",r=`Write a ${a} email for a student named ${t} regarding ${n}. 
Additional details: ${o}
Make it professional, supportive, and clear. Include a subject line.`;return g(r,s)}async function le(a){const t=`You are an expert in Teacher Education and IPT (Initial Professional Training) Portfolios for UNISA.
Your goal is to help a student teacher reflect on their day.
If the input is a messy voice transcript, clean it up and structure it.
If no content is provided, provide the standard UNISA IPT Portfolio reflective prompts:
1. What was the focus of today's lesson?
2. What went well?
3. What challenges arose (learner behavior, timing, resources)?
4. How did you handle those challenges?
5. What will you do differently next time?
6. How does this connect to teaching theory?

FORMAT: Professional, structured, and ready for a portfolio.`,n=a?`Turn this transcript/note into a professional IPT Portfolio reflection: 

${a}`:"Please provide the standard IPT Portfolio reflective prompts to help me write my reflection.";return g(n,t)}async function de(a){const t=`You are an academic writing coach specialized in UNISA Harvard referencing and professional academic tone.
STRICT RULES for UNISA Harvard:
- In-text: (Author Year:Page) e.g., (Smith 2023:45).
- Reference List: Author, Initials. Year. Title in italics. Place: Publisher.
- Tone: No contractions (don't -> do not), no first person (I think -> It is argued), formal and objective.

TASKS:
1. Analyze the text for tone and suggest improvements.
2. Check any citations against UNISA Harvard style.
3. Provide a 'Corrected Version' of the text.`,n=`Analyze and improve the following text for my assignment:

${a}`;return g(n,t)}async function ue(a){const t=`You are a creative classroom activity generator.
Your goal is to provide 5 HIGHLY ENGAGING, out-of-the-box activities for a given topic.
For each activity, include:
- Name of Activity
- Brief Description
- Materials Needed
- Why it works (Pedagogical value)`,n=`Generate 5 creative classroom activities for the topic: ${a}`;return g(n,t)}async function bt({subject:a,topic:t,difficulty:n,count:o=5}){const s="You are a quiz master. Create a multiple-choice quiz. Return ONLY valid JSON array.",r=`Create a ${o} question quiz on ${a}: ${t} at ${n} level.
  Return ONLY a JSON array: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "index of correct option (0-3)", "explanation": "..."}]`,i=await g(r,s);try{const l=i.match(/\[[\s\S]*\]/);return JSON.parse(l?l[0]:i)}catch{return[]}}async function vt(a){const t="You are an expert at summarizing long educational content into structured, concise notes.",n=`Please summarize the following content into a structured format with:
  1. Executive Summary
  2. Key Concepts (Bullet points)
  3. Simplified Explanation (For complex parts)
  4. 3 Revision Questions
  
  Content:
${a.slice(0,15e3)}`;return g(n,t)}async function xt(a){const t="You are a specialist in explaining complex concepts using the Feynman Technique (simply and clearly).",n=`Provide a "Deep Dive" into the concept: "${a}".
  Use analogies, clear examples, and avoid overly technical jargon where possible. Explain it like I'm 12.`;return g(n,t)}async function St(a){const t="You are an academic organizer. Extract metadata from the provided content.",n=`Analyze this document content and return ONLY a JSON object:
  {
    "subject": "e.g. Mathematics",
    "moduleCode": "e.g. MAT1511",
    "topics": ["topic1", "topic2"],
    "isAssignment": true/false,
    "dueDate": "YYYY-MM-DD (if found)",
    "summary": "Short 1-sentence summary"
  }
  
  Content:
${a.slice(0,1e4)}`,o=await g(n,t);try{const s=o.match(/\{[\s\S]*\}/);return JSON.parse(s?s[0]:o)}catch{return null}}async function _t(a){const t=`You are a Career & Study Opportunity Scout for South African students and teachers. 
  CURRENT DATE: May 2026. 
  Provide the latest real-world 2026/2027 opportunities based on your knowledge. 
  Include: Title, Source, Deadline (if known), and a direct Official Link.
  Format as a JSON array of objects.`,n=`Find the latest ${a} in South Africa for the 2026/2027 cycle. Return ONLY JSON array.`,o=await g(n,t);try{const s=o.match(/\[[\s\S]*\]/);return JSON.parse(s?s[0]:o)}catch{return[]}}async function jt({studentName:a,grade:t,subject:n,issue:o,context:s}){const r=`You are an expert Educational Psychologist and Master Teacher. 
  Create a tailored Learner Intervention Strategy for:
  Student: ${a}
  Grade: ${t}
  Subject: ${n}
  Primary Issue: ${o}
  Additional Context: ${s}

  Provide:
  1. Root cause analysis (potential reasons).
  2. Immediate classroom strategies (for the teacher).
  3. Home support suggestions (for parents).
  4. SMART goals for improvement.
  5. Recommended resources or tools.

  Format the output in professional Markdown.`;return g(r)}async function At(a){const t=`You are a professional CV writer and career coach. 
  Create a modern, impact-driven resume that is ATS-friendly.
  If mode is 'extract', return ONLY a JSON object of the details found.
  Otherwise, return a beautiful Markdown-formatted Resume.`;if(a.mode==="extract"){const o=`Extract info from this text into JSON (name, email, phone, linkedIn, education, experience, skills): 

${a.scanContent}`,s=await g(o,t),r=s.match(/\{[\s\S]*\}/);return r?r[0]:s}if(a.mode==="bio"){const o=`Create a professional LinkedIn Headline, 'About' section, and a short Professional Bio for:
    Name: ${a.name}
    Role: ${a.targetRole}
    Experience: ${a.experience}
    Skills: ${a.skills}
    
    Format for maximum impact and keywords.`;return g(o,t)}const n=`Create a professional resume for:
  Name: ${a.name}
  Contact: ${a.email}, ${a.phone}, ${a.linkedIn}
  Target Role: ${a.targetRole}
  Experience: ${a.experience}
  Education: ${a.education}
  Skills: ${a.skills}
  ${a.additionalInfo?`Additional Info: ${a.additionalInfo}`:""}
  
  Structure it with clear headings, bullet points, and a summary section.`;return g(n,t)}async function wt(a,t){const n=`You are an expert Math Tutor. Solve the problem step-by-step. 
  Explain the logic behind each step clearly. 
  Use LaTeX formatting for all mathematical expressions (e.g. $x^2 + y^2 = r^2$).
  Tailor the explanation for Grade ${t}.`,o=`Solve and explain this math problem: ${a}`;try{return await g(o,n)}catch{return re(a,t)}}async function Nt(a,t){const n=`You are a creative Math Teacher. Create an interactive-style tutorial for Grade ${t}.
  Include: 
  1. A 'Catchy' Introduction
  2. Key Concepts
  3. 3 Practice Examples with solutions
  4. A 'Pro-Tip' for mastering this topic.
  Use LaTeX for formulas.`,o=`Create a tutorial for Grade ${t} on the topic: ${a}`;try{return await g(o,n)}catch{return ie(a,t)}}async function kt(a,t){const n=`You are a Virtual Science Lab assistant. 
  When given two elements or substances, predict their chemical reaction.
  If they react, provide: 1. Title of reaction, 2. Short description, 3. Visual effect (explosion, bubbles, color_change, or none).
  If they don't react, say 'No significant reaction'.
  Keep it educational and safe.`,o=`What happens when you mix ${a} and ${t}?`;try{return await g(o,n)}catch{const s=[a,t].map(i=>String(i).toLowerCase()).sort().join("+");return{"hydrogen+oxygen":`Hydrogen Combustion
Hydrogen and oxygen can react to form water. Visual effect: none`,"sodium+chlorine":`Salt Formation
Sodium reacts strongly with chlorine to form sodium chloride. Visual effect: explosion`,"iron+oxygen":`Oxidation
Iron slowly reacts with oxygen to form rust over time. Visual effect: color_change`}[s]||`No significant reaction
No curated offline reaction for ${a} and ${t}.`}}async function Tt(a){const t=`You are a Reading Specialist. Create a Phonics lesson for Level ${a}.
  Include: 1. A core sound/phoneme, 2. A list of 5 simple words with that sound, 3. A short practice sentence.`,n=`Generate a level ${a} phonics lesson.`;return g(n,t)}async function Et(a,t){const n=`You are a Children's Book Author. Write a very short, engaging story (100 words max) for Reading Level ${t}.
  Focus on the topic: ${a}. Use simple language.`,o=`Write a level ${t} story about ${a}.`;return g(o,n)}async function Pt(a){const t="You are a professional career coach writing persuasive, tailored cover letters.",n=`Write a cover letter for:
  Name: ${a.name}
  Target Role: ${a.targetRole}
  Target Company/School: ${a.targetCompany}
  Key Experience: ${a.experience}
  Key Skills: ${a.skills}
  
  Make it professional, enthusiastic, and focused on how the candidate can add value to ${a.targetCompany}.`;return g(n,t)}async function It(a,t){const n="You are a curriculum developer for the South African CAPS syllabus. \n  Generate 10 interactive lesson items for the specified lab type and grade.\n  Output MUST be a raw JSON array of objects. No markdown formatting, no ```json wrappers. Just the raw array starting with [ and ending with ].";let o="";a==="history_timeline"?o=`Generate a JSON array of 10 historical events for Grade ${t} CAPS History. Format: [{"id": "1", "year": 1918, "event": "Event description"}]. Make sure the events are chronologically distinct and randomly ordered in the output so the student has to sort them.`:a==="english_vocab"?o=`Generate a JSON array of 10 vocabulary words for Grade ${t} CAPS English. Format: [{"word": "Ephemeral", "meaning": "Lasting for a very short time", "options": ["Permanent", "Lasting for a very short time", "Very large", "Extremely loud"]}]. Include one correct meaning and 3 plausible but incorrect options.`:a==="natural_science"?o=`Generate a JSON array of 10 multiple choice questions for Grade ${t} CAPS Natural Sciences. Format: [{"q": "Question text", "a": "Correct Answer", "options": ["Correct Answer", "Wrong 1", "Wrong 2"]}].`:o=`Generate a JSON array of 10 items for ${a} for Grade ${t}.`;let s="";try{s=await g(o,n)}catch{return a==="history_timeline"?[{id:"1",year:1910,event:"Union of South Africa is established."},{id:"2",year:1948,event:"Apartheid policy becomes official."},{id:"3",year:1960,event:"Sharpeville protest and international response."},{id:"4",year:1976,event:"Soweto student uprising."},{id:"5",year:1990,event:"Nelson Mandela is released from prison."},{id:"6",year:1994,event:"First democratic elections in South Africa."}].sort(()=>Math.random()-.5):a==="english_vocab"?[{word:"Analyze",meaning:"To examine in detail",options:["To examine in detail","To run fast","To cook food","To sing loudly"]},{word:"Interpret",meaning:"To explain the meaning of something",options:["To build a wall","To explain the meaning of something","To erase text","To measure distance"]},{word:"Evidence",meaning:"Facts that support a claim",options:["A random guess","Facts that support a claim","A weather forecast","A drawing style"]},{word:"Compare",meaning:"To identify similarities and differences",options:["To identify similarities and differences","To hide details","To sell products","To sleep deeply"]}]:a==="natural_science"?[{q:"What process do plants use to make food?",a:"Photosynthesis",options:["Photosynthesis","Condensation","Erosion","Filtration"]},{q:"Which state of matter has a fixed volume but no fixed shape?",a:"Liquid",options:["Liquid","Gas","Plasma","Sound"]},{q:"What force pulls objects toward Earth?",a:"Gravity",options:["Gravity","Magnetism","Friction","Evaporation"]}]:[]}try{const r=oe(s,[]);return Array.isArray(r)?r:[]}catch(r){return console.error("Failed to parse AI lab content:",r,s),[]}}function pe(){const{aiPanelOpen:a,setAiPanelOpen:t,aiMessages:n,setAiMessages:o,aiLoading:s,setAiLoading:r,askAI:i}=N(),[l,c]=f.useState(""),y=f.useRef(null);f.useEffect(()=>{var u;(u=y.current)==null||u.scrollIntoView({behavior:"smooth"})},[n]),f.useEffect(()=>{const u=n[n.length-1];(u==null?void 0:u.role)==="user"&&!s&&b(u.content)},[n]);const b=async u=>{r(!0);try{let d;if(u.startsWith("/reflect")){const v=u.replace("/reflect","").trim();d=await le(v)}else if(u.startsWith("/check")){const v=u.replace("/check","").trim();v?d=await de(v):d="Please provide the text you want me to check for academic tone and Harvard referencing. Example: `/check [your text here]`"}else if(u.startsWith("/idea")){const v=u.replace("/idea","").trim();v?d=await ue(v):d="Please provide a topic for classroom ideas. Example: `/idea Photosynthesis`"}else d=await ce(n);o(v=>[...v,{role:"assistant",content:d}])}catch(d){console.error(d),o(v=>[...v,{role:"assistant",content:"❌ Error connecting to AI. Check your API key in Settings."}])}finally{r(!1)}},S=async()=>{!l.trim()||s||(i(l.trim()),c(""))},x=[{label:"📝 Portfolio Reflection",cmd:"/reflect "},{label:"🎓 Harvard Check",cmd:"/check "},{label:"💡 Activity Ideas",cmd:"/idea "},{label:"📧 Parent Email",cmd:"Write a parent communication email about "}];return a?e.jsxs("div",{className:"ai-panel",children:[e.jsxs("div",{className:"ai-panel-header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:10},children:[e.jsx("span",{style:{fontSize:"1.4rem"},children:"🤖"}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700,fontFamily:"var(--font-display)"},children:"AI Assistant"}),e.jsx("div",{style:{fontSize:"0.75rem",color:"var(--secondary)"},children:"● Powered by Gemini"})]})]}),e.jsx("button",{className:"btn btn-ghost btn-sm",onClick:()=>t(!1),children:"✕"})]}),e.jsxs("div",{className:"ai-messages",children:[n.map((u,d)=>e.jsx("div",{className:`ai-msg ${u.role}`,children:e.jsx("div",{className:"ai-msg-bubble",children:e.jsx("p",{style:{color:"var(--text)",whiteSpace:"pre-wrap",fontSize:"0.87rem",lineHeight:1.6},children:u.content})})},d)),s&&e.jsx("div",{className:"ai-msg assistant",children:e.jsx("div",{className:"ai-msg-bubble",children:e.jsxs("div",{className:"generating-dots",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]})})}),e.jsx("div",{ref:y})]}),n.length===1&&e.jsx("div",{className:"ai-quick-actions",children:x.map((u,d)=>e.jsx("button",{className:"quick-action-btn",onClick:()=>{var v;c(u.cmd),(v=document.querySelector(".ai-input"))==null||v.focus()},children:u.label},d))}),e.jsxs("div",{className:"ai-input-area",children:[e.jsx("textarea",{className:"ai-input",placeholder:"Ask anything about teaching…",value:l,onChange:u=>c(u.target.value),onKeyDown:u=>{u.key==="Enter"&&!u.shiftKey&&(u.preventDefault(),S())},rows:2}),e.jsx("button",{className:"btn btn-primary btn-sm",onClick:S,disabled:s||!l.trim(),children:s?"⏳":"↑ Send"})]})]}):null}const me=p.lazy(()=>h(()=>import("./Dashboard-C33usAYy.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),he=p.lazy(()=>h(()=>import("./LessonGenerator-MGUBqpl4.js"),__vite__mapDeps([7,1,2,3,4,8,5,9,10,6]))),fe=p.lazy(()=>h(()=>import("./AnnualPlan-zUBAGP4f.js"),__vite__mapDeps([11,1,2,3,4,8,5,10,6]))),ge=p.lazy(()=>h(()=>import("./QuestionPaper-ZNAlWR_c.js"),__vite__mapDeps([12,1,2,3,4,8,5,9,10,6]))),ye=p.lazy(()=>h(()=>import("./Timetable-DSDM4TAR.js"),__vite__mapDeps([13,1,2,3,4,5,6]))),be=p.lazy(()=>h(()=>import("./Gradebook-Bir_GVyR.js"),__vite__mapDeps([14,1,2,3,4,8,5,6]))),ve=p.lazy(()=>h(()=>import("./Resources-BxWN08EA.js"),__vite__mapDeps([15,1,2,3,4,5,6]))),xe=p.lazy(()=>h(()=>import("./StudentPortal-PBotKJA1.js"),__vite__mapDeps([16,1,2,3,4,10,5,6]))),Se=p.lazy(()=>h(()=>import("./Todo-cFZFt1Pn.js"),__vite__mapDeps([17,1,2,3,4,5,6]))),_e=p.lazy(()=>h(()=>import("./ParentComm-BB9fNF6C.js"),__vite__mapDeps([18,1,2,5,6]))),je=p.lazy(()=>h(()=>import("./Attendance-Bz3TL5Zz.js"),__vite__mapDeps([19,1,2,3,4,5,6]))),Ae=p.lazy(()=>h(()=>import("./RubricGenerator-BmAWyKzl.js"),__vite__mapDeps([20,1,2,8,5,10,6]))),we=p.lazy(()=>h(()=>import("./ReportCard-Qlyr3ays.js"),__vite__mapDeps([21,1,2,3,4,8,5,10,6]))),Ne=p.lazy(()=>h(()=>import("./Settings-D9kmiDwB.js"),__vite__mapDeps([22,5,2,1,3,4,6]))),ke=p.lazy(()=>h(()=>import("./Professionalism-DEgB6DQh.js"),__vite__mapDeps([23,1,2,3,4,10,5,6]))),Te=p.lazy(()=>h(()=>import("./CareerTools-xlu1ZwzO.js"),__vite__mapDeps([24,1,2,8,5,10,6]))),Ee=p.lazy(()=>h(()=>import("./StudentDashboard-kMt1AOVG.js"),__vite__mapDeps([25,1,2,26,27,28]))),Pe=p.lazy(()=>h(()=>import("./IPTPortfolio-KClpCCzh.js"),__vite__mapDeps([29,1,2,10,5,6]))),Ie=p.lazy(()=>h(()=>import("./AcademicCoach-HmEMBOU3.js"),__vite__mapDeps([30,1,2,10,5,6]))),$e=p.lazy(()=>h(()=>import("./ClassroomIdeas-W3s8GUzr.js"),__vite__mapDeps([31,1,2,10,5,6]))),Re=p.lazy(()=>h(()=>import("./Assignments-E6FYINdv.js"),__vite__mapDeps([32,1,2,5,6]))),Le=p.lazy(()=>h(()=>import("./LearningPath-FE0-j-ts.js"),__vite__mapDeps([33,1,2]))),Oe=p.lazy(()=>h(()=>import("./AutoOrganizer-BwOrOiqy.js"),__vite__mapDeps([34,1,2,35,5,6]))),Ce=p.lazy(()=>h(()=>import("./Achievements-B7E4F057.js"),__vite__mapDeps([36,1,2]))),De=p.lazy(()=>h(()=>import("./OpportunitiesHub-Csyk366C.js"),__vite__mapDeps([37,1,2,5,6]))),Me=p.lazy(()=>h(()=>import("./Institutions-8gVfTFEz.js"),__vite__mapDeps([38,1,2]))),Ge=p.lazy(()=>h(()=>import("./MathsLab-DVzKchjS.js"),__vite__mapDeps([39,1,2,28,10,5,6,40]))),ze=p.lazy(()=>h(()=>import("./ScienceLab-DlKofUyz.js"),__vite__mapDeps([41,1,2,28,42,43,5,6]))),Ve=p.lazy(()=>h(()=>import("./ReadingLab-PnvJdNcP.js"),__vite__mapDeps([44,1,2,10,5,6]))),Fe=p.lazy(()=>h(()=>import("./MathsGames-BMoH4UTk.js"),__vite__mapDeps([45,1,2,43,42,5,6]))),qe=p.lazy(()=>h(()=>import("./GameHub-XfrDioXy.js"),__vite__mapDeps([46,1,2,26,27,28]))),Ue=p.lazy(()=>h(()=>import("./StudyLab-DerwOn2i.js"),__vite__mapDeps([47,1,2,35,10,5,6]))),Ye=p.lazy(()=>h(()=>import("./SocialSciencesHub-DgwsAiD0.js"),__vite__mapDeps([48,1,2,28,43,5,6]))),He=p.lazy(()=>h(()=>import("./EnglishLab-CcrZgExn.js"),__vite__mapDeps([49,1,2,4,28,43,5,6]))),We=p.lazy(()=>h(()=>import("./EMSHub-B1VY4G6d.js"),__vite__mapDeps([50,1,2,43,5,6]))),Je=p.lazy(()=>h(()=>import("./LifeOrientationHub-hAQo9w9T.js"),__vite__mapDeps([51,1,2,43,5,6]))),Be=p.lazy(()=>h(()=>import("./TechnologyLab-FSI-IA-W.js"),__vite__mapDeps([52,1,2,43,5,6]))),Ke=p.lazy(()=>h(()=>import("./HistoryLab-C-jiwNx1.js"),__vite__mapDeps([53,1,2,4,28,43,5,6]))),Qe=p.lazy(()=>h(()=>import("./NaturalSciencesLab-Dgi55GyH.js"),__vite__mapDeps([54,1,2,4,43,42,5,6]))),Xe=p.lazy(()=>h(()=>import("./GamePlayer-CP-hisYf.js"),__vite__mapDeps([55,1,2,26,27,28]))),Ze=p.lazy(()=>h(()=>import("./About-B4--v1De.js"),__vite__mapDeps([56,1,2])));function et(a){return a==="/"?"Dashboard":a.replace(/^\/+/,"").replace(/\/+/g," ").replace(/-/g," ").split(" ").filter(Boolean).map(n=>n[0].toUpperCase()+n.slice(1)).join(" ")}function tt(){const{sidebarCollapsed:a,mobileMenuOpen:t,setMobileMenuOpen:n}=N(),{pathname:o}=q();return f.useEffect(()=>{n(!1)},[o,n]),e.jsxs("div",{className:`app-shell ${t?"mobile-menu-active":""}`,children:[e.jsxs("header",{className:"mobile-header",children:[e.jsx("button",{className:"menu-toggle",onClick:()=>n(!0),children:e.jsx("span",{className:"menu-icon",children:"☰"})}),e.jsx("div",{className:"mobile-logo",children:"🍎 Teacher's Pet"}),e.jsx("div",{style:{width:40}})," "]}),t&&e.jsx("div",{className:"sidebar-backdrop",onClick:()=>n(!1)}),e.jsx(ee,{}),e.jsxs("div",{className:`main-content ${a?"sidebar-collapsed":""}`,style:{paddingBottom:64},children:[e.jsxs("div",{className:"app-topbar",children:[e.jsxs("div",{className:"app-topbar-left",children:[e.jsx("div",{className:"app-topbar-kicker",children:"Teacher Platform"}),e.jsx("div",{className:"app-topbar-title",children:et(o)})]}),e.jsxs("div",{className:"app-topbar-right",children:[e.jsx("span",{className:"badge badge-primary",children:"Professional Suite"}),e.jsx("span",{className:"badge badge-success",children:"Local First"})]})]}),e.jsx(f.Suspense,{fallback:e.jsxs("div",{className:"loading-overlay",style:{height:"100vh"},children:[e.jsx("div",{className:"spinner"}),e.jsx("div",{className:"loading-text",children:"Loading Module..."})]}),children:e.jsxs(U,{children:[e.jsx(m,{path:"/",element:e.jsx(me,{})}),e.jsx(m,{path:"/lessons",element:e.jsx(he,{})}),e.jsx(m,{path:"/annual-plan",element:e.jsx(fe,{})}),e.jsx(m,{path:"/question-paper",element:e.jsx(ge,{})}),e.jsx(m,{path:"/timetable",element:e.jsx(ye,{})}),e.jsx(m,{path:"/gradebook",element:e.jsx(be,{})}),e.jsx(m,{path:"/attendance",element:e.jsx(je,{})}),e.jsx(m,{path:"/rubric",element:e.jsx(Ae,{})}),e.jsx(m,{path:"/report-card",element:e.jsx(we,{})}),e.jsx(m,{path:"/professionalism",element:e.jsx(ke,{})}),e.jsx(m,{path:"/career-tools",element:e.jsx(Te,{})}),e.jsx(m,{path:"/ipt-portfolio",element:e.jsx(Pe,{})}),e.jsx(m,{path:"/academic-coach",element:e.jsx(Ie,{})}),e.jsx(m,{path:"/classroom-ideas",element:e.jsx($e,{})}),e.jsx(m,{path:"/student",element:e.jsx(Ee,{})}),e.jsx(m,{path:"/student-portal",element:e.jsx(xe,{})}),e.jsx(m,{path:"/study-lab",element:e.jsx(Ue,{})}),e.jsx(m,{path:"/assignments",element:e.jsx(Re,{})}),e.jsx(m,{path:"/learning-path",element:e.jsx(Le,{})}),e.jsx(m,{path:"/auto-organizer",element:e.jsx(Oe,{})}),e.jsx(m,{path:"/achievements",element:e.jsx(Ce,{})}),e.jsx(m,{path:"/opportunities",element:e.jsx(De,{})}),e.jsx(m,{path:"/institutions",element:e.jsx(Me,{})}),e.jsx(m,{path:"/maths-lab",element:e.jsx(Ge,{})}),e.jsx(m,{path:"/science-lab",element:e.jsx(ze,{})}),e.jsx(m,{path:"/reading-lab",element:e.jsx(Ve,{})}),e.jsx(m,{path:"/maths-games",element:e.jsx(Fe,{})}),e.jsx(m,{path:"/games",element:e.jsx(qe,{})}),e.jsx(m,{path:"/social-sciences-hub",element:e.jsx(Ye,{})}),e.jsx(m,{path:"/english-lab",element:e.jsx(He,{})}),e.jsx(m,{path:"/ems-hub",element:e.jsx(We,{})}),e.jsx(m,{path:"/life-orientation",element:e.jsx(Je,{})}),e.jsx(m,{path:"/technology-lab",element:e.jsx(Be,{})}),e.jsx(m,{path:"/history-lab",element:e.jsx(Ke,{})}),e.jsx(m,{path:"/natural-sciences-lab",element:e.jsx(Qe,{})}),e.jsx(m,{path:"/game/:gameId",element:e.jsx(Xe,{})}),e.jsx(m,{path:"/resources",element:e.jsx(ve,{})}),e.jsx(m,{path:"/todo",element:e.jsx(Se,{})}),e.jsx(m,{path:"/parent-comm",element:e.jsx(_e,{})}),e.jsx(m,{path:"/settings",element:e.jsx(Ne,{})}),e.jsx(m,{path:"/about",element:e.jsx(Ze,{})})]})})]}),e.jsx(pe,{}),e.jsx(te,{collapsed:a})]})}function at(){return e.jsx(F,{basename:"/teachers-pet",future:{v7_startTransition:!0,v7_relativeSplatPath:!0},children:e.jsx(H,{children:e.jsx(X,{children:e.jsx(tt,{})})})})}P.createRoot(document.getElementById("root")).render(e.jsx(p.StrictMode,{children:e.jsx(at,{})}));export{bt as A,xt as B,ce as C,It as D,ct as a,lt as b,dt as c,ut as d,pt as e,yt as f,mt as g,ft as h,gt as i,N as j,jt as k,At as l,Pt as m,le as n,de as o,ue as p,St as q,_t as r,ht as s,wt as t,it as u,Nt as v,kt as w,Tt as x,Et as y,vt as z};
