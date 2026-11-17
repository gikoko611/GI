import * as THREE from 'three';
import { CONFIG, SCENES } from './scenes.js';

const app = document.getElementById('app');
const subtitleEl = document.getElementById('subtitle');
const watermarkEl = document.getElementById('watermark');
const sceneLabelEl = document.getElementById('scene-label');
const titleMmEl = document.getElementById('title-mm');
const titleEnEl = document.getElementById('title-en');

watermarkEl.textContent = CONFIG.watermark;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(CONFIG.width, CONFIG.height, false);
renderer.setPixelRatio(1);
app.insertBefore(renderer.domElement, document.getElementById('overlay'));

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, CONFIG.width / CONFIG.height, 0.1, 100);
camera.position.set(0, 1.5, 6);

const ambient = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 1.1);
dir.position.set(3, 5, 4);
scene.add(dir);

const root = new THREE.Group();
scene.add(root);

let currentObjects = [];
let currentSceneIndex = -1;

function clearRoot() {
  currentObjects.forEach((o) => {
    root.remove(o);
    o.traverse?.((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) {
        if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose());
        else c.material.dispose();
      }
    });
  });
  currentObjects = [];
}

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp01(t) { return Math.max(0, Math.min(1, t)); }
function easeInOut(t) { t = clamp01(t); return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2) / 2; }

function hexToColor(hex) { return new THREE.Color(hex); }

function makeMat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.15, ...opts });
}

