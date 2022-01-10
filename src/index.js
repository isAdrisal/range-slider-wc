import compiledStyles from 'sass:./styles.scss';

export default customElements.define(
  'range-slider',
  class RangeSlider extends HTMLElement {
    static get observedAttributes() {
      return ['disabled'];
    }

    get min() {
      return this._min;
    }

    set min(value) {
      const valueAsNumber = Number(value);
      this._min = valueAsNumber;
      this.setAttribute('min', valueAsNumber);
      this._setInputProperty(this._minInput, 'min', valueAsNumber);
      this._setInputProperty(this._maxInput, 'min', valueAsNumber);
    }

    get max() {
      return this._max;
    }

    set max(value) {
      const valueAsNumber = Number(value);
      this._max = valueAsNumber;
      this.setAttribute('max', valueAsNumber);
      this._setInputProperty(this._minInput, 'max', valueAsNumber);
      this._setInputProperty(this._maxInput, 'max', valueAsNumber);
    }

    get step() {
      return this._step;
    }

    set step(value) {
      this._step = value;
      this.setAttribute('step', value);
      this._setInputProperty(this._minInput, 'step', value);
      this._setInputProperty(this._maxInput, 'step', value);
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      if (typeof value !== 'boolean') return;
      this._disabled = value;
      this._minInput.disabled = value;
      this._maxInput.disabled = value;
      if (value === true) {
        const disabledAttr = this.getAttribute('disabled');
        if (disabledAttr !== '' && disabledAttr !== 'true') {
          this.setAttribute('disabled', '');
        }
      } else {
        this.removeAttribute('disabled');
      }
    }

    get valueMin() {
      return this._valueMin;
    }

    set valueMin(value) {
      let valueAsNumber = Number(value);
      if (valueAsNumber === this.valueMin) return;
      if (valueAsNumber < this.min) {
        valueAsNumber = this.min;
      }
      this._valueMin = valueAsNumber;
      this.setAttribute('valueMin', valueAsNumber);
      this._setInputProperty(this._minInput, 'value', valueAsNumber);
      this.midpoint = (this.valueMax - this.valueMin) / 2 + this.valueMin;

      if (this.ready) {
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              min: this.min,
              max: this.max,
              step: this.step,
              valueMin: this.valueMin,
              valueMax: this.valueMax,
            },
          })
        );
      }
    }

    get valueMax() {
      return this._valueMax;
    }

    set valueMax(value) {
      let valueAsNumber = Number(value);
      if (valueAsNumber === this.valueMax) return;
      if (valueAsNumber > this.max) {
        valueAsNumber = this.max;
      }
      this._valueMax = valueAsNumber;
      this.setAttribute('valueMax', valueAsNumber);
      this._setInputProperty(this._maxInput, 'value', valueAsNumber);
      this.midpoint = (this.valueMax - this.valueMin) / 2 + this.valueMin;

      if (this.ready) {
        this.dispatchEvent(
          new CustomEvent('change', {
            detail: {
              min: this.min,
              max: this.max,
              step: this.step,
              valueMin: this.valueMin,
              valueMax: this.valueMax,
            },
          })
        );
      }
    }

    get midpoint() {
      return this._midpoint;
    }

    set midpoint(value) {
      this._midpoint = Number(value);
    }

    constructor() {
      super();

      const shadowRoot = this.attachShadow({mode: 'open'});

      const template = document.createElement('template');
      template.innerHTML =
        '<div part="container"><input part="min-input" type="range"><input part="max-input" type="range"></div>';

      const style = document.createElement('style');
      style.innerHTML = compiledStyles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(template.content.cloneNode(true));

      this._init = () => {
        this._container = this.shadowRoot.querySelector('[part="container"]');
        this._minInput = this.shadowRoot.querySelector('[part="min-input"]');
        this._maxInput = this.shadowRoot.querySelector('[part="max-input"]');
        this._inputs = [this._minInput, this._maxInput];

        const minAttr = this.getAttribute('min');
        const maxAttr = this.getAttribute('max');
        if (!minAttr || !maxAttr) {
          this.shadowRoot.innerHTML = '';
          return;
        }

        this.min = Number(minAttr);
        this.max = Number(maxAttr);
        if (isNaN(this.min) || isNaN(this.max)) {
          this.shadowRoot.innerHTML = '';
          return;
        }

        const valueMinAttr = this.getAttribute('valueMin');
        const valueMaxAttr = this.getAttribute('valueMax');
        const stepAttr = this.getAttribute('step');
        const valueMinNum = Number(valueMinAttr);
        const valueMaxNum = Number(valueMaxAttr);
        const stepNum = Number(stepAttr);
        this.valueMin = valueMinAttr && !isNaN(valueMinNum) ? valueMinNum : this.min;
        this.valueMax = valueMaxAttr && !isNaN(valueMaxNum) ? valueMaxNum : this.max;
        this.step = stepAttr && !isNaN(stepNum) ? stepNum : 1;
        this.midpoint = (this.valueMax - this.valueMin) / 2 + this.valueMin;

        const disabledAttr = this.getAttribute('disabled');
        const setDisabled = disabledAttr === '' || disabledAttr === 'true';
        this.disabled = setDisabled;

        this._inputs.forEach((input, index) => {
          this._setInputProperty(input, 'min', this.min);
          this._setInputProperty(input, 'max', this.max);
          this._setInputProperty(input, 'step', this.step);
          this._setInputProperty(input, 'value', index === 0 ? this.valueMin : this.valueMax);

          input.addEventListener('change', this._handleChange);
          input.addEventListener('input', this._handleChange);
          input.addEventListener('touchstart', this._handlePointerDown);
        });

        this._container.addEventListener('mousedown', this._handleSyntheticTrackClick);
        this._container.addEventListener('click', this._handleSyntheticTrackClick);
        this.addEventListener('mouseup', this._handlePointerUp);
        this.addEventListener('touchend', this._handlePointerUp);

        this.ready = true;
        this.dispatchEvent(
          new CustomEvent('ready', {
            detail: {
              min: this.min,
              max: this.max,
              step: this.step,
              valueMin: this.valueMin,
              valueMax: this.valueMax,
            },
          })
        );
      };

      this._setInputProperty = (input, property, value) => {
        input[property] = value;

        const styleValue = property === 'value' ? input.valueAsNumber : value;
        input.style.setProperty(`--${property}`, styleValue);

        if (input.part.value === 'max-input' && property === 'value') {
          input.dataset.atMin = value === this.min;
        }
      };

      this._handleChange = (evt) => {
        evt.stopPropagation();
        const target = evt.target;
        const isMinInput = target.part.value === 'min-input';
        const inputValue = target.valueAsNumber;
        const newValue = isMinInput ? Math.min(inputValue, this.valueMax) : Math.max(inputValue, this.valueMin);

        this._setInputProperty(target, 'value', newValue);
        const detail = {
          min: this.min,
          max: this.max,
          step: this.step,
          valueMin: isMinInput ? newValue : this.valueMin,
          valueMax: isMinInput ? this.valueMax : newValue,
        };
        this.dispatchEvent(new CustomEvent('input', {detail}));

        if (evt.type !== 'change') return;

        this._setInputProperty(target, 'value', newValue);
        isMinInput ? (this.valueMin = newValue) : (this.valueMax = newValue);
      };

      this._syntheticClickHandled = false;
      this._handleSyntheticTrackClick = (evt) => {
        evt.stopPropagation();
        if (evt.type === 'click' && this._syntheticClickHandled) {
          this._syntheticClickHandled = false;
          return;
        }
        if (evt.type === 'mousedown') {
          this._syntheticClickHandled = true;
        }

        const offsetX = evt.offsetX === 0 && evt.offsetY === 0 ? evt.layerX - evt.target.offsetLeft : evt.offsetX;
        const offsetRatio = offsetX / evt.target.offsetWidth;
        const midpointRatio = (this.midpoint - this.min) / (this.max - this.min);
        const newValue = offsetRatio * (this.max - this.min) + this.min;
        const isMinInput = offsetRatio < midpointRatio;
        const target = isMinInput ? this._minInput : this._maxInput;

        this._setInputProperty(target, 'value', newValue);
        const detail = {
          min: this.min,
          max: this.max,
          step: this.step,
          valueMin: isMinInput ? target.valueAsNumber : this.valueMin,
          valueMax: isMinInput ? this.valueMax : target.valueAsNumber,
        };
        this.dispatchEvent(new CustomEvent('input', {detail}));

        isMinInput ? (this.valueMin = target.valueAsNumber) : (this.valueMax = target.valueAsNumber);
      };

      this._handlePointerDown = (evt) => {
        const path = evt.path ? evt.path : evt.composedPath();
        if (!Array.isArray(path) || Array.length < 1) return;
        const input = path[0];
        input.focus();
      };

      this._handlePointerUp = (evt) => {
        this.blur();
        this._minInput.blur();
        this._maxInput.blur();
      };
    }

    connectedCallback() {
      if (!this.isConnected) return;
      this._init();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (!this.isConnected || !this.ready) return;
      if (name === 'disabled') {
        const setDisabled = newValue === '' || newValue === 'true';
        this.disabled = setDisabled;
      }
    }
  }
);
