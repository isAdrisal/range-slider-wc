import compiledStyles from 'sass:./styles.scss';

export default customElements.define(
  'range-slider',
  class RangeSlider extends HTMLElement {
    static get observedAttributes() {
      return ['disabled'];
    }

    #min;
    #max;
    #step;
    #disabled;
    #valueMin;
    #valueMax;
    #midpoint;
    #container;
    #minInput;
    #maxInput;
    #inputs;

    get min() {
      return this.#min;
    }

    set min(value) {
      const valueAsNumber = Number(value);
      this.#min = valueAsNumber;
      this.setAttribute('min', valueAsNumber);
      this.#setInputProperty(this.#minInput, 'min', valueAsNumber);
      this.#setInputProperty(this.#maxInput, 'min', valueAsNumber);
    }

    get max() {
      return this.#max;
    }

    set max(value) {
      const valueAsNumber = Number(value);
      this.#max = valueAsNumber;
      this.setAttribute('max', valueAsNumber);
      this.#setInputProperty(this.#minInput, 'max', valueAsNumber);
      this.#setInputProperty(this.#maxInput, 'max', valueAsNumber);
    }

    get step() {
      return this.#step;
    }

    set step(value) {
      this.#step = value;
      this.setAttribute('step', value);
      this.#setInputProperty(this.#minInput, 'step', value);
      this.#setInputProperty(this.#maxInput, 'step', value);
    }

    get disabled() {
      return this.#disabled;
    }

    set disabled(value) {
      if (typeof value !== 'boolean') return;
      this.#disabled = value;
      this.#minInput.disabled = value;
      this.#maxInput.disabled = value;
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
      return this.#valueMin;
    }

    set valueMin(value) {
      let valueAsNumber = Number(value);
      if (valueAsNumber === this.valueMin) return;
      if (valueAsNumber < this.min) {
        valueAsNumber = this.min;
      }
      this.#valueMin = valueAsNumber;
      this.setAttribute('valueMin', valueAsNumber);
      this.#setInputProperty(this.#minInput, 'value', valueAsNumber);
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
      return this.#valueMax;
    }

    set valueMax(value) {
      let valueAsNumber = Number(value);
      if (valueAsNumber === this.valueMax) return;
      if (valueAsNumber > this.max) {
        valueAsNumber = this.max;
      }
      this.#valueMax = valueAsNumber;
      this.setAttribute('valueMax', valueAsNumber);
      this.#setInputProperty(this.#maxInput, 'value', valueAsNumber);
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
      return this.#midpoint;
    }

    set midpoint(value) {
      this.#midpoint = Number(value);
    }

    constructor() {
      super();

      const shadowRoot = this.attachShadow({mode: 'open'});

      const template = document.createElement('template');
      template.innerHTML =
        '<div part="container"><input type="range" data-input="min"><input type="range" data-input="max"></div>';

      const style = document.createElement('style');
      style.innerHTML = compiledStyles;
      shadowRoot.appendChild(style);
      shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      if (!this.isConnected) return;
      this.#init();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (!this.isConnected || !this.ready) return;
      if (name === 'disabled') {
        const setDisabled = newValue === '' || newValue === 'true';
        this.disabled = setDisabled;
      }
    }

    #init = () => {
      this.#container = this.shadowRoot.querySelector('[part="container"]');
      this.#minInput = this.shadowRoot.querySelector('[data-input="min"]');
      this.#maxInput = this.shadowRoot.querySelector('[data-input="max"]');
      this.#inputs = [this.#minInput, this.#maxInput];

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

      this.#inputs.forEach((input, index) => {
        this.#setInputProperty(input, 'min', this.min);
        this.#setInputProperty(input, 'max', this.max);
        this.#setInputProperty(input, 'step', this.step);
        this.#setInputProperty(input, 'value', index === 0 ? this.valueMin : this.valueMax);

        input.addEventListener('change', this.#handleChange);
        input.addEventListener('input', this.#handleChange);
        input.addEventListener('touchstart', this.#handlePointerDown);
      });

      this.#container.addEventListener('mousedown', this.#handleSyntheticTrackClick);
      this.#container.addEventListener('click', this.#handleSyntheticTrackClick);
      this.addEventListener('mouseup', this.#handlePointerUp);
      this.addEventListener('touchend', this.#handlePointerUp);

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

    #setInputProperty = (input, property, value) => {
      input[property] = value;

      const styleValue = property === 'value' ? input.valueAsNumber : value;
      input.style.setProperty(`--${property}`, styleValue);

      if (input.dataset.input === 'max' && property === 'value') {
        input.dataset.atMin = value === this.min;
      }
    };

    #handleChange = (evt) => {
      evt.stopPropagation();
      const target = evt.target;
      const isMinInput = target.dataset.input === 'min';
      const inputValue = target.valueAsNumber;
      const newValue = isMinInput ? Math.min(inputValue, this.valueMax) : Math.max(inputValue, this.valueMin);

      this.#setInputProperty(target, 'value', newValue);
      const detail = {
        min: this.min,
        max: this.max,
        step: this.step,
        valueMin: isMinInput ? newValue : this.valueMin,
        valueMax: isMinInput ? this.valueMax : newValue,
      };
      this.dispatchEvent(new CustomEvent('input', {detail}));

      if (evt.type !== 'change') return;

      this.#setInputProperty(target, 'value', newValue);
      isMinInput ? (this.valueMin = newValue) : (this.valueMax = newValue);
    };

    #syntheticClickHandled = false;
    #handleSyntheticTrackClick = (evt) => {
      if (evt.button !== 0) return;
      evt.stopPropagation();
      if (evt.type === 'click' && this.#syntheticClickHandled) {
        this.#syntheticClickHandled = false;
        return;
      }
      if (evt.type === 'mousedown') {
        this.#syntheticClickHandled = true;
      }

      const offsetX = evt.offsetX === 0 && evt.offsetY === 0 ? evt.layerX - evt.target.offsetLeft : evt.offsetX;
      const offsetRatio = offsetX / evt.target.offsetWidth;
      const midpointRatio = (this.midpoint - this.min) / (this.max - this.min);
      const newValue = offsetRatio * (this.max - this.min) + this.min;
      const isMinInput = offsetRatio < midpointRatio;
      const target = isMinInput ? this.#minInput : this.#maxInput;

      this.#setInputProperty(target, 'value', newValue);
      const detail = {
        min: this.min,
        max: this.max,
        step: this.step,
        valueMin: isMinInput ? target.valueAsNumber : this.valueMin,
        valueMax: isMinInput ? this.valueMax : target.valueAsNumber,
      };
      this.dispatchEvent(new CustomEvent('input', {detail}));
    };

    #handlePointerDown = (evt) => {
      const path = evt.path ? evt.path : evt.composedPath();
      if (!Array.isArray(path) || Array.length < 1) return;
      const input = path[0];
      input.focus();
    };

    #handlePointerUp = (evt) => {
      this.blur();
      this.#minInput.blur();
      this.#maxInput.blur();
      this.valueMin = this.#minInput.valueAsNumber;
      this.valueMax = this.#maxInput.valueAsNumber;
    };
  }
);
