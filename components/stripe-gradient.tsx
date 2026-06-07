/* eslint-disable */
"use client";

import { useEffect, useRef } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeColor(hex: number) {
  return [(hex >> 16 & 255) / 255, (hex >> 8 & 255) / 255, (255 & hex) / 255];
}
function def(obj: any, key: string, val: any) {
  key in obj
    ? Object.defineProperty(obj, key, { value: val, enumerable: true, configurable: true, writable: true })
    : (obj[key] = val);
  return obj;
}

// ─── MiniGl ───────────────────────────────────────────────────────────────────
class MiniGl {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  meshes: any[];
  commonUniforms: any;
  debug: (...a: any[]) => void;
  width = 0;
  height = 0;
  Material: any;
  Uniform: any;
  PlaneGeometry: any;
  Mesh: any;
  Attribute: any;

  constructor(canvas: HTMLCanvasElement, width?: number, height?: number) {
    const self = this;
    self.canvas = canvas;
    self.gl = canvas.getContext("webgl", { antialias: true }) as WebGLRenderingContext;
    self.meshes = [];
    const gl = self.gl;
    if (width && height) self.setSize(width, height);
    self.debug = () => {};

    Object.defineProperties(self, {
      Material: {
        enumerable: false,
        value: class {
          uniforms: any;
          uniformInstances: any[];
          vertexSource!: string;
          Source!: string;
          vertexShader!: WebGLShader;
          fragmentShader!: WebGLShader;
          program!: WebGLProgram;

          constructor(vertexShaders: string, fragments: string, uniforms: any = {}) {
            const mat = this;
            function compile(type: number, src: string) {
              const s = gl.createShader(type)!;
              gl.shaderSource(s, src);
              gl.compileShader(s);
              if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
              return s;
            }
            function decls(uniforms: any, type: string): string {
              return Object.entries(uniforms).map(([k, v]: any) => v.getDeclaration(k, type)).join("\n");
            }
            mat.uniforms = uniforms;
            mat.uniformInstances = [];
            const prefix = "precision highp float;";
            mat.vertexSource = `${prefix}\nattribute vec4 position;\nattribute vec2 uv;\nattribute vec2 uvNorm;\n${decls(self.commonUniforms, "vertex")}\n${decls(uniforms, "vertex")}\n${vertexShaders}`;
            mat.Source = `${prefix}\n${decls(self.commonUniforms, "fragment")}\n${decls(uniforms, "fragment")}\n${fragments}`;
            mat.vertexShader = compile(gl.VERTEX_SHADER, mat.vertexSource);
            mat.fragmentShader = compile(gl.FRAGMENT_SHADER, mat.Source);
            mat.program = gl.createProgram()!;
            gl.attachShader(mat.program, mat.vertexShader);
            gl.attachShader(mat.program, mat.fragmentShader);
            gl.linkProgram(mat.program);
            if (!gl.getProgramParameter(mat.program, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(mat.program));
            gl.useProgram(mat.program);
            mat.attachUniforms(undefined, self.commonUniforms);
            mat.attachUniforms(undefined, mat.uniforms);
          }
          attachUniforms(name: string | undefined, uniforms: any) {
            const mat = this;
            if (name === undefined) {
              Object.entries(uniforms).forEach(([n, u]: any) => mat.attachUniforms(n, u));
            } else if (uniforms.type === "array") {
              uniforms.value.forEach((u: any, i: number) => mat.attachUniforms(`${name}[${i}]`, u));
            } else if (uniforms.type === "struct") {
              Object.entries(uniforms.value).forEach(([k, v]: any) => mat.attachUniforms(`${name}.${k}`, v));
            } else {
              mat.uniformInstances.push({ uniform: uniforms, location: gl.getUniformLocation(mat.program, name) });
            }
          }
        }
      },
      Uniform: {
        enumerable: false,
        value: class {
          type: string;
          value: any;
          transpose: any;
          excludeFrom: any;
          typeFn: string;

          constructor(e: any) {
            this.type = "float";
            Object.assign(this, e);
            this.typeFn = ({ float:"1f", int:"1i", vec2:"2fv", vec3:"3fv", vec4:"4fv", mat4:"Matrix4fv" } as any)[this.type] || "1f";
            this.update();
          }
          update(loc?: any) {
            if (this.value !== undefined)
              (gl as any)[`uniform${this.typeFn}`](loc, this.typeFn.startsWith("Matrix") ? this.transpose : this.value, this.typeFn.startsWith("Matrix") ? this.value : null);
          }
          getDeclaration(name: string, type: string, length?: number): string {
            const u = this;
            if (u.excludeFrom === type) return "";
            if (u.type === "array") return u.value[0].getDeclaration(name, type, u.value.length) + `\nconst int ${name}_length = ${u.value.length};`;
            if (u.type === "struct") {
              let n = name.replace("u_", "");
              n = n[0].toUpperCase() + n.slice(1);
              return `uniform struct ${n} {\n` + Object.entries(u.value).map(([k, v]: any) => v.getDeclaration(k, type).replace(/^uniform/, "")).join("") + `\n} ${name}${length! > 0 ? `[${length}]` : ""};`;
            }
            return `uniform ${u.type} ${name}${length! > 0 ? `[${length}]` : ""};`;
          }
        }
      },
      PlaneGeometry: {
        enumerable: false,
        value: class {
          attributes: any;
          xSegCount!: number;
          ySegCount!: number;
          vertexCount!: number;
          quadCount!: number;
          width!: number;
          height!: number;
          orientation!: string;

          constructor(width?: number, height?: number, n?: number, i?: number, orientation?: string) {
            this.attributes = {
              position: new self.Attribute({ target: gl.ARRAY_BUFFER, size: 3 }),
              uv: new self.Attribute({ target: gl.ARRAY_BUFFER, size: 2 }),
              uvNorm: new self.Attribute({ target: gl.ARRAY_BUFFER, size: 2 }),
              index: new self.Attribute({ target: gl.ELEMENT_ARRAY_BUFFER, size: 3, type: gl.UNSIGNED_SHORT }),
            };
            this.setTopology(n, i);
            this.setSize(width, height, orientation);
          }
          setTopology(e = 1, t = 1) {
            const g = this;
            g.xSegCount = e; g.ySegCount = t;
            g.vertexCount = (e + 1) * (t + 1);
            g.quadCount = e * t * 2;
            g.attributes.uv.values = new Float32Array(2 * g.vertexCount);
            g.attributes.uvNorm.values = new Float32Array(2 * g.vertexCount);
            g.attributes.index.values = new Uint16Array(3 * g.quadCount);
            for (let ey = 0; ey <= g.ySegCount; ey++) for (let ex = 0; ex <= g.xSegCount; ex++) {
              const idx = ey * (g.xSegCount + 1) + ex;
              g.attributes.uv.values[2*idx] = ex/g.xSegCount;
              g.attributes.uv.values[2*idx+1] = 1 - ey/g.ySegCount;
              g.attributes.uvNorm.values[2*idx] = ex/g.xSegCount*2-1;
              g.attributes.uvNorm.values[2*idx+1] = 1 - ey/g.ySegCount*2;
              if (ex < g.xSegCount && ey < g.ySegCount) {
                const s = ey*g.xSegCount+ex;
                g.attributes.index.values[6*s]=idx; g.attributes.index.values[6*s+1]=idx+1+g.xSegCount;
                g.attributes.index.values[6*s+2]=idx+1; g.attributes.index.values[6*s+3]=idx+1;
                g.attributes.index.values[6*s+4]=idx+1+g.xSegCount; g.attributes.index.values[6*s+5]=idx+2+g.xSegCount;
              }
            }
            g.attributes.uv.update(); g.attributes.uvNorm.update(); g.attributes.index.update();
          }
          setSize(width = 1, height = 1, orientation = "xz") {
            const g = this;
            g.width = width; g.height = height; g.orientation = orientation;
            if (!g.attributes.position.values || g.attributes.position.values.length !== 3*g.vertexCount)
              g.attributes.position.values = new Float32Array(3*g.vertexCount);
            const ox = width/-2, oy = height/-2, sw = width/g.xSegCount, sh = height/g.ySegCount;
            for (let ey = 0; ey <= g.ySegCount; ey++) for (let ex = 0; ex <= g.xSegCount; ex++) {
              const l = ey*(g.xSegCount+1)+ex;
              g.attributes.position.values[3*l+"xyz".indexOf(orientation[0])] = ox+ex*sw;
              g.attributes.position.values[3*l+"xyz".indexOf(orientation[1])] = -(oy+ey*sh);
            }
            g.attributes.position.update();
          }
        }
      },
      Mesh: {
        enumerable: false,
        value: class {
          geometry: any; material: any; wireframe: boolean; attributeInstances: any[];
          constructor(geometry: any, material: any) {
            const m = this;
            m.geometry = geometry; m.material = material; m.wireframe = false; m.attributeInstances = [];
            Object.entries(m.geometry.attributes).forEach(([k, attr]: any) => {
              m.attributeInstances.push({ attribute: attr, location: attr.attach(k, m.material.program) });
            });
            self.meshes.push(m);
          }
          draw() {
            gl.useProgram(this.material.program);
            this.material.uniformInstances.forEach(({ uniform: u, location: l }: any) => u.update(l));
            this.attributeInstances.forEach(({ attribute: a, location: l }: any) => a.use(l));
            gl.drawElements(this.wireframe ? gl.LINES : gl.TRIANGLES, this.geometry.attributes.index.values.length, gl.UNSIGNED_SHORT, 0);
          }
          remove() { self.meshes = self.meshes.filter((m: any) => m !== this); }
        }
      },
      Attribute: {
        enumerable: false,
        value: class {
          type: number; normalized: boolean; buffer: WebGLBuffer; target: number; size: number; values: any;
          constructor(e: any) {
            this.type = gl.FLOAT; this.normalized = false;
            this.buffer = gl.createBuffer()!;
            Object.assign(this, e); this.update();
          }
          update() {
            if (this.values !== undefined) { gl.bindBuffer(this.target, this.buffer); gl.bufferData(this.target, this.values, gl.STATIC_DRAW); }
          }
          attach(name: string, prog: WebGLProgram) {
            const loc = gl.getAttribLocation(prog, name);
            if (this.target === gl.ARRAY_BUFFER) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0); }
            return loc;
          }
          use(loc: number) {
            gl.bindBuffer(this.target, this.buffer);
            if (this.target === gl.ARRAY_BUFFER) { gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, this.size, this.type, this.normalized, 0, 0); }
          }
        }
      },
    });

    const identity = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    self.commonUniforms = {
      projectionMatrix: new self.Uniform({ type: "mat4", value: identity }),
      modelViewMatrix:  new self.Uniform({ type: "mat4", value: identity }),
      resolution:       new self.Uniform({ type: "vec2", value: [1, 1] }),
      aspectRatio:      new self.Uniform({ type: "float", value: 1 }),
    };
  }

  setSize(w = 640, h = 480) {
    this.width = w; this.height = h;
    this.canvas.width = w; this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
    this.commonUniforms.resolution.value = [w, h];
    this.commonUniforms.aspectRatio.value = w / h;
  }
  setOrthographicCamera(e = 0, t = 0, n = 0, i = -2000, s = 2000) {
    this.commonUniforms.projectionMatrix.value = [2/this.width,0,0,0, 0,2/this.height,0,0, 0,0,2/(i-s),0, e,t,n,1];
  }
  render() {
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clearDepth(1);
    this.meshes.forEach((m: any) => m.draw());
  }
}

