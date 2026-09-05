'use client';
import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,ArrowDown,Menu} from 'lucide-react';
import {Sheet,SheetTrigger,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)};
const chapters:Record<string,string>={Overview:'An integrated vision for recovering critical minerals and rare earth elements.',Technology:'Battery recycling through HHM. Magnet recycling at pilot stage.',Products:'Refined materials for industrial supply chains. Product specifications will follow.',Services:'Research, quality assurance and refining capabilities. Service details are being developed.',About:'GigaMines is a new Mini Mines vertical focused on critical minerals and rare earth elements.'};
export default function Hero(){
 const outer=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const [introHidden,setIntroHidden]=useState(false),[revealed,setRevealed]=useState(false),[open,setOpen]=useState(false),[chapter,setChapter]=useState('Overview'),[reduced,setReduced]=useState(false);
 useEffect(()=>{
  const el=stage.current!,wrap=outer.current!,cv=canvas.current!,ctx=cv.getContext('2d'),media=matchMedia('(prefers-reduced-motion: reduce)');
  let w=0,h=0,frame=0,px=-1000,py=-1000,dots:{x:number,y:number}[]=[];
  const orange=getComputedStyle(el).getPropertyValue('--orange').trim();
  function request(){if(!frame)frame=requestAnimationFrame(draw)}
  function resize(){w=el.clientWidth;h=el.clientHeight;const d=Math.min(devicePixelRatio||1,1.5);cv.width=w*d;cv.height=h*d;ctx?.setTransform(d,0,0,d,0,0);dots=[];for(let y=8;y<h;y+=24)for(let x=8;x<w;x+=24)dots.push({x,y});request()}
  function draw(){frame=0;const p=media.matches?0:clamp(-wrap.getBoundingClientRect().top/Math.max(1,wrap.offsetHeight-h));const split=ease((p-.12)/.65),reveal=ease((p-.3)/.54);el.style.setProperty('--split',String(split));el.style.setProperty('--reveal',String(reveal));el.style.setProperty('--intro',String(1-ease(p/.18)));el.style.setProperty('--progress',String(p));el.style.setProperty('--text-alpha',String(1-ease((p-.56)/.19)));setRevealed(media.matches||p>.8);setIntroHidden(!media.matches&&p>.16);if(!ctx)return;ctx.clearRect(0,0,w,h);const collapse=ease((p-.08)/.72);for(const dot of dots){const x=w/2+(dot.x-w/2)*(1-collapse),y=h/2+(dot.y-h/2)*(1-collapse),heat=media.matches?0:Math.max(0,1-Math.hypot(x-px,y-py)/190);ctx.globalAlpha=(.3+heat*.65)*(1-ease((p-.55)/.25));ctx.fillStyle=heat>.08?orange:'#8b8b86';ctx.beginPath();ctx.arc(x,y,.65+heat*.9,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1}
  function move(e:PointerEvent){if(e.pointerType==='touch'||media.matches)return;const r=el.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top;el.style.setProperty('--mx',`${px}px`);el.style.setProperty('--my',`${py}px`);el.style.setProperty('--mouse','1');request()}
  function leave(){px=-1000;py=-1000;el.style.setProperty('--mouse','0');request()}
  function preference(){setReduced(media.matches);resize()}
  preference();const ro=new ResizeObserver(resize);ro.observe(el);addEventListener('scroll',request,{passive:true});el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);media.addEventListener('change',preference);
  return()=>{cancelAnimationFrame(frame);ro.disconnect();removeEventListener('scroll',request);el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);media.removeEventListener('change',preference)};
 },[]);
 function explore(){setOpen(false);if(reduced){document.getElementById('complex')?.scrollIntoView();return}const el=outer.current!;scrollTo({top:el.offsetTop+el.offsetHeight-stage.current!.clientHeight,behavior:'smooth'})}
 const brand=<span className="wordmark">GIGA<span>MINES</span><i/></span>;
 return <main><a className="skip" href="#complex" onClick={e=>{e.preventDefault();explore()}}>Skip to the complex</a><section className="hero-scroll" ref={outer}><div className="hero-stage" ref={stage}>
 <div className="pointer-glow" aria-hidden="true"/><canvas ref={canvas} className="dots" aria-hidden="true"/>
 <header className="hero-nav" inert={introHidden}><a href="#" aria-label="GigaMines home">{brand}</a><nav aria-label="Primary navigation">{['Technology','Products','About'].map(label=><button key={label} onClick={()=>{setChapter(label);explore()}}>{label}</button>)}</nav><a className="contact" href="mailto:info@m-mines.com">Partner with us <ArrowUpRight size={16}/></a><button className="mobile-menu" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu/></button></header>
 <div className="orbit" aria-hidden="true"><div/></div><div className="eyebrow">A MINI MINES VERTICAL <i/> CRITICAL MINERALS & RARE EARTHS</div>
 <h1 className="hero-title"><span className="upper">CRITICAL MINERALS.</span><span className="lower">RENEWED POTENTIAL.</span></h1>
 <div className="description" inert={introHidden}><p>An integrated refining vision for critical minerals and rare earth elements. Designed to recover value from batteries, minerals and industrial materials.</p><button onClick={explore}>Explore the complex <ArrowUpRight size={18}/></button></div>
 <div className="hero-bottom" inert={introHidden}><span>RECYCLE <i/> RECOVER <i/> REFINE</span><button onClick={explore}>SCROLL TO DISCOVER <ArrowDown size={16}/></button><span className="location">BUILT ON POSSIBILITY. ROOTED IN INDIA.</span></div>
 <section id="complex" className="scene" aria-label="Future GigaMines complex experience" inert={!revealed}><div className="scene-top"><a href="#">{brand}</a><span>THE NEXT LIFE OF CRITICAL MINERALS</span></div><div className="scene-copy"><span className="scene-index">01 / THE GIGA COMPLEX</span><h2>Inside<br/><em>GigaMines.</em></h2><p>{chapters[chapter]}</p><div className="model-status"><i/>Interactive complex · Coming next</div></div><div className="scene-bottom"><span>RECYCLE / RECOVER / REFINE</span><p>The complex model will be introduced here.</p><button onClick={()=>setOpen(true)}>Explore sections <ArrowUpRight size={18}/></button></div></section>
 <Sheet open={open} onOpenChange={setOpen}><div className={`context-menu ${revealed?'visible':''}`} inert={!revealed}><SheetTrigger className="menu-capsule" aria-label="Open exploration menu"><span className="number">01</span><span>The Giga Complex</span><span className="menu-circle"><Menu size={18}/></span></SheetTrigger></div><SheetContent className="explore-sheet"><SheetTitle className="sheet-title">Explore GigaMines<span>.</span></SheetTitle><SheetDescription>Critical minerals. Renewed potential.</SheetDescription><nav className="chapter-links" aria-label="Exploration"><button onClick={()=>{setOpen(false);scrollTo({top:0,behavior:reduced?'instant':'smooth'})}}>Home <ArrowUpRight/></button>{Object.keys(chapters).map((label,index)=><button key={label} aria-current={label===chapter?'true':undefined} onClick={()=>{setChapter(label);explore()}}><span><small>0{index+1}</small>{label}</span><ArrowUpRight/></button>)}</nav><a className="partner-link" href="mailto:info@m-mines.com">Partner with us <ArrowUpRight size={18}/></a><p className="sheet-note">A Mini Mines vertical</p></SheetContent></Sheet>
 <div className="progress" aria-hidden="true"><span/></div></div></section></main>
}

