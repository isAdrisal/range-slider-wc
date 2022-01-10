var p=':host{display:inline-block;margin:2px;width:129px;-webkit-tap-highlight-color:transparent;--track-height: 0.5rem;--thumb-diameter: 1rem;--track-color: rgb(239, 239, 239);--track-color-active: rgb(229, 229, 229);--track-color-alt: var(--track-color);--track-color-alt-focus: var(--track-color-active);--track-color-disabled: rgb(250, 250, 250);--progress-color: rgb(0, 117, 255);--progress-color-active: rgb(0, 92, 200);--progress-color-disabled: rgb(203, 203, 203);--thumb-color: rgb(0, 117, 255);--thumb-color-active: rgb(0, 92, 200);--thumb-color-disabled: rgb(203, 203, 203);--thumb-halo-color: rgba(0, 92, 200, 0.1);--thumb-halo-size: 0.425rem;--focus-outline: 1px solid black;--focus-outline-offset: 0px;--transition-duration: 100ms;--transition-timing-function: ease-in;--cursor: pointer;--thumb-pointer-events: all}:host([disabled]){--cursor: default;pointer-events:none;--thumb-pointer-events: none;--track-color: var(--track-color-disabled);--progress-color: var(--progress-color-disabled);--thumb-color: var(--thumb-color-disabled)}[part=container]{display:grid;grid-template:"range-slider-container";grid-template-columns:1fr;place-items:center;place-content:center;width:100%;cursor:var(--cursor)}@media(hover: hover){[part=container]:hover [part=min-input]{--progress-color: var(--track-color-active)}[part=container]:hover [part=max-input]{--track-color: var(--track-color-active);--progress-color: var(--progress-color-active)}}[part=container]:focus-within [part=min-input]{--progress-color: var(--track-color-active)}[part=container]:focus-within [part=max-input]{--track-color: var(--track-color-active);--progress-color: var(--progress-color-active)}input[type=range]{grid-area:range-slider-container;margin:0;padding:0;width:100%;height:var(--thumb-diameter);max-width:100%;background:transparent;font:1em/1 arial,sans-serif;outline:none;cursor:var(--cursor);pointer-events:none;--range: calc(var(--max) - var(--min));--ratio: calc((var(--value) - var(--min)) / var(--range));--fill-width: calc(0.5 * var(--thumb-diameter) + var(--ratio) * (100% - var(--thumb-diameter)))}input[type=range],input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}@media(hover: hover){input[type=range]:focus:not(:hover){outline:var(--focus-outline);outline-offset:var(--outline-offset)}}input[type=range]::-webkit-slider-runnable-track{box-sizing:border-box;border:none;width:100%;height:var(--track-height);background:var(--track-color);border-radius:calc(var(--track-height)/2);background:linear-gradient(var(--progress-color), var(--progress-color)) 0/var(--fill-width) 100% no-repeat var(--track-color)}input[type=range]::-moz-range-track{box-sizing:border-box;border:none;width:100%;height:var(--track-height);background:var(--track-color);border-radius:calc(var(--track-height)/2)}input[type=range]::-moz-range-progress{height:var(--track-height);background:var(--progress-color);border-radius:calc(var(--track-height)/2)}input[type=range][part=min-input]::-moz-range-progress{border-top-right-radius:0px;border-bottom-right-radius:0px}input[type=range]::-webkit-slider-thumb{margin-top:calc(.5*(var(--track-height) - var(--thumb-diameter)));box-sizing:border-box;border:none;width:var(--thumb-diameter);height:var(--thumb-diameter);border-radius:50%;background:var(--thumb-color);box-shadow:var(--thumb-shadow);transition:all var(--transition-duration) var(--transition-timing-function);pointer-events:var(--thumb-pointer-events)}@media(hover: hover){input[type=range]::-webkit-slider-thumb:hover{--thumb-color: var(--thumb-color-active);--thumb-shadow: 0px 0px 0px var(--thumb-halo-size) var(--thumb-halo-color)}}input[type=range]::-moz-range-thumb{box-sizing:border-box;border:none;width:var(--thumb-diameter);height:var(--thumb-diameter);border-radius:50%;background:var(--thumb-color);box-shadow:var(--thumb-shadow);transition:all var(--transition-duration) var(--transition-timing-function);pointer-events:var(--thumb-pointer-events)}@media(hover: hover){input[type=range]::-moz-range-thumb:hover{--thumb-color: var(--thumb-color-active);--thumb-shadow: 0px 0px 0px var(--thumb-halo-size) var(--thumb-halo-color)}}input[type=range]:focus::-webkit-slider-thumb{--thumb-color: var(--thumb-color-active);--thumb-shadow: 0px 0px 0px var(--thumb-halo-size) var(--thumb-halo-color)}input[type=range]:focus::-moz-range-thumb{--thumb-color: var(--thumb-color-active);--thumb-shadow: 0px 0px 0px var(--thumb-halo-size) var(--thumb-halo-color)}input[type=range][part=min-input]{z-index:2;--progress-color: var(--track-color-alt);--track-color: transparent}input[type=range][part=max-input][data-at-min=true]{z-index:2}';var M=customElements.define("range-slider",class extends HTMLElement{static get observedAttributes(){return["disabled"]}get min(){return this._min}set min(i){let t=Number(i);this._min=t,this.setAttribute("min",t),this._setInputProperty(this._minInput,"min",t),this._setInputProperty(this._maxInput,"min",t)}get max(){return this._max}set max(i){let t=Number(i);this._max=t,this.setAttribute("max",t),this._setInputProperty(this._minInput,"max",t),this._setInputProperty(this._maxInput,"max",t)}get step(){return this._step}set step(i){this._step=i,this.setAttribute("step",i),this._setInputProperty(this._minInput,"step",i),this._setInputProperty(this._maxInput,"step",i)}get disabled(){return this._disabled}set disabled(i){if(typeof i=="boolean")if(this._disabled=i,this._minInput.disabled=i,this._maxInput.disabled=i,i===!0){let t=this.getAttribute("disabled");t!==""&&t!=="true"&&this.setAttribute("disabled","")}else this.removeAttribute("disabled")}get valueMin(){return this._valueMin}set valueMin(i){let t=Number(i);t!==this.valueMin&&(t<this.min&&(t=this.min),this._valueMin=t,this.setAttribute("valueMin",t),this._setInputProperty(this._minInput,"value",t),this.midpoint=(this.valueMax-this.valueMin)/2+this.valueMin,this.ready&&this.dispatchEvent(new CustomEvent("change",{detail:{min:this.min,max:this.max,step:this.step,valueMin:this.valueMin,valueMax:this.valueMax}})))}get valueMax(){return this._valueMax}set valueMax(i){let t=Number(i);t!==this.valueMax&&(t>this.max&&(t=this.max),this._valueMax=t,this.setAttribute("valueMax",t),this._setInputProperty(this._maxInput,"value",t),this.midpoint=(this.valueMax-this.valueMin)/2+this.valueMin,this.ready&&this.dispatchEvent(new CustomEvent("change",{detail:{min:this.min,max:this.max,step:this.step,valueMin:this.valueMin,valueMax:this.valueMax}})))}get midpoint(){return this._midpoint}set midpoint(i){this._midpoint=Number(i)}constructor(){super();let i=this.attachShadow({mode:"open"}),t=document.createElement("template");t.innerHTML='<div part="container"><input part="min-input" type="range"><input part="max-input" type="range"></div>';let l=document.createElement("style");l.innerHTML=p,i.appendChild(l),i.appendChild(t.content.cloneNode(!0)),this._init=()=>{this._container=this.shadowRoot.querySelector('[part="container"]'),this._minInput=this.shadowRoot.querySelector('[part="min-input"]'),this._maxInput=this.shadowRoot.querySelector('[part="max-input"]'),this._inputs=[this._minInput,this._maxInput];let e=this.getAttribute("min"),r=this.getAttribute("max");if(!e||!r){this.shadowRoot.innerHTML="";return}if(this.min=Number(e),this.max=Number(r),isNaN(this.min)||isNaN(this.max)){this.shadowRoot.innerHTML="";return}let a=this.getAttribute("valueMin"),n=this.getAttribute("valueMax"),s=this.getAttribute("step"),o=Number(a),u=Number(n),c=Number(s);this.valueMin=a&&!isNaN(o)?o:this.min,this.valueMax=n&&!isNaN(u)?u:this.max,this.step=s&&!isNaN(c)?c:1,this.midpoint=(this.valueMax-this.valueMin)/2+this.valueMin;let m=this.getAttribute("disabled"),d=m===""||m==="true";this.disabled=d,this._inputs.forEach((h,v)=>{this._setInputProperty(h,"min",this.min),this._setInputProperty(h,"max",this.max),this._setInputProperty(h,"step",this.step),this._setInputProperty(h,"value",v===0?this.valueMin:this.valueMax),h.addEventListener("change",this._handleChange),h.addEventListener("input",this._handleChange),h.addEventListener("touchstart",this._handlePointerDown)}),this._container.addEventListener("mousedown",this._handleSyntheticTrackClick),this._container.addEventListener("click",this._handleSyntheticTrackClick),this.addEventListener("mouseup",this._handlePointerUp),this.addEventListener("touchend",this._handlePointerUp),this.ready=!0,this.dispatchEvent(new CustomEvent("ready",{detail:{min:this.min,max:this.max,step:this.step,valueMin:this.valueMin,valueMax:this.valueMax}}))},this._setInputProperty=(e,r,a)=>{e[r]=a;let n=r==="value"?e.valueAsNumber:a;e.style.setProperty(`--${r}`,n),e.part.value==="max-input"&&r==="value"&&(e.dataset.atMin=a===this.min)},this._handleChange=e=>{e.stopPropagation();let r=e.target,a=r.part.value==="min-input",n=r.valueAsNumber,s=a?Math.min(n,this.valueMax):Math.max(n,this.valueMin);this._setInputProperty(r,"value",s);let o={min:this.min,max:this.max,step:this.step,valueMin:a?s:this.valueMin,valueMax:a?this.valueMax:s};this.dispatchEvent(new CustomEvent("input",{detail:o})),e.type==="change"&&(this._setInputProperty(r,"value",s),a?this.valueMin=s:this.valueMax=s)},this._syntheticClickHandled=!1,this._handleSyntheticTrackClick=e=>{if(e.button!==0)return;if(e.stopPropagation(),e.type==="click"&&this._syntheticClickHandled){this._syntheticClickHandled=!1;return}e.type==="mousedown"&&(this._syntheticClickHandled=!0);let a=(e.offsetX===0&&e.offsetY===0?e.layerX-e.target.offsetLeft:e.offsetX)/e.target.offsetWidth,n=(this.midpoint-this.min)/(this.max-this.min),s=a*(this.max-this.min)+this.min,o=a<n,u=o?this._minInput:this._maxInput;this._setInputProperty(u,"value",s);let c={min:this.min,max:this.max,step:this.step,valueMin:o?u.valueAsNumber:this.valueMin,valueMax:o?this.valueMax:u.valueAsNumber};this.dispatchEvent(new CustomEvent("input",{detail:c}))},this._handlePointerDown=e=>{let r=e.path?e.path:e.composedPath();if(!Array.isArray(r)||Array.length<1)return;r[0].focus()},this._handlePointerUp=e=>{this.blur(),this._minInput.blur(),this._maxInput.blur(),this.valueMin=this._minInput.valueAsNumber,this.valueMax=this._maxInput.valueAsNumber}}connectedCallback(){!this.isConnected||this._init()}attributeChangedCallback(i,t,l){if(!(!this.isConnected||!this.ready)&&i==="disabled"){let e=l===""||l==="true";this.disabled=e}}});export{M as default};