// ─── Gradient (adapted for Abelec — fixed 600×600, brand palette) ─────────────
class Gradient {
  el: HTMLCanvasElement | null = null;
  cssVarRetries = 0;
  maxCssVarRetries = 200;
  angle = 0;
  isLoadedClass = false;
  conf: any;
  shaderFiles: any;
  vertexShader: any;
  sectionColors: any;
  computedCanvasStyle: CSSStyleDeclaration | null = null;
  uniforms: any;
  t = 1253106;
  last = 0;
  // Fixed dimensions for the orb
  width  = 600;
  height = 600;
  xSegCount = 0;
  ySegCount = 0;
  mesh: any;
  material: any;
  geometry: any;
  minigl: MiniGl | null = null;
  amp    = 380;   // high amp → sharp ribbon shapes like Stripe
  seed   = 5;
  freqX  = 14e-5;
  freqY  = 29e-5;
  // wave layer freq multipliers — tighter = more defined ribbons
  freqDelta = 1e-5;
  activeColors = [1,1,1,1];
  isMouseDown  = false;
  isMetaKey    = false;

  animate = (e: number) => {
    if (!this.shouldSkipFrame(e) || this.isMouseDown) {
      this.t += Math.min(e - this.last, 1000/15);
      this.last = e;
      if (this.isMouseDown) this.t += this.isMetaKey ? -160 : 160;
      this.mesh.material.uniforms.u_time.value = this.t;
      this.minigl!.render();
    }
    if (this.conf.playing || this.isMouseDown) requestAnimationFrame(this.animate);
  };

