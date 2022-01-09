# range-slider-wc

A dependency-free, two-thumb range input slider built with Web Components.

View demo on [Code Pen](https://codepen.io/isadrisal/pen/YzrQxqr).

## Installation

If using a bundler like Webpack or ESBuiild, install using your favourite package manager:

```shell
$ yarn add range-slider-wc
```

then import into your project:

```js
import rangeSlider from 'range-slider-wc';
```

Or, import directly into your HTML as a module script:

```html
<script type="module" src="https://cdn.skypack.dev/range-slider-wc"></script>
```

## Usage

This slider uses the browser-native Web Components APIs to create a Custom Element, `<range-slider>`.

To use, simply include the custom element as you would a regular HTML tag:

```html
<range-slider class="example" min="0" max="100" step="1"></range-slider>
```

### API

This component replicates many of the same APIs as the HTML `input[type="range"]` element:

```js
const slider = document.querySelector('range-slider');

// Disable or enable the slider
slider.disabled = true;
slider.disabled = false;

// Disabled can also be set using the attribute
slider.setAttribute('disabled', '');
slider.setAttribute('disabled', 'false');

// Change the `min` or `max` values
slider.min = 10;
slider.max = 150;

// Set the `valueMin` or `valueMax`
slider.valueMin = 5;
slider.valueMax = 50;

// Check that the slider has initialised
slider.ready; // boolean
```

### Events

The slider emits three types of events that use the standard `EventListener` interface:

```js
const slider = document.querySelector('range-slider');

// Ready – fired when the slider is initialised
slider.addEventListener('ready', (evt) => console.log('Slider ready', evt.detail));

// Input – fired when either slider thumb is moved
slider.addEventListener('input', (evt) => console.log('Input', evt.detail));

// Change – fired after the slider thumb movement has been committed (un-focused)
slider.addEventListener('change', (evt) => console.log('Change', evt.detail));
```

> Note: as with the native `input[type="range"]`, `input` events are not fired when `valueMin` or `valueMax` are set via the JS API. `change` events will be fired in those cases as expected.

For all three event types, `Event.detail` returns an object with the following interface:

```js
{
  min: Number,
  max: Number,
  step: Number,
  valueMin: Number,
  valueMax: Number,
}
```

## Styling

By default, the slider attempts to replicate the Google Chrome range input styling. CSS variables make it easy to override these default styles to match your preferred design.

An example stylesheet is shown below with default values:

```css
.example {
  display: inline-block;
  margin: 2px;
  width: 129px;
  --track-height: 0.5rem;
  --thumb-diameter: 1rem;
  --track-color: rgb(239, 239, 239);
  --track-color-active: rgb(229, 229, 229);
  --track-color-disabled: rgb(250, 250, 250);
  --progress-color: rgb(0, 117, 255);
  --progress-color-active: rgb(0, 92, 200);
  --progress-color-disabled: rgb(203, 203, 203);
  --thumb-color: rgb(0, 117, 255);
  --thumb-color-active: rgb(0, 92, 200);
  --thumb-color-disabled: rgb(203, 203, 203);
  --thumb-halo-color: rgba(0, 92, 200, 0.1);
  --thumb-halo-size: 0.425rem;
  --focus-outline: 1px solid black;
  --focus-outline-offset: 0px;
  --transition-duration: 100ms;
  --transition-timing-function: ease-in;
}
```