function addGround(color) {
  const geo = new THREE.CircleGeometry(6, 64);
  const mat = makeMat(color, { roughness: 0.9 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = -1.6;
  root.add(mesh);
  currentObjects.push(mesh);
  return mesh;
}

function buildSceneVisual(def) {
  clearRoot();
  const { type, colors = ['#222', '#888', '#fff'], objects = [] } = def.visual || {};
  const c0 = colors[0] || '#111';
  const c1 = colors[1] || '#666';
  const c2 = colors[2] || '#fff';
  scene.background = hexToColor(c0);
  scene.fog = new THREE.Fog(c0, 7, 14);

  // base ground for most scenes
  if (type !== 'dream' && type !== 'clock' && type !== 'simple' && type !== 'hope') {
    addGround(new THREE.Color(c1).multiplyScalar(0.35));
  }

  const add = (obj) => { root.add(obj); currentObjects.push(obj); return obj; };

  switch (type) {
    case 'sunrise': {
      const sun = add(new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 32), new THREE.MeshBasicMaterial({ color: c2 })));
      sun.position.set(0, -0.5, -2);
      sun.name = 'sun';
      for (let i = 0; i < 3; i++) {
        const hill = add(new THREE.Mesh(new THREE.SphereGeometry(2.2 + i, 32, 32), makeMat(i === 1 ? c1 : '#2e5339')));
        hill.scale.set(1.6, 0.5, 1);
        hill.position.set((i - 1) * 1.8, -1.6 - i * 0.1, -1 - i * 0.8);
      }
      break;
    }
    case 'growth': {
      add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), makeMat('#6d4c41')));
      const stem = add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 16), makeMat(c1)));
      stem.position.y = -0.6; stem.name = 'stem';
      const leaf1 = add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 20), makeMat(c2)));
      leaf1.scale.set(1.4, 0.5, 0.8); leaf1.position.set(0.35, 0.1, 0); leaf1.name = 'leaf1';
      const leaf2 = add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 20), makeMat(c1)));
      leaf2.scale.set(1.3, 0.45, 0.8); leaf2.position.set(-0.3, -0.1, 0.1); leaf2.name = 'leaf2';
      break;
    }
    case 'knowledge': {
      const book = add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 1.3), makeMat(c1)));
      book.position.y = -0.8; book.rotation.x = 0.1; book.name = 'book';
      const pageL = add(new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.05, 1.15), makeMat('#fffdf2')));
      pageL.position.set(-0.45, -0.65, 0);
      const pageR = add(new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.05, 1.15), makeMat('#fffdf2')));
      pageR.position.set(0.45, -0.65, 0);
      const bulb = add(new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), new THREE.MeshStandardMaterial({ color: c2, emissive: c2, emissiveIntensity: 0.6 })));
      bulb.position.set(0, 0.9, 0); bulb.name = 'bulb';
      for (let i=0;i<20;i++){ const s=add(new THREE.Mesh(new THREE.SphereGeometry(0.04,8,8), new THREE.MeshBasicMaterial({color:'#fff'}))); s.position.set((Math.random()-0.5)*5, Math.random()*3-0.5, -2-Math.random()*3); s.name='star'; }
      break;
    }
    case 'together': {
      const mats = [makeMat(c1), makeMat(c2), makeMat('#ff8a65')];
      [-0.7, 0, 0.7].forEach((x,i)=>{ const body=add(new THREE.Mesh(new THREE.CapsuleGeometry(0.22,0.7,4,8), mats[i])); body.position.set(x,-0.8,0); const head=add(new THREE.Mesh(new THREE.SphereGeometry(0.2,16,16), mats[i])); head.position.set(x,-0.2,0); body.name='figure'; });
      const heart = add(new THREE.Mesh(new THREE.SphereGeometry(0.28,20,20), new THREE.MeshStandardMaterial({color:'#ff5c8a', emissive:'#ff2d55', emissiveIntensity:0.4})));
      heart.position.set(0,0.7,0); heart.name='heart';
      break;
    }
    case 'kindness': {
      const l = add(new THREE.Mesh(new THREE.SphereGeometry(0.35,24,24), makeMat(c1))); l.position.set(-0.6,-0.4,0);
      const r = add(new THREE.Mesh(new THREE.SphereGeometry(0.35,24,24), makeMat(c2))); r.position.set(0.6,-0.4,0);
      const glow = add(new THREE.Mesh(new THREE.SphereGeometry(0.5,24,24), new THREE.MeshBasicMaterial({color:'#fff59d', transparent:true, opacity:0.6}))); glow.position.set(0,0.2,0); glow.name='glow';
      for(let i=0;i<24;i++){ const sp=add(new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8), new THREE.MeshBasicMaterial({color:i%2?'#fff':c2}))); const a=(i/24)*Math.PI*2; sp.position.set(Math.cos(a)*1.6, Math.sin(a)*1.2+0.2, -0.5); sp.name='spark'; }
      break;
    }
    case 'stairs': {
      for(let i=0;i<5;i++){ const step=add(new THREE.Mesh(new THREE.BoxGeometry(1.6-i*0.15,0.18,0.8), makeMat(i%2?c1:c2))); step.position.set(-0.6+i*0.3,-1.4+i*0.45,-0.2*i); step.name='step'; }
      const climber=add(new THREE.Mesh(new THREE.ConeGeometry(0.22,0.7,16), makeMat('#fff176'))); climber.position.set(0.5,0.9,-0.7); climber.name='climber';
      break;
    }
    case 'fall-rise': {
      for(let i=0;i<4;i++){ const b=add(new THREE.Mesh(new THREE.BoxGeometry(0.5,0.5,0.5), makeMat(i<2?c1:c2))); b.position.set((i-1.5)*0.7,-1.1 + (i<2?0:0.6+i*0.1),0); b.rotation.z = i<2?0.8:-0.1*i; b.name=i<2?'fallen':'risen'; }
      const arrow=add(new THREE.Mesh(new THREE.ConeGeometry(0.25,0.8,16), makeMat('#66bb6a'))); arrow.position.set(1.2,0.8,0); arrow.name='arrow';
      break;
    }
    case 'resilience': {
      const trunk=add(new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.28,1.6,12), makeMat('#6d4c41'))); trunk.position.set(0,-0.8,0); trunk.name='trunk';
      const crown=add(new THREE.Mesh(new THREE.SphereGeometry(0.9,24,24), makeMat(c1))); crown.position.set(0,0.5,0); crown.name='crown';
      for(let i=0;i<5;i++){ const rootObj=add(new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.08,0.8,8), makeMat('#5d4037'))); rootObj.position.set((i-2)*0.25,-1.5,0.2); rootObj.rotation.z=(i-2)*0.35; }
      break;
    }
    case 'time': {
      const ring=add(new THREE.Mesh(new THREE.TorusGeometry(1.1,0.08,16,64), makeMat(c1))); ring.rotation.x=Math.PI/2; ring.position.y=-0.2; ring.name='ring';
      const glass1=add(new THREE.Mesh(new THREE.ConeGeometry(0.5,0.9,24), new THREE.MeshPhysicalMaterial({color:c2, transparent:true, opacity:0.45}))); glass1.position.y=0.5;
      const glass2=add(new THREE.Mesh(new THREE.ConeGeometry(0.5,0.9,24), new THREE.MeshPhysicalMaterial({color:c2, transparent:true, opacity:0.45}))); glass2.position.y=-0.9; glass2.rotation.x=Math.PI;
      for(let i=0;i<30;i++){ const p=add(new THREE.Mesh(new THREE.SphereGeometry(0.03,8,8), new THREE.MeshBasicMaterial({color:'#fff'}))); p.position.set((Math.random()-0.5)*0.3, -0.2+Math.random()*0.3, (Math.random()-0.5)*0.3); p.name='sand'; }
      break;
    }
    case 'gratitude': {
      const base=add(new THREE.Mesh(new THREE.CylinderGeometry(0.1,0.2,0.8,16), makeMat('#558b2f'))); base.position.y=-1.1;
      for(let i=0;i<6;i++){ const petal=add(new THREE.Mesh(new THREE.SphereGeometry(0.35,20,20), makeMat(i%2?c1:c2))); const a=(i/6)*Math.PI*2; petal.scale.set(0.7,0.35,1); petal.position.set(Math.cos(a)*0.35,-0.5,Math.sin(a)*0.35); petal.rotation.z=a; petal.name='petal'; }
      const core=add(new THREE.Mesh(new THREE.SphereGeometry(0.22,20,20), new THREE.MeshStandardMaterial({color:'#fff176', emissive:'#ffca28', emissiveIntensity:0.5}))); core.position.y=-0.45; core.name='core';
      break;
    }
    case 'balance-body': {
      const body=add(new THREE.Mesh(new THREE.TorusGeometry(0.8,0.12,16,64), makeMat(c1))); body.position.y=0; body.name='pulse';
      const inner=add(new THREE.Mesh(new THREE.SphereGeometry(0.35,24,24), new THREE.MeshStandardMaterial({color:c2, emissive:c2, emissiveIntensity:0.3}))); inner.position.y=0;
      const leaf=add(new THREE.Mesh(new THREE.SphereGeometry(0.4,20,20), makeMat('#81c784'))); leaf.scale.set(1.3,0.4,0.8); leaf.position.set(0,-1.1,0);
      break;
    }
    case 'friendship': {
      [-0.6,0.6].forEach((x,i)=>{ const f=add(new THREE.Mesh(new THREE.CapsuleGeometry(0.22,0.75,4,8), makeMat(i?c1:c2))); f.position.set(x,-0.8,0); const h=add(new THREE.Mesh(new THREE.SphereGeometry(0.19,16,16), makeMat(i?c1:c2))); h.position.set(x,-0.2,0); });
      const bridge=add(new THREE.Mesh(new THREE.BoxGeometry(2.2,0.08,0.5), makeMat('#fff176'))); bridge.position.set(0,-1.25,0); bridge.name='bridge';
      break;
    }
    case 'clarity': {
      const crystal=add(new THREE.Mesh(new THREE.OctahedronGeometry(0.9,0), new THREE.MeshPhysicalMaterial({color:c1, transparent:true, opacity:0.75, roughness:0.05, metalness:0.1}))); crystal.position.y=0; crystal.name='crystal';
      for(let i=0;i<8;i++){ const ray=add(new THREE.Mesh(new THREE.BoxGeometry(0.03,1.8,0.03), new THREE.MeshBasicMaterial({color:c2, transparent:true, opacity:0.5}))); const a=(i/8)*Math.PI*2; ray.position.set(Math.cos(a)*1.4,0,Math.sin(a)*0.4); ray.rotation.z=-a; ray.name='ray'; }
      break;
    }
    case 'courage': {
      for(let i=0;i<3;i++){ const m=add(new THREE.Mesh(new THREE.ConeGeometry(1.4-i*0.35,1.4-i*0.2,4), makeMat(i===1?c1:'#5d4037'))); m.position.set(0,-1.1+i*0.25,-i*0.3); }
      const flame=add(new THREE.Mesh(new THREE.ConeGeometry(0.28,0.8,16), new THREE.MeshStandardMaterial({color:c2, emissive:'#ff6d00', emissiveIntensity:0.7}))); flame.position.set(0,0.6,0.2); flame.name='flame';
      break;
    }
    case 'clock': {
      scene.background = hexToColor(c0);
      const ring=add(new THREE.Mesh(new THREE.TorusGeometry(1.2,0.09,16,80), makeMat(c1))); ring.name='ring';
      const core=add(new THREE.Mesh(new THREE.SphereGeometry(0.18,20,20), new THREE.MeshStandardMaterial({color:c2, emissive:c2, emissiveIntensity:0.5})));
      const hand=add(new THREE.Mesh(new THREE.BoxGeometry(0.06,0.8,0.06), makeMat('#fff'))); hand.position.y=0.4; hand.name='hand';
      const pivot=add(new THREE.Group()); pivot.add(hand); root.add(pivot); currentObjects.push(pivot); pivot.name='pivot';
      for(let i=0;i<12;i++){ const dot=add(new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8), new THREE.MeshBasicMaterial({color:'#fff'}))); const a=(i/12)*Math.PI*2; dot.position.set(Math.cos(a)*1.2,Math.sin(a)*1.2,0); }
      break;
    }
    case 'balance': {
      const beam=add(new THREE.Mesh(new THREE.BoxGeometry(2.4,0.08,0.2), makeMat(c1))); beam.position.y=0.2; beam.name='beam';
      const stand=add(new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.2,1.4,12), makeMat('#90a4ae'))); stand.position.y=-0.6;
      [-1.0,1.0].forEach((x,i)=>{ const orb=add(new THREE.Mesh(new THREE.SphereGeometry(0.32,20,20), makeMat(i?c1:c2))); orb.position.set(x,-0.4,0); orb.name='orb'; });
      break;
    }
    case 'dream': {
      scene.background = hexToColor(c0);
      for(let i=0;i<40;i++){ const s=add(new THREE.Mesh(new THREE.SphereGeometry(0.03+Math.random()*0.04,8,8), new THREE.MeshBasicMaterial({color:i%3===0?c2:'#fff'}))); s.position.set((Math.random()-0.5)*6,(Math.random()-0.5)*8,-2-Math.random()*4); s.name='star'; }
      const path=add(new THREE.Mesh(new THREE.TorusGeometry(1.3,0.05,12,80,Math.PI*1.2), makeMat(c2))); path.rotation.set(1.2,0.2,0.4); path.position.set(0,-0.2,-0.5); path.name='path';
      const orb=add(new THREE.Mesh(new THREE.SphereGeometry(0.35,24,24), new THREE.MeshStandardMaterial({color:c2, emissive:c2, emissiveIntensity:0.8}))); orb.position.set(0.2,0.8,0.2); orb.name='dreamOrb';
      break;
    }
    case 'community': {
      for(let i=0;i<8;i++){ const n=add(new THREE.Mesh(new THREE.SphereGeometry(0.18,16,16), makeMat(i%2?c1:c2))); const a=(i/8)*Math.PI*2; n.position.set(Math.cos(a)*1.3,Math.sin(a)*0.9-0.2,Math.sin(a)*0.3); n.name='node';
        const bar=add(new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,1.3,6), new THREE.MeshBasicMaterial({color:'#ffffff', transparent:true, opacity:0.35}))); bar.position.set(Math.cos(a)*0.65,Math.sin(a)*0.45-0.2,Math.sin(a)*0.15); bar.rotation.z=-a+Math.PI/2; bar.name='link'; }
      break;
    }
    case 'nature': {
      [-1.1,0,1.1].forEach((x,i)=>{ const trunk=add(new THREE.Mesh(new THREE.CylinderGeometry(0.08,0.12,0.9,8), makeMat('#6d4c41'))); trunk.position.set(x,-1.1, -i*0.2); const crown=add(new THREE.Mesh(new THREE.SphereGeometry(0.45+i*0.05,16,16), makeMat(c1))); crown.position.set(x,-0.45,-i*0.2); crown.name='tree'; });
      const globe=add(new THREE.Mesh(new THREE.SphereGeometry(0.45,24,24), makeMat(c2))); globe.position.set(0,0.7,0.2); globe.name='globe';
      break;
    }
    case 'release': {
      for(let i=0;i<18;i++){ const f=add(new THREE.Mesh(new THREE.SphereGeometry(0.07+Math.random()*0.06,12,12), makeMat(i%2?c1:c2))); f.position.set((Math.random()-0.5)*2.2,-1.2+Math.random()*1.2,(Math.random()-0.5)*1.5); f.name='float'; }
      const light=add(new THREE.Mesh(new THREE.SphereGeometry(0.5,24,24), new THREE.MeshBasicMaterial({color:'#fff', transparent:true, opacity:0.35}))); light.position.set(0,0.8,0); light.name='releaseLight';
      break;
    }
    case 'calm': {
      for(let i=0;i<5;i++){ const r=add(new THREE.Mesh(new THREE.TorusGeometry(0.4+i*0.35,0.03,12,64), new THREE.MeshBasicMaterial({color:c1, transparent:true, opacity:0.7-i*0.1}))); r.rotation.x=Math.PI/2; r.position.y=-0.8; r.name='ripple'; }
      const dot=add(new THREE.Mesh(new THREE.SphereGeometry(0.18,20,20), new THREE.MeshStandardMaterial({color:c2, emissive:c2, emissiveIntensity:0.4}))); dot.position.y=0.5; dot.name='calmDot';
      break;
    }
    case 'transform': {
      const a=add(new THREE.Mesh(new THREE.BoxGeometry(0.8,0.8,0.8), makeMat(c1))); a.position.set(-0.7,-0.2,0); a.name='morphA';
      const b=add(new THREE.Mesh(new THREE.OctahedronGeometry(0.55,0), makeMat(c2))); b.position.set(0.7,-0.2,0); b.name='morphB';
      const ring=add(new THREE.Mesh(new THREE.TorusGeometry(1.4,0.04,12,80), new THREE.MeshBasicMaterial({color:'#ffd54f', transparent:true, opacity:0.6}))); ring.rotation.y=Math.PI/3; ring.name='cycle';
      break;
    }
    case 'hope': {
      scene.background = hexToColor(c0);
      const lantern=add(new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.35,0.7,16), makeMat(c1))); lantern.position.y=-0.2; lantern.name='lantern';
      const glow=add(new THREE.Mesh(new THREE.SphereGeometry(0.22,20,20), new THREE.MeshBasicMaterial({color:c2}))); glow.position.y=-0.15; glow.name='lanternGlow';
      for(let i=0;i<25;i++){ const s=add(new THREE.Mesh(new THREE.SphereGeometry(0.03,8,8), new THREE.MeshBasicMaterial({color:'#fff8b0'}))); s.position.set((Math.random()-0.5)*4,Math.random()*4-1,-2-Math.random()*2); s.name='star'; }
      break;
    }
    case 'confidence': {
      const pillar=add(new THREE.Mesh(new THREE.CylinderGeometry(0.35,0.45,1.8,20), makeMat(c1))); pillar.position.y=-0.6; pillar.name='pillar';
      const top=add(new THREE.Mesh(new THREE.SphereGeometry(0.35,20,20), new THREE.MeshStandardMaterial({color:c2, emissive:c2, emissiveIntensity:0.5}))); top.position.y=0.7; top.name='shine';
      for(let i=0;i<10;i++){ const ray=add(new THREE.Mesh(new THREE.BoxGeometry(0.03,1.0,0.03), new THREE.MeshBasicMaterial({color:'#fff59d', transparent:true, opacity:0.5}))); const a=(i/10)*Math.PI*2; ray.position.set(Math.cos(a)*0.9,0.5,Math.sin(a)*0.3); ray.rotation.z=-a; }
      break;
    }
    case 'routine': {
      for(let x=0;x<4;x++) for(let y=0;y<4;y++){ const cell=add(new THREE.Mesh(new THREE.BoxGeometry(0.38,0.38,0.08), makeMat((x+y)%2?c1:c2))); cell.position.set((x-1.5)*0.5,(y-1.5)*0.5-0.2,0); cell.name='cell'; cell.userData={x,y}; }
      const prog=add(new THREE.Mesh(new THREE.BoxGeometry(0.2,1.8,0.2), makeMat('#fff176'))); prog.position.set(1.5,-0.2,0.2); prog.name='progress';
      break;
    }
    case 'connection': {
      [-0.7,0,0.7].forEach((x,i)=>{ const ring=add(new THREE.Mesh(new THREE.TorusGeometry(0.32,0.07,12,40), makeMat(i===1?c2:c1))); ring.position.set(x,-0.1,0); ring.rotation.y= i===1?0:Math.PI/2; ring.name='linkring'; });
      const glow=add(new THREE.Mesh(new THREE.SphereGeometry(0.9,24,24), new THREE.MeshBasicMaterial({color:c2, transparent:true, opacity:0.12}))); glow.name='warm';
      break;
    }
    case 'unity': {
      for(let i=0;i<10;i++){ const a=(i/10)*Math.PI*2; const f=add(new THREE.Mesh(new THREE.CapsuleGeometry(0.12,0.35,4,8), makeMat(i%2?c1:c2))); f.position.set(Math.cos(a)*1.25,Math.sin(a)*1.0-0.2,Math.sin(a)*0.2); f.name='person'; }
      const center=add(new THREE.Mesh(new THREE.SphereGeometry(0.25,20,20), new THREE.MeshStandardMaterial({color:'#fff176', emissive:'#ffca28', emissiveIntensity:0.5}))); center.position.y=-0.2;
      break;
    }
    case 'simple': {
      scene.background = hexToColor(c0);
      add(new THREE.Mesh(new THREE.SphereGeometry(0.55,32,32), makeMat(c1))).position.set(0,0.2,0);
      add(new THREE.Mesh(new THREE.TorusGeometry(0.9,0.04,12,64), makeMat(c2))).rotation.x=Math.PI/2;
      break;
    }
    case 'mirror': {
      const frame=add(new THREE.Mesh(new THREE.BoxGeometry(1.4,1.8,0.1), makeMat(c1))); frame.position.set(-0.5,0,0);
      const glass=add(new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.5), new THREE.MeshPhysicalMaterial({color:c2, transparent:true, opacity:0.35, roughness:0.05, metalness:0.2}))); glass.position.set(-0.5,0,0.06);
      for(let i=0;i<6;i++){ const p=add(new THREE.Mesh(new THREE.SphereGeometry(0.08,12,12), makeMat('#fff'))); p.position.set(0.7, -1.0+i*0.4, -0.2); p.name='pathdot'; }
      break;
    }
    case 'finale': {
      // pagoda-like silhouette
      const base=add(new THREE.Mesh(new THREE.CylinderGeometry(0.9,1.1,0.25,6), makeMat('#5d4037'))); base.position.y=-1.4;
      for(let i=0;i<3;i++){ const tier=add(new THREE.Mesh(new THREE.ConeGeometry(0.75-i*0.18,0.45,6), makeMat(i%2?c1:'#8d6e63'))); tier.position.y=-1.05+i*0.38; tier.rotation.y=Math.PI/6; tier.name='pagoda'; }
      const spire=add(new THREE.Mesh(new THREE.ConeGeometry(0.12,0.5,8), makeMat('#ffd54f'))); spire.position.y=0.55; spire.name='spire';
      const sun=add(new THREE.Mesh(new THREE.SphereGeometry(0.7,24,24), new THREE.MeshBasicMaterial({color:c2}))); sun.position.set(1.3,0.9,-2); sun.name='sunset';
      for(let i=0;i<30;i++){ const sp=add(new THREE.Mesh(new THREE.SphereGeometry(0.04,8,8), new THREE.MeshBasicMaterial({color:i%2?c2:'#fff'}))); sp.position.set((Math.random()-0.5)*4,Math.random()*3, -1-Math.random()*2); sp.name='spark'; }
      break;
    }
    default: {
      add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.9,0), makeMat(c1))).name='default';
      break;
    }
  }
}

