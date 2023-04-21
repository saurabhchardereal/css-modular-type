export interface GeneratorOptions {
  /**
   * Viewport width of your font's baseline step on minimum (mobile) screens
   * widths.
   *
   * @default 320px
   */
  minScreenWidth: number;

  /**
   * Viewport width of your font's baseline step on maximum (desktop) screens
   * widths.
   *
   * @default 1536px
   */
  maxScreenWidth: number;

  /**
   * Minimum font size of your baseline step on minimum (mobile) screen widths.
   * The base font size won't go **below** this size when the viewport is at
   * `minScreenWidth` or below.
   *
   * @default 16px
   */
  minFontSize: number;

  /**
   * Maximum font size of your baseline step on maximum (desktop) screen widths.
   * The base font size won't go **above** this size when the viewport is at
   * `maxScreenWidth` or above.
   *
   * @default 20px
   */
  maxFontSize: number;

  /**
   * Font scaling ratio for minimum/maximum screen width. Could be one of the ratio given below or a custom one.
   *
   * - `1.067` (Minor Second)
   * - `1.125` (Major Second)
   * - `1.200` (Minor Third)
   * - `1.250` (Major Third)
   * - `1.333` (Perfect Fourth)
   * - `1.414` (Augmented Fourth)
   * - `1.500` (Perfect Fifth)
   * - `1.618` (Golden Ratio)
   *
   * @default 1.2
   */
  minRatio: number;

  /**
   * Font scaling ratio. See `minFontSize` for more details
   *
   * @default 1.333
   */
  maxRatio: number;

  /**
   * Minimum steps of font scales to produce (excluding your base font size on
   * minimum screen width). So, if you set `minStep` to `2` and `maxStep` to `5`,
   * it'll generate `8` font scales variables i.e, `minStep` + `maxStep` + `1` (base font size).
   *
   * @default 2
   */
  minStep: number;

  /**
   * Maximum steps of font scales to produce (excluding your base font size on
   * maximum screen width). So, if you set `minStep` to `1` and `maxStep` to `3`,
   * it'll generate `5` font scales variables i.e, `minStep` + `maxStep` + `1` (base font size).
   *
   * @default 5
   */
  maxStep: number;

  /**
   * Root font size (default is usually `16px` on all browsers).
   *
   * @default 16px
   */
  rootFontSize: number;

  /**
   * Precision of generated font values.
   *
   * @default 2
   */
  precision: number;

  /**
   * Prefix of generated font variables.
   *
   * @default 'font-size-'
   */
  prefix: string;

  /**
   * Suffix to use for generated font scales. Could be one of:
   *
   * - `numbered`: Generated font variables will have the format of `--${prefix}${number}`. For example, with default configuration, it'll generate variables as: `--font-size--1`, `--font-size-0`, `--font-size-2` etc.
   *
   * - `values`: Generated font variables will have the format of `--${prefix}${suffixValues[<font-step>]}`. For example, if `suffixType` is set to `values`, it'll generate variables with suffix from `suffixValues` config option, like: `--font-size-sm`, `--font-size-base`, `--font-size-md`, etc.
   *
   * @default "numbered"
   */
  suffixType: "numbered" | "values";

  /**
   * Array of suffix for each step in your type scale, in ascending order of
   * font size.
   *
   * @default ["xs", "sm", "base", "md", "lg", "xl", "xxl", "xxxl"]
   */
  suffixValues: string[];

  /**
   * Unit of output CSS.
   *
   * @default 'rem'
   */
  unit: "px" | "rem";

  /**
   * Whether to insert min and max font size as variables instead of inserting
   * them directly.
   *
   * @default false
   */
  insertMinMaxFontAsVariables: boolean;
}

export type PostcssOpts = GeneratorOptions & {
  /**
   * Whether to replace font variables inline or not.
   *
   * @default false
   */
  replaceInline: boolean;

  /**
   * Generator directive string. Adding this string (as comment) in any CSS
   * selector will replace it with generated font variables. Requires
   * `replaceInline` to be disabled.
   *
   * @default "postcss-modular-type-generate"
   */
  generatorDirective: string;
};

export type _defaultConfigOptions = GeneratorOptions & PostcssOpts;
