(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const rad = d => d * Math.PI / 180;

  function color(hex) {
    const value = parseInt(hex.replace('#', ''), 16);
    return [(value >> 16 & 255) / 255, (value >> 8 & 255) / 255, (value & 255) / 255];
  }

  function identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        out[c * 4 + r] =
          a[0 * 4 + r] * b[c * 4 + 0] +
          a[1 * 4 + r] * b[c * 4 + 1] +
          a[2 * 4 + r] * b[c * 4 + 2] +
          a[3 * 4 + r] * b[c * 4 + 3];
      }
    }
    return out;
  }

  function translation(x, y, z) {
    const out = identity(); out[12] = x; out[13] = y; out[14] = z; return out;
  }
  function scaling(x, y, z) {
    const out = identity(); out[0] = x; out[5] = y; out[10] = z; return out;
  }
  function rotationX(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]);
  }
  function rotationY(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]);
  }
  function rotationZ(a) {
    const c = Math.cos(a), s = Math.sin(a);
    return new Float32Array([c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]);
  }
  function compose(...matrices) { return matrices.reduce((a, b) => multiply(a, b), identity()); }

  function perspective(fov, aspect, near, far) {
    const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return new Float32Array([
      f / aspect,0,0,0, 0,f,0,0,
      0,0,(far + near) * nf,-1,
      0,0,2 * far * near * nf,0
    ]);
  }

  function normalize(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
  function dot(a, b) { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }
  function lookAt(eye, center, up) {
    const z = normalize([eye[0]-center[0], eye[1]-center[1], eye[2]-center[2]]);
    const x = normalize(cross(up, z));
    const y = cross(z, x);
    return new Float32Array([
      x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0,
      -dot(x,eye),-dot(y,eye),-dot(z,eye),1
    ]);
  }

  function cubeGeometry() {
    const p = [], n = [];
    const faces = [
      [[1,0,0], [[.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,-.5],[.5,.5,.5],[.5,-.5,.5]]],
      [[-1,0,0], [[-.5,-.5,.5],[-.5,.5,.5],[-.5,.5,-.5],[-.5,-.5,.5],[-.5,.5,-.5],[-.5,-.5,-.5]]],
      [[0,1,0], [[-.5,.5,-.5],[-.5,.5,.5],[.5,.5,.5],[-.5,.5,-.5],[.5,.5,.5],[.5,.5,-.5]]],
      [[0,-1,0], [[-.5,-.5,.5],[-.5,-.5,-.5],[.5,-.5,-.5],[-.5,-.5,.5],[.5,-.5,-.5],[.5,-.5,.5]]],
      [[0,0,1], [[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]]],
      [[0,0,-1], [[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]]]
    ];
    faces.forEach(([normal, verts]) => verts.forEach(v => { p.push(...v); n.push(...normal); }));
    return { positions: new Float32Array(p), normals: new Float32Array(n), count: p.length / 3 };
  }

  function cylinderGeometry(segments = 32) {
    const p = [], n = [];
    for (let i = 0; i < segments; i++) {
      const a = i / segments * TAU, b = (i + 1) / segments * TAU;
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      p.push(ca,sa,-.5, cb,sb,-.5, cb,sb,.5, ca,sa,-.5, cb,sb,.5, ca,sa,.5);
      n.push(ca,sa,0, cb,sb,0, cb,sb,0, ca,sa,0, cb,sb,0, ca,sa,0);
      p.push(0,0,.5, ca,sa,.5, cb,sb,.5, 0,0,-.5, cb,sb,-.5, ca,sa,-.5);
      n.push(0,0,1, 0,0,1, 0,0,1, 0,0,-1, 0,0,-1, 0,0,-1);
    }
    return { positions: new Float32Array(p), normals: new Float32Array(n), count: p.length / 3 };
  }

  class EngineeringModel3D {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.variant = options.variant || 'blueprint';
      this.machine = options.machine || 'hammer';
      this.autoOrbit = options.autoOrbit ?? false;
      this.running = options.running ?? false;
      this.explode = 0;
      this.fault = null;
      this.focus = null;
      this.options = { power: 'water', shaft: 'elm', cams: 3, tolerance: 2 };
      this.yaw = options.yaw ?? -0.55;
      this.pitch = options.pitch ?? 0.28;
      this.distance = options.distance ?? 11.2;
      this.targetYaw = this.yaw;
      this.targetPitch = this.pitch;
      this.dragging = false;
      this.lastPointer = null;
      this.startTime = performance.now();
      this.lastFrame = this.startTime;
      this.gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
      if (!this.gl) { canvas.insertAdjacentHTML('afterend','<p class="webgl-fallback">当前设备无法显示 WebGL 模型。</p>'); return; }
      this.initGL();
      this.buildParts();
      this.bindControls();
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(canvas);
      this.resize();
      this.render = this.render.bind(this);
      requestAnimationFrame(this.render);
    }

    initGL() {
      const gl = this.gl;
      const vs = `
        attribute vec3 aPosition; attribute vec3 aNormal;
        uniform mat4 uMVP; uniform mat4 uModel;
        varying float vLight; varying float vHeight;
        void main(){
          vec3 normal = normalize(mat3(uModel) * aNormal);
          vec3 lightDir = normalize(vec3(-0.5, 0.9, 0.65));
          float diffuse = max(dot(normal, lightDir), 0.0);
          vLight = 0.30 + diffuse * 0.70;
          vec4 world = uModel * vec4(aPosition,1.0);
          vHeight = clamp((world.y + 2.0) / 5.0, 0.0, 1.0);
          gl_Position = uMVP * vec4(aPosition,1.0);
        }`;
      const fs = `
        precision mediump float; uniform vec3 uColor; uniform float uHighlight;
        varying float vLight; varying float vHeight;
        void main(){
          vec3 lit = uColor * (vLight + vHeight * 0.08);
          vec3 hot = mix(lit, vec3(0.88,0.16,0.07), uHighlight);
          gl_FragColor = vec4(hot,1.0);
        }`;
      const compile = (type, source) => {
        const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
        return shader;
      };
      this.program = gl.createProgram();
      gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.program));
      this.loc = {
        position: gl.getAttribLocation(this.program,'aPosition'), normal: gl.getAttribLocation(this.program,'aNormal'),
        mvp: gl.getUniformLocation(this.program,'uMVP'), model: gl.getUniformLocation(this.program,'uModel'),
        color: gl.getUniformLocation(this.program,'uColor'), highlight: gl.getUniformLocation(this.program,'uHighlight')
      };
      this.meshes = { box: this.upload(cubeGeometry()), cylinder: this.upload(cylinderGeometry()) };
      gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
    }

    upload(geometry) {
      const gl = this.gl;
      const position = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.STATIC_DRAW);
      const normal = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, normal); gl.bufferData(gl.ARRAY_BUFFER, geometry.normals, gl.STATIC_DRAW);
      return { position, normal, count: geometry.count };
    }

    buildParts() {
      this.parts = [];
      const add = (group, mesh, tint, matrix, extra = {}) => this.parts.push({ group, mesh, tint: color(tint), matrix, ...extra });
      if (this.machine === 'lathe') { this.buildLathe(add); return; }
      if (this.machine === 'generator') { this.buildGenerator(add); return; }
      if (this.machine === 'pump') { this.buildPump(add); return; }
      const wheelCenter = [-3.15, .45, 0];
      const wheelMatrix = (local, t, e) => compose(translation(wheelCenter[0] - e * 1.25, wheelCenter[1], 0), rotationX(this.driveAngle(t)), local);
      for (let i = 0; i < 18; i++) {
        const a = i / 18 * TAU, r = 1.58;
        const local = compose(translation(0, Math.cos(a)*r, Math.sin(a)*r), rotationX(a), scaling(.42,.16,.58));
        add('wheel','box','#7a5937',(t,e)=>wheelMatrix(local,t,e));
      }
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU;
        const spoke = compose(rotationX(a), translation(0,.78,0), scaling(.13,1.42,.12));
        add('wheel','box','#9b784c',(t,e)=>wheelMatrix(spoke,t,e));
      }
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * TAU, r=1.76;
        const paddle = compose(translation(0,Math.cos(a)*r,Math.sin(a)*r),rotationX(a),scaling(.58,.32,.11));
        add('wheel','box','#5f472f',(t,e)=>wheelMatrix(paddle,t,e));
      }
      add('wheel','cylinder','#b08b59',(t,e)=>compose(translation(wheelCenter[0]-e*1.25,wheelCenter[1],0),rotationY(Math.PI/2),scaling(.37,.37,.65)));

      add('shaft','cylinder','#59412d',(t,e)=>{
        const wobble = this.running ? Math.sin(t*12) * this.options.tolerance * .006 : 0;
        return compose(translation(-.15,.45+wobble,e*.12),rotationY(Math.PI/2),rotationZ(this.driveAngle(t)),scaling(.15,.15,5.75));
      });
      add('bearing','cylinder','#aa7e35',(t,e)=>compose(translation(-1.75,.45,-e*.42),rotationY(Math.PI/2),scaling(.29,.29,.36)));
      add('bearing','cylinder','#aa7e35',(t,e)=>compose(translation(1.62,.45,e*.42),rotationY(Math.PI/2),scaling(.29,.29,.36)));

      const camPositions = [-.55,.18,.9,1.62,2.34,3.06];
      camPositions.forEach((x,index)=>add('cam','cylinder','#bd873e',(t,e)=>{
        const active = this.camIsVisible(index);
        const spread = (index-2.5)*e*.16;
        return compose(translation(x+spread,.45,0),rotationX(this.driveAngle(t)),translation(0,.34,0),rotationY(Math.PI/2),scaling(active?.48:.001,active?.48:.001,active?.18:.001));
      },{camIndex:index}));

      const liftValue = t => this.running ? Math.max(0, Math.sin(this.driveAngle(t))) * .68 : .12;
      add('hammer','box','#6b4b2f',(t,e)=>compose(translation(3.52+e*1.1,1.25+liftValue(t),0),scaling(.18,2.2,.18)));
      add('hammer','box','#455158',(t,e)=>compose(translation(3.52+e*1.1,2.38+liftValue(t),0),scaling(1.15,.48,.62)));
      add('anvil','box','#59656a',(t,e)=>compose(translation(3.52+e*.55,-.9,0),scaling(1.6,.38,.95)));
      add('anvil','box','#49555a',(t,e)=>compose(translation(3.52+e*.55,-1.4,0),scaling(.75,.8,.7)));

      const frameColor = '#43545a';
      [[-4.3,-1.3,-1.3],[-4.3,-1.3,1.3],[-1.75,-1.3,-1.3],[-1.75,-1.3,1.3],[1.62,-1.3,-1.3],[1.62,-1.3,1.3]].forEach(([x,y,z],i)=>
        add('frame','box',frameColor,(t,e)=>compose(translation(x,y,z+(i%2?e*.7:-e*.7)),scaling(.22,3.0,.22)))
      );
      add('frame','box',frameColor,(t,e)=>compose(translation(-3.02,2.05,-1.3-e*.7),scaling(2.8,.18,.18)));
      add('frame','box',frameColor,(t,e)=>compose(translation(-3.02,2.05,1.3+e*.7),scaling(2.8,.18,.18)));
      add('frame','box','#243f49',()=>compose(translation(0,-1.82,0),scaling(9.6,.14,3.7)));
    }

    buildLathe(add) {
      const spin = t => this.running ? this.driveAngle(t) * 1.35 : .45;
      const wheelCenter = [-3.25, .15, 0];
      const wheelMatrix = (local,t,e) => compose(translation(wheelCenter[0]-e*1.2,wheelCenter[1],0),rotationX(spin(t)),local);
      for(let i=0;i<16;i++){
        const a=i/16*TAU, r=1.25;
        add('drive','box','#7b5635',(t,e)=>wheelMatrix(compose(translation(0,Math.cos(a)*r,Math.sin(a)*r),rotationX(a),scaling(.28,.13,.42)),t,e));
      }
      for(let i=0;i<6;i++){
        const a=i/6*TAU;
        add('drive','box','#9b7449',(t,e)=>wheelMatrix(compose(rotationX(a),translation(0,.61,0),scaling(.12,1.15,.11)),t,e));
      }
      add('drive','cylinder','#b08b59',(t,e)=>compose(translation(-3.25-e*1.2,.15,0),rotationY(Math.PI/2),scaling(.29,.29,.42)));
      add('drive','box','#8e6a43',(t,e)=>compose(translation(-3.65-e*1.35,-1.1,0),rotationZ(-.28+Math.sin(spin(t))*.18),scaling(.14,1.65,.14)));

      add('spindle','cylinder','#44545a',(t,e)=>compose(translation(-1.55-e*.55,.28,0),rotationY(Math.PI/2),rotationX(spin(t)),scaling(.34,.34,.48)));
      for(let i=0;i<4;i++){
        const a=i/4*TAU;
        add('spindle','box','#68777a',(t,e)=>compose(translation(-1.17-e*.42,.28,0),rotationX(spin(t)+a),translation(0,.42,0),scaling(.32,.12,.18)));
      }
      add('spindle','cylinder','#a16f3c',(t,e)=>compose(translation(.15,.28,0),rotationY(Math.PI/2),rotationX(spin(t)),scaling(.43,.43,2.25+e*.5)));

      add('bed','box','#3d5057',(t,e)=>compose(translation(0,-1.18,-.67-e*.35),scaling(7.6,.26,.24)));
      add('bed','box','#3d5057',(t,e)=>compose(translation(0,-1.18,.67+e*.35),scaling(7.6,.26,.24)));
      [[-2.65,-1.62],[2.65,-1.62]].forEach(([x,y])=>{
        add('bed','box','#31464e',(t,e)=>compose(translation(x,y,-.68-e*.35),scaling(.32,1.05,.28)));
        add('bed','box','#31464e',(t,e)=>compose(translation(x,y,.68+e*.35),scaling(.32,1.05,.28)));
      });
      add('bed','box','#263f49',()=>compose(translation(0,-1.95,0),scaling(8.8,.13,3.0)));
      add('bed','box','#4b5e62',(t,e)=>compose(translation(-2.1,-.15-e*.15,0),scaling(1.35,2.1,1.75)));
      add('bed','box','#4b5e62',(t,e)=>compose(translation(2.65,-.4-e*.15,0),scaling(1.05,1.55,1.55)));
      add('bed','cylinder','#59676a',(t,e)=>compose(translation(2.02,.28,0),rotationY(Math.PI/2),scaling(.15,.15,1.25)));

      add('tool','box','#8a713f',(t,e)=>compose(translation(.45+e*.6,-.82,1.02+e*.75),scaling(1.15,.42,1.05)));
      add('tool','box','#637076',(t,e)=>compose(translation(.45+e*.6,-.22,1.02+e*.75),scaling(.34,.8,.36)));
      add('tool','box','#b68a42',(t,e)=>compose(translation(.25+e*.7,.23,.61+e*.75),rotationY(-.42),scaling(.24,.18,1.15)));
    }

    buildGenerator(add) {
      const spin = t => this.running ? this.driveAngle(t) * 1.6 : .35;
      const wheelMatrix = (local,t,e) => compose(translation(-3.05-e*1.1,.15,0),rotationX(spin(t)),local);
      for(let i=0;i<14;i++){
        const a=i/14*TAU, r=1.12;
        add('crank','box','#7d5a37',(t,e)=>wheelMatrix(compose(translation(0,Math.cos(a)*r,Math.sin(a)*r),rotationX(a),scaling(.27,.13,.38)),t,e));
      }
      for(let i=0;i<5;i++){
        const a=i/5*TAU;
        add('crank','box','#a27b4b',(t,e)=>wheelMatrix(compose(rotationX(a),translation(0,.55,0),scaling(.11,1.02,.1)),t,e));
      }
      add('crank','cylinder','#b18a56',(t,e)=>compose(translation(-3.05-e*1.1,.15,0),rotationY(Math.PI/2),scaling(.27,.27,.35)));
      add('crank','box','#9d7442',(t,e)=>compose(translation(-3.3-e*1.3,1.25*Math.cos(spin(t))+.15,1.25*Math.sin(spin(t))),scaling(.55,.13,.13)));
      add('crank','cylinder','#795334',(t,e)=>compose(translation(-3.78-e*1.45,1.25*Math.cos(spin(t))+.15,1.25*Math.sin(spin(t))),rotationY(Math.PI/2),scaling(.18,.18,.45)));

      add('rotor','cylinder','#a87836',(t,e)=>compose(translation(-.15,.15,0),rotationY(Math.PI/2),rotationX(spin(t)),scaling(.42,.42,2.25+e*.45)));
      add('rotor','cylinder','#4e5e63',(t,e)=>compose(translation(-.15,.15,0),rotationY(Math.PI/2),scaling(.12,.12,3.8+e*.6)));
      for(let i=0;i<8;i++){
        const a=i/8*TAU;
        add('coil','box','#b36d32',(t,e)=>compose(translation(-.15,.15,0),rotationX(a),translation(0,.63+e*.45,0),scaling(3.1,.11,.16)));
      }
      add('magnet','box','#9d3f33',(t,e)=>compose(translation(-.1,1.23+e*.75,0),scaling(3.3,.5,1.45)));
      add('magnet','box','#365f70',(t,e)=>compose(translation(-.1,-.93-e*.75,0),scaling(3.3,.5,1.45)));

      [[-1.85,-1.35],[1.55,-1.35]].forEach(([x,y])=>{
        add('frame','box','#3f535b',(t,e)=>compose(translation(x,y,-.75-e*.35),scaling(.28,1.7,.3)));
        add('frame','box','#3f535b',(t,e)=>compose(translation(x,y,.75+e*.35),scaling(.28,1.7,.3)));
      });
      add('frame','box','#263f49',()=>compose(translation(0,-1.95,0),scaling(9.0,.14,3.5)));
      add('output','box','#59676a',(t,e)=>compose(translation(3.35+e*1.15,-.65,0),scaling(1.15,1.45,1.1)));
      add('output','box','#dfb34f',(t,e)=>compose(translation(3.35+e*1.25,.45,0),scaling(.68,.62,.68)));
      add('output','box','#8f6b34',(t,e)=>compose(translation(2.55+e*.8,-.25,.52),rotationY(.36),scaling(1.4,.07,.07)));
      add('output','box','#8f6b34',(t,e)=>compose(translation(2.55+e*.8,-.25,-.52),rotationY(-.36),scaling(1.4,.07,.07)));
    }

    buildPump(add) {
      const spin = t => this.running ? this.driveAngle(t) * 1.15 : .4;
      const wheelMatrix = (local,t,e) => compose(translation(-2.7-e*1.05,.1,0),rotationX(spin(t)),local);
      for(let i=0;i<16;i++){
        const a=i/16*TAU, r=1.34;
        add('crank','box','#7d5a37',(t,e)=>wheelMatrix(compose(translation(0,Math.cos(a)*r,Math.sin(a)*r),rotationX(a),scaling(.3,.14,.42)),t,e));
      }
      for(let i=0;i<6;i++){
        const a=i/6*TAU;
        add('crank','box','#a17a48',(t,e)=>wheelMatrix(compose(rotationX(a),translation(0,.65,0),scaling(.11,1.2,.11)),t,e));
      }
      add('crank','cylinder','#b28b58',(t,e)=>compose(translation(-2.7-e*1.05,.1,0),rotationY(Math.PI/2),scaling(.3,.3,.45)));
      add('crank','cylinder','#59676a',(t,e)=>compose(translation(-.25,.1,0),rotationY(Math.PI/2),rotationX(spin(t)),scaling(.13,.13,5.0+e*.5)));

      [-.1,2.0].forEach((x,index)=>{
        const phase=index*Math.PI, travel=t=>this.running?Math.sin(spin(t)+phase)*.48:0;
        add('piston','cylinder','#53666b',(t,e)=>compose(translation(x+e*(index?.65:-.65),-.15,0),rotationX(Math.PI/2),scaling(.68,.68,2.7)));
        add('piston','cylinder','#a87b40',(t,e)=>compose(translation(x+e*(index?.65:-.65),1.35+travel(t),0),rotationX(Math.PI/2),scaling(.12,.12,2.35)));
        add('piston','box','#8b683f',(t,e)=>compose(translation(x+e*(index?.65:-.65),2.25+travel(t),0),rotationZ(index?-.42:.42),scaling(.14,1.95,.14)));
        add('valve','box','#b08a4b',(t,e)=>compose(translation(x+e*(index?.8:-.8),-1.32,0),scaling(1.25,.38,1.1)));
        add('valve','cylinder','#d0a456',(t,e)=>compose(translation(x+e*(index?.8:-.8),-1.06,.62),rotationX(Math.PI/2),scaling(.22,.22,.32)));
      });
      add('pipe','box','#647579',(t,e)=>compose(translation(.95,-1.48-e*.25,0),scaling(5.0,.22,.35)));
      add('pipe','box','#647579',(t,e)=>compose(translation(3.25+e*.9,-.35,0),scaling(.28,2.5,.35)));
      add('pipe','box','#647579',(t,e)=>compose(translation(4.0+e*1.1,.82,0),scaling(1.75,.28,.35)));
      add('frame','box','#3d5057',(t,e)=>compose(translation(.95,-1.82,0),scaling(7.2,.16,3.0)));
    }

    camIsVisible(index) {
      if (this.options.cams === 6) return true;
      if (this.options.cams === 3) return index === 0 || index === 2 || index === 4;
      return index === 2;
    }

    driveAngle(time) {
      if (!this.running && this.variant !== 'hero') return .5;
      const rate = this.options.power === 'human' ? 1.5 : this.options.power === 'animal' ? 2.1 : 2.7;
      return time * rate;
    }

    bindControls() {
      const c = this.canvas;
      c.addEventListener('pointerdown', e => { this.dragging=true; this.lastPointer=[e.clientX,e.clientY]; c.setPointerCapture(e.pointerId); });
      c.addEventListener('pointermove', e => {
        if(!this.dragging) return;
        const dx=e.clientX-this.lastPointer[0], dy=e.clientY-this.lastPointer[1]; this.lastPointer=[e.clientX,e.clientY];
        this.targetYaw += dx*.008; this.targetPitch = clamp(this.targetPitch+dy*.006,-.25,1.05); this.autoOrbit=false;
      });
      c.addEventListener('pointerup',()=>{this.dragging=false;});
      c.addEventListener('pointercancel',()=>{this.dragging=false;});
      c.addEventListener('wheel',e=>{e.preventDefault();this.distance=clamp(this.distance+e.deltaY*.01,7,18);},{passive:false});
    }

    resize() {
      if(!this.gl) return;
      const rect=this.canvas.getBoundingClientRect(); if(!rect.width||!rect.height)return;
      const dpr=Math.min(devicePixelRatio||1,2), w=Math.round(rect.width*dpr), h=Math.round(rect.height*dpr);
      if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}
    }

    render(now) {
      if(!this.gl) return;
      this.resize();
      const dt=Math.min((now-this.lastFrame)/1000,.05); this.lastFrame=now;
      if(this.autoOrbit&&!this.dragging) this.targetYaw += dt*.09;
      this.yaw += (this.targetYaw-this.yaw)*.12; this.pitch += (this.targetPitch-this.pitch)*.12;
      const gl=this.gl, t=(now-this.startTime)/1000;
      const clear=this.variant==='hero'?[.075,.17,.20,0]:[.055,.13,.16,0];
      gl.clearColor(...clear); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); gl.useProgram(this.program);
      const aspect=this.canvas.width/Math.max(1,this.canvas.height);
      const center=[0,.1,0];
      const viewDistance=this.distance*(aspect<1.25?2.0:1);
      const eye=[center[0]+Math.sin(this.yaw)*Math.cos(this.pitch)*viewDistance,center[1]+Math.sin(this.pitch)*viewDistance,center[2]+Math.cos(this.yaw)*Math.cos(this.pitch)*viewDistance];
      const vp=multiply(perspective(rad(34),aspect,.1,100),lookAt(eye,center,[0,1,0]));
      this.parts.forEach(part=>{
        const model=part.matrix(t,this.explode), mvp=multiply(vp,model), mesh=this.meshes[part.mesh];
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.position);gl.enableVertexAttribArray(this.loc.position);gl.vertexAttribPointer(this.loc.position,3,gl.FLOAT,false,0,0);
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.normal);gl.enableVertexAttribArray(this.loc.normal);gl.vertexAttribPointer(this.loc.normal,3,gl.FLOAT,false,0,0);
        gl.uniformMatrix4fv(this.loc.mvp,false,mvp);gl.uniformMatrix4fv(this.loc.model,false,model);
        let tint=part.tint;
        if(part.group==='shaft'&&this.options.shaft==='pine')tint=color('#b28a58');
        if(part.group==='shaft'&&this.options.shaft==='elm')tint=color('#765237');
        if(part.group==='bearing'&&this.options.shaft!=='bronze')tint=color('#5d4937');
        const faultStrength=this.fault===part.group?.75:0;
        const focusStrength=this.focus===part.group?.38:0;
        gl.uniform3fv(this.loc.color,tint);gl.uniform1f(this.loc.highlight,Math.max(faultStrength,focusStrength));
        gl.drawArrays(gl.TRIANGLES,0,mesh.count);
      });
      requestAnimationFrame(this.render);
    }

    setRunning(value){this.running=!!value;}
    setFault(group){this.fault=group||null;}
    setFocus(group){this.focus=this.focus===group?null:group;}
    setExplode(value){this.explode=clamp(Number(value)||0,0,1);}
    setOptions(options){Object.assign(this.options,options);}
    setMachine(machine){
      if(!['hammer','lathe','generator','pump'].includes(machine)||machine===this.machine)return;
      this.machine=machine;this.focus=null;this.fault=null;this.explode=0;this.buildParts();this.resetView();
    }
    resetView(){this.targetYaw=.92;this.targetPitch=.25;this.distance=this.variant==='hero'?12.5:11.9;this.autoOrbit=this.variant==='hero';}
  }

  window.EngineeringModel3D = EngineeringModel3D;
})();