function setScene(index) {
  if (index === currentSceneIndex) return;
  currentSceneIndex = index;
  const s = SCENES[index];
  buildSceneVisual(s);
  sceneLabelEl.textContent = `${index + 1} / ${SCENES.length}`;
  if (index === 0) {
    titleMmEl.textContent = CONFIG.title;
    titleEnEl.textContent = CONFIG.titleEn;
  } else {
    titleMmEl.textContent = '';
    titleEnEl.textContent = '';
  }
}

function updateAtTime(timeSec) {
  const total = SCENES.reduce((a, s) => a + s.duration, 0);
  const t = Math.max(0, Math.min(timeSec, total - 0.001));
  let acc = 0, idx = 0;
  for (let i = 0; i < SCENES.length; i++) {
    if (t < acc + SCENES[i].duration) { idx = i; break; }
    acc += SCENES[i].duration;
    idx = i;
  }
  const sceneDef = SCENES[idx];
  const local = t - acc;
  const p = clamp01(local / sceneDef.duration);
  const e = easeInOut(p);

  setScene(idx);
  subtitleEl.textContent = sceneDef.subtitle || '';

  // background subtle shift
  const cols = sceneDef.visual.colors || ['#111', '#555', '#ddd'];
  const bg = hexToColor(cols[0]).lerp(hexToColor(cols[1]).multiplyScalar(0.3), Math.sin(p * Math.PI) * 0.2);
  scene.background = bg;
  if (scene.fog) scene.fog.color = bg;

  // camera gentle motion
  camera.position.x = Math.sin(t * 0.25 + idx) * 0.35;
  camera.position.y = 1.4 + Math.sin(t * 0.4 + idx * 0.7) * 0.15;
  camera.position.z = 5.8 + Math.sin(t * 0.2) * 0.2;
  camera.lookAt(0, -0.1, 0);

  // animate named objects
  root.traverse((o) => {
    const n = o.name || '';
    if (n === 'sun' || n === 'sunset' || n === 'dreamOrb' || n === 'lanternGlow' || n === 'core' || n === 'shine') {
      o.position.y += Math.sin(t * 1.5) * 0.002;
      const s = 1 + Math.sin(t * 2 + idx) * 0.03;
      o.scale.setScalar(s);
    }
    if (n === 'glow' || n === 'warm' || n === 'releaseLight') {
      o.material.opacity = 0.25 + Math.sin(t * 2) * 0.12;
      o.scale.setScalar(1 + Math.sin(t * 1.8) * 0.08);
    }
    if (n === 'spark' || n === 'star' || n === 'float' || n === 'sand') {
      o.position.y += Math.sin(t * 2 + o.position.x * 3) * 0.002;
      o.rotation.y += 0.01;
    }
    if (n === 'petal' || n === 'linkring' || n === 'person' || n === 'node' || n === 'crystal' || n === 'pagoda' || n === 'cycle') {
      o.rotation.y += 0.01;
    }
    if (n === 'leaf1') o.rotation.z = Math.sin(t * 1.2) * 0.15 + 0.4;
    if (n === 'leaf2') o.rotation.z = -Math.sin(t * 1.2) * 0.12 - 0.4;
    if (n === 'bulb' || n === 'heart' || n === 'flame') {
      const s = 1 + Math.sin(t * 3) * 0.06;
      o.scale.setScalar(s);
    }
    if (n === 'climber') { o.position.y = lerp(-0.8, 1.0, e); o.position.x = lerp(-0.9, 0.7, e); }
    if (n === 'arrow') { o.position.y = 0.3 + Math.sin(t * 2) * 0.15; }
    if (n === 'trunk' || n === 'crown') { o.rotation.z = Math.sin(t * 1.3) * 0.04 * (n==='crown'?1.4:1); }
    if (n === 'ring') { o.rotation.z += 0.003; }
    if (n === 'pivot') { o.rotation.z = -t * 0.8; }
    if (n === 'hand') { /* handled by pivot */ }
    if (n === 'beam') { o.rotation.z = Math.sin(t * 1.2) * 0.08; }
    if (n === 'orb') { o.position.y = -0.4 + Math.sin(t * 1.2 + o.position.x) * 0.08; }
    if (n === 'bridge') { o.material.emissive = new THREE.Color('#fff176'); o.material.emissiveIntensity = 0.2 + Math.sin(t*2)*0.1; }
    if (n === 'path') { o.rotation.z += 0.005; }
    if (n === 'globe' || n === 'tree') { o.rotation.y += 0.006; }
    if (n === 'ripple') { const s = 1 + ((t * 0.4 + o.id) % 1) * 0.15; o.scale.set(s,1,s); }
    if (n === 'morphA') { o.rotation.x += 0.02; o.rotation.y += 0.015; o.position.y = -0.2 + Math.sin(t*1.5)*0.1; }
    if (n === 'morphB') { o.rotation.y -= 0.02; o.position.y = -0.2 + Math.cos(t*1.5)*0.1; }
    if (n === 'lantern') { o.position.y = -0.2 + Math.sin(t*1.2)*0.05; }
    if (n === 'pillar') { o.scale.y = 1 + Math.sin(t)*0.02; }
    if (n === 'cell') { const phase = (o.userData.x + o.userData.y) * 0.4; const on = (Math.sin(t*2 - phase) > 0); o.material.emissive = new THREE.Color(on ? '#26a69a' : '#000'); o.material.emissiveIntensity = on ? 0.35 : 0; }
    if (n === 'progress') { o.scale.y = 0.3 + 0.7 * ((Math.sin(t*0.8)+1)/2); o.position.y = -1.1 + 0.9 * ((Math.sin(t*0.8)+1)/2); }
    if (n === 'calmDot') { o.position.y = 0.5 + Math.sin(t)*0.08; }
    if (n === 'spire') { const s=1+Math.sin(t*2.5)*0.04; o.scale.set(s,s,s); }
    if (n === 'pathdot') { o.material.emissive = new THREE.Color('#90caf9'); o.material.emissiveIntensity = 0.2 + 0.5*((Math.sin(t*2 + o.position.y*2)+1)/2); }
  });

  renderer.render(scene, camera);
}

const totalDuration = SCENES.reduce((a, s) => a + s.duration, 0);

let start = performance.now();
let manualTime = null;

function animate(now) {
  if (manualTime === null) {
    const elapsed = (now - start) / 1000;
    const t = Math.min(elapsed, totalDuration - 0.001);
    updateAtTime(t);
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// hooks for headless renderer
window.__TOTAL_DURATION__ = totalDuration;
window.__setTime = (t) => { manualTime = t; updateAtTime(t); };
window.__renderInfo = () => ({ totalDuration, fps: CONFIG.fps, width: CONFIG.width, height: CONFIG.height, scenes: SCENES.length });

// auto-restart in normal viewing after finishing
setInterval(() => {
  if (manualTime !== null) return;
  const elapsed = (performance.now() - start) / 1000;
  if (elapsed >= totalDuration) start = performance.now();
}, 500);