  resize = () => {
    // Fit the canvas to its parent container
    const parent = this.el?.parentElement;
    this.width  = parent?.offsetWidth  ?? 700;
    this.height = parent?.offsetHeight ?? 600;
    this.minigl!.setSize(this.width, this.height);
    this.minigl!.setOrthographicCamera();
    this.xSegCount = Math.ceil(this.width  * this.conf.density[0]);
    this.ySegCount = Math.ceil(this.height * this.conf.density[1]);
    this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount);
    this.mesh.geometry.setSize(this.width, this.height);
    this.mesh.material.uniforms.u_shadow_power.value = 5;
  };

  pause() { this.conf.playing = false; }
  play()  { requestAnimationFrame(this.animate); this.conf.playing = true; }

  initGradient(selector: string) {
    this.el = document.querySelector(selector);
    this.connect();
    return this;
  }

  connect() {
    if (!this.el) return;
    this.shaderFiles = {
      vertex: `varying vec3 v_color;\nvoid main() {\n  float time = u_time * u_global.noiseSpeed;\n  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;\n  vec2 st = 1. - uvNorm.xy;\n  float tilt = resolution.y / 2.0 * uvNorm.y;\n  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;\n  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);\n  float noise = snoise(vec3(noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow, noiseCoord.y * u_vertDeform.noiseFreq.y, time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed)) * u_vertDeform.noiseAmp;\n  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);\n  noise = max(0.0, noise);\n  vec3 pos = vec3(position.x, position.y + tilt + incline + noise - offset, position.z);\n  if (u_active_colors[0] == 1.) { v_color = u_baseColor; }\n  for (int i = 0; i < u_waveLayers_length; i++) {\n    if (u_active_colors[i + 1] == 1.) {\n      WaveLayers layer = u_waveLayers[i];\n      float noise = smoothstep(layer.noiseFloor, layer.noiseCeil, snoise(vec3(noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow, noiseCoord.y * layer.noiseFreq.y, time * layer.noiseSpeed + layer.noiseSeed)) / 2.0 + 0.5);\n      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));\n    }\n  }\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}`,
      noise: `vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}float snoise(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}`,
      blend: `vec3 blendNormal(vec3 base,vec3 blend){return blend;}vec3 blendNormal(vec3 base,vec3 blend,float opacity){return(blendNormal(base,blend)*opacity+base*(1.-opacity));}`,
      fragment: `varying vec3 v_color;\nvoid main(){\n  vec3 color=v_color;\n  gl_FragColor=vec4(color,1.);\n}`,
    };

    this.conf = { wireframe: false, density: [0.08, 0.20], playing: true };

    this.minigl = new MiniGl(this.el!);
    requestAnimationFrame(() => {
      if (this.el) {
        this.computedCanvasStyle = getComputedStyle(this.el);
        this.waitForCssVars();
      }
    });
  }

  waitForCssVars() {
    if (this.computedCanvasStyle && this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#") !== -1) {
      this.init();
    } else {
      this.cssVarRetries++;
      if (this.cssVarRetries > this.maxCssVarRetries) {
        // Fallback colors — light versions of brand palette
        this.sectionColors = [0xDCE6F8, 0xFAEEE5, 0xE8F0FD, 0xFDF5EF].map(normalizeColor);
        this.init();
        return;
      }
      requestAnimationFrame(() => this.waitForCssVars());
    }
  }

  initGradientColors() {
    this.sectionColors = ["--gradient-color-1","--gradient-color-2","--gradient-color-3","--gradient-color-4"]
      .map(v => {
        let hex = this.computedCanvasStyle!.getPropertyValue(v).trim();
        if (hex.length === 4) hex = "#" + hex.slice(1).split("").map(c => c+c).join("");
        return hex ? ("0x" + hex.slice(1)) : null;
      })
      .filter(Boolean)
      .map(h => normalizeColor(parseInt(h as string, 16)));
  }

  initMaterial() {
    this.uniforms = {
      u_time: new this.minigl!.Uniform({ value: 0 }),
      u_shadow_power: new this.minigl!.Uniform({ value: 5 }),
      u_darken_top: new this.minigl!.Uniform({ value: 0 }),
      u_active_colors: new this.minigl!.Uniform({ value: this.activeColors, type: "vec4" }),
      u_global: new this.minigl!.Uniform({
        value: {
          noiseFreq: new this.minigl!.Uniform({ value: [this.freqX, this.freqY], type: "vec2" }),
          noiseSpeed: new this.minigl!.Uniform({ value: 5e-6 }),
        },
        type: "struct",
      }),
      u_vertDeform: new this.minigl!.Uniform({
        value: {
          incline:      new this.minigl!.Uniform({ value: Math.sin(this.angle)/Math.cos(this.angle) }),
          offsetTop:    new this.minigl!.Uniform({ value: -0.5 }),
          offsetBottom: new this.minigl!.Uniform({ value: -0.5 }),
          noiseFreq:    new this.minigl!.Uniform({ value: [3, 4], type: "vec2" }),
          noiseAmp:     new this.minigl!.Uniform({ value: this.amp }),
          noiseSpeed:   new this.minigl!.Uniform({ value: 10 }),
          noiseFlow:    new this.minigl!.Uniform({ value: 3 }),
          noiseSeed:    new this.minigl!.Uniform({ value: this.seed }),
        },
        type: "struct",
        excludeFrom: "fragment",
      }),
      u_baseColor: new this.minigl!.Uniform({ value: this.sectionColors[0], type: "vec3", excludeFrom: "fragment" }),
      u_waveLayers: new this.minigl!.Uniform({ value: [], excludeFrom: "fragment", type: "array" }),
    };

    for (let i = 1; i < this.sectionColors.length; i++) {
      this.uniforms.u_waveLayers.value.push(new this.minigl!.Uniform({
        value: {
          color:      new this.minigl!.Uniform({ value: this.sectionColors[i], type: "vec3" }),
          noiseFreq:  new this.minigl!.Uniform({ value: [2+i/this.sectionColors.length, 3+i/this.sectionColors.length], type: "vec2" }),
          noiseSpeed: new this.minigl!.Uniform({ value: 11+0.3*i }),
          noiseFlow:  new this.minigl!.Uniform({ value: 6.5+0.3*i }),
          noiseSeed:  new this.minigl!.Uniform({ value: this.seed+10*i }),
          noiseFloor: new this.minigl!.Uniform({ value: 0.1 }),
          noiseCeil:  new this.minigl!.Uniform({ value: 0.63+0.07*i }),
        },
        type: "struct",
      }));
    }

    const vs = [this.shaderFiles.noise, this.shaderFiles.blend, this.shaderFiles.vertex].join("\n\n");
    return new this.minigl!.Material(vs, this.shaderFiles.fragment, this.uniforms);
  }

  initMesh() {
    this.material = this.initMaterial();
    this.geometry = new this.minigl!.PlaneGeometry();
    this.mesh = new this.minigl!.Mesh(this.geometry, this.material);
  }

  shouldSkipFrame(t: number) {
    return !!document.hidden || !this.conf.playing || parseInt(String(t), 10) % 2 === 0;
  }

  init() {
    this.initGradientColors();
    this.initMesh();
    this.resize();
    requestAnimationFrame(this.animate);
  }
}

// ─── React component ──────────────────────────────────────────────────────────
const CANVAS_ID = "abelec-gradient-canvas";

export default function StripeGradient() {
  useEffect(() => {
    const el = document.getElementById(CANVAS_ID);
    if (!el) return;
    const g = new Gradient();
    g.initGradient(`#${CANVAS_ID}`);
    return () => { g.pause(); };
  }, []);

  return (
    <canvas
      id={CANVAS_ID}
      style={{
        // Light base + colored waves flowing on top (like Stripe)
        ["--gradient-color-1" as any]: "#E8F0FB",  // very light blue-white base
        ["--gradient-color-2" as any]: "#F5C4A0",  // soft peach-orange wave
        ["--gradient-color-3" as any]: "#A8C4E8",  // soft blue wave
        ["--gradient-color-4" as any]: "#F0D8C8",  // warm cream wave
        display: "block",
        width:  "100%",
        height: "100%",
      }}
    />
  );
}
