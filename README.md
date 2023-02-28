<div align="center">
<img width="135" height="95" title="Philosopher’s stone, logo of PostCSS" src="https://postcss.org/logo-leftp.svg">
<h1>PostCSS Modular Type</h1>
</div>

A [PostCSS](https://github.com/postcss) plugin to generate modular type scales, inspired by [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/).

# Getting Started

## Installation

```bash
# npm
npm install postcss-modular-type --save-dev

# or yarn
yarn add -D postcss-modular-type

# or pnpm
pnpm add -D postcss-modular-type
```

## Usage

Add the plugin to your `postcss.config.js`:

```javascript
// postcss.config.js
module.exports = {
  plugins: [require("postcss-modular-type")],
};
```

### Input

```css
:root {
  /* postcss-modular-type-generate */
}
```

### Output

```css
:root {
  --font-size--2: clamp(0.69rem,  0.01vw + 0.69rem , 0.70rem);
  --font-size--1: clamp(0.83rem,  0.14vw + 0.81rem , 0.94rem);
  --font-size-0: clamp(1.00rem,  0.33vw + 0.93rem , 1.25rem);
  --font-size-1: clamp(1.20rem,  0.61vw + 1.08rem , 1.67rem);
  --font-size-2: clamp(1.44rem,  1.03vw + 1.23rem , 2.22rem);
  --font-size-3: clamp(1.73rem,  1.62vw + 1.40rem , 2.96rem);
  --font-size-4: clamp(2.07rem,  2.46vw + 1.58rem , 3.95rem);
  --font-size-5: clamp(2.49rem,  3.65vw + 1.76rem , 5.26rem)}
}
```

## Configuration

The plugin comes with default configuration but it is possible to customise pretty much all config options to your liking.

### Default configuration

```javascript
module.exports = {
  plugins: [
    require("postcss-modular-type")({
      minScreenWidth: 320,
      maxScreenWidth: 1536,
      minFontSize: 16,
      maxFontSize: 20,
      minRatio: 1.2,
      maxRatio: 1.333,
      minStep: 2,
      maxStep: 5,
      precision: 2,
      prefix: "font-size-",
      rootFontSize: 16,
      suffixtype: "numbered",
      suffixValues: ["xs", "sm", "base", "md", "lg", "xl", "xxl", "xxxl"],
      unit: "rem",
      replaceInline: false,
      generatorDirective: "postcss-modular-type-generate",
    }),
  ],
};
```

### Options

- `minScreenWidth`: Minimum (mobile) screen width that the font scales to.
- `maxScreenWidth`: Maximum (desktop) screen width that the font scales to.
- `minFontSize`: Minimum font size. Generated font size won't go below this size. This is also your base font size for minimum (mobile) screen width specified.
- `maxFontSize`: Maximum font size allowed. Font size won't go above this size on maximum (desktop) screen width specified.
- `minRatio` / `maxRatio`: Font scaling ratio for minimum/maximum screen width. Could be one of the ratio given below or a custom one.
  - 1.067 - _Minor Second_
  - 1.125 - _Major Second_
  - 1.200 - _Minor Third_
  - 1.250 - _Major Third_
  - 1.333 - _Perfect Fourth_
  - 1.414 - _Augmented Fourth_
  - 1.500 - _Perfect Fifth_
  - 1.618 - _Golden Ratio_
- `minStep` / `maxStep`: Minimum/Maximum steps of font scales to produce (excluding base font size). So, if you set `minStep` to `2` and `maxStep` to `5`, it'll generate `8` font scales variables (`minStep` + `maxStep` + 1).
- `rootFontSize`: Root font size.
- `precision`: Precision of generated font values.
- `prefix`: Prefix for generated font variables.
- `suffixType`: Suffix to use for generated font scales. Could be one of:
  - `numbered`: Generated font variables will have the format of `${prefix}${number}`. For example, with default configuration, it'll generate variables as: `--font-size--1`, `--font-size-0`, `--font-size-2` etc.
  - `values`: Generated font variables will have the format of `${prefix}${suffixValues[fontStep]}`. For example, if `suffixType` is set to `values`, it'll generate variables with suffix from `suffixValues` config option: `--font-size-sm`, `--font-size-base`, `--font-size-md`, etc.
- `suffixValues`: Array of suffix for each step in your type scale, in ascending order of font size. Will be used if `suffixType` is set to `values`.
- `unit`: Unit of output CSS.
- `replaceInline`: Whether to replace font variables inline.
- `generatorDirective`: Generator directive string. Adding this string (as a comment) in any CSS selector will replace it with generated font variables. Requires `replaceInline` to be disabled.

## Replacing font variables inline

Although it is recommended to include all font variables using `generatorDirective` inside your `:root {}` selector so that you can access them globally, however, if you prefer to replace them inline you can do so by enabling `replaceInline`:

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require("postcss-modular-type")({
      replaceInline: true,
    }),
  ],
};
```

### Input

```css
/* other styles */
button {
  font-size: var(--font-size-1);
}
```

### Output

```css
/* other styles */
button {
  font-size: clamp(1.2rem, 0.61vw + 1.08rem, 1.67rem);
}
```

# Acknowledgments

This plugin is mostly inspired by [this blog post](https://www.aleksandrhovhannisyan.com/blog/fluid-type-scale-with-css-clamp/) by [Aleksandr Hovhannisyan](https://github.com/AleksandrHovhannisyan).

Further resources:

- [Generating `font-size` CSS Rules and Creating a Fluid Type Scale](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
- [Flexible typography with CSS locks](https://blog.typekit.com/2016/08/17/flexible-typography-with-css-locks/)
- [UTOPIA](https://utopia.fyi/)
