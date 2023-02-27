import type { PluginCreator } from "postcss";
import valueParser from "postcss-value-parser";

type Config = {
  /**
   * Minimum screen width that the font scales to.
   * @default 320px
   */
  minScreenWidth: number;

  /**
   * Maximum screen width that the font scales to.
   * @default 1536px
   */
  maxScreenWidth: number;

  /**
   * Minimum font size allowed. Font size won't go below this size
   * @default 16px
   */
  minFontSize: number;

  /**
   * Maximum font size allowed. Font size won't go above this size
   * @default 20px
   */
  maxFontSize: number;

  /**
   * Font scaling ratio. Could be one of the ratio given below or a custom one.
   *
   * Minor Second = 1.067
   * Major Second = 1.125
   * Minor Third = 1.200
   * Major Third = 1.250
   * Perfect Fourth = 1.333
   * Augmented Fourth = 1.414
   * Perfect Fifth = 1.500
   * Golden Ratio = 1.618
   *
   * @default 1.2
   */
  minRatio: number;

  /**
   * Font scaling ratio. See `minFontSize` for more details
   * @default 1.333
   */
  maxRatio: number;

  /**
   * Minimum steps of font scales to produce (excluding base font size)
   * @default 2
   */
  minStep: number;

  /**
   * Maximum steps of font scales to produce (excluding base font size)
   * @default 5
   */
  maxStep: number;

  /**
   * Root font size
   * @default 16px
   */
  rootFontSize: number;

  /**
   * Font values precision
   * @default 2
   */
  precision: number;

  /**
   * Prefix for font variables
   * @default 'font-size-'
   */
  prefix: string;

  /**
   * Suffix to use for generated font scales.
   *
   * `numbered` = use numbered suffix (eg. `--font-size-1`, `--font-size-2`)
   * `values` = use suffixes from values array (eg. `--font-size-sm`, `--font-size-xl`)
   *
   * @default numbered
   */
  suffix: "numbered" | "values";

  /**
   * Array of suffix for each step in your type scale, in ascending order of
   * font size.
   * @default ["xs", "sm", "base", "md", "lg", "xl", "xxl", "xxxl"]
   */
  values: string[];

  /**
   * Output unit
   */
  unit: "px" | "rem";

  /**
   * Whether to replace font variables inline or not.
   */
  replaceInline: boolean;

  /**
   * Generator directive string. Adding this string (as comment) in any CSS
   * selector will replace it with generated font variables. Requires
   * `replaceInline` to be disabled.
   */
  generatorDirective: string;
};

const defaultConfig: Config = {
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
  suffix: "numbered",
  values: ["xs", "sm", "base", "md", "lg", "xl", "xxl", "xxxl"],
  unit: "rem",
  replaceInline: false,
  generatorDirective: "postcss-modular-type-generate",
};

const plugin: PluginCreator<Config> = (opts: Partial<Config> = {}) => {
  const resolvedOptions = Object.assign(defaultConfig, opts);
  let {
    minScreenWidth,
    maxScreenWidth,
    minFontSize,
    maxFontSize,
    minRatio,
    maxRatio,
    minStep,
    maxStep,
    precision,
    prefix,
    rootFontSize,
    suffix,
    values,
    unit,
    replaceInline,
    generatorDirective,
  } = resolvedOptions;
  const stepsMap = new Map();
  const baseIndex = maxStep - minStep - 1;
  const toRem = (pxValue: number) => pxValue / rootFontSize;

  // If the user hasn't provided sufficient suffixes to map to total steps
  // throw an error
  if (suffix === "values" && values.length <= maxStep + minStep) {
    throw new Error(
      "Insufficient suffixes passed.\n" +
        `Number of steps: ${minStep}(minstep) + ${maxStep}(maxStep) + 1(baseStep) = ${
          minStep + maxStep + 1
        }\n` +
        `Number of suffixes: ${values.length}\n` +
        `Current suffix list: ${values}\n`
    );
  }

  if (unit === "rem") {
    minScreenWidth = toRem(minScreenWidth);
    maxScreenWidth = toRem(maxScreenWidth);
    minFontSize = toRem(minFontSize);
    maxFontSize = toRem(maxFontSize);
  }

  for (let step = 0; step <= maxStep + minStep; step++) {
    const power = step - baseIndex; // power to raise ratio to
    const minStepRatio = Math.pow(minRatio, power);
    const maxStepRatio = Math.pow(maxRatio, power);

    const fsMinSize = minFontSize * minStepRatio;
    const fsMaxSize = maxFontSize * maxStepRatio;

    const slope = (fsMaxSize - fsMinSize) / (maxScreenWidth - minScreenWidth);
    const yIntersect = (fsMinSize - slope * minScreenWidth).toFixed(precision);
    const slopeVw = (slope * 100).toFixed(precision);
    const fsMinFinal = `${fsMinSize.toFixed(precision)}${unit}`;
    const fsMaxFinal = `${fsMaxSize.toFixed(precision)}${unit}`;

    let key =
      suffix === "values"
        ? `--${prefix}${values[step]}`
        : `--${prefix}${power}`;
    const value = `clamp(${fsMinFinal},  ${slopeVw}vw + ${yIntersect}${unit} , ${fsMaxFinal})`;

    stepsMap.set(key, value);
  }

  return {
    postcssPlugin: "postcss-modular-type",
    Rule(rule, { Declaration }) {
      if (replaceInline) return;

      rule.walkComments((cmt) => {
        if (cmt.text === generatorDirective) {
          const fontVars = [];
          for (const [key, value] of stepsMap) {
            fontVars.push(new Declaration({ prop: key, value: value }));
          }
          cmt.replaceWith(fontVars);
        }
      });
    },
    Declaration(decl) {
      if (replaceInline && decl.value.includes(prefix)) {
        const parsed = valueParser(decl.value);

        parsed.walk((valueNode) => {
          // CSS variables is declared as a `word` node in `postcss-value-parser`
          if (valueNode.type !== "word") return;

          if (stepsMap.has(valueNode.value)) {
            decl.value = stepsMap.get(valueNode.value);
          }
        });
      }
    },
  };
};

plugin.postcss = true;
export = plugin;
