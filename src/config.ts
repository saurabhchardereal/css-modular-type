import { GeneratorOptions } from "./types";

export const defaultGeneratorConfig: GeneratorOptions = {
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
  suffixType: "numbered",
  suffixValues: ["xs", "sm", "base", "md", "lg", "xl", "xxl", "xxxl"],
  unit: "rem",
  insertMinMaxFontAsVariables: false,
};

export const defaultPostcssConfig = {
  ...defaultGeneratorConfig,
  replaceInline: false,
  generatorDirective: "postcss-modular-type-generate",
};
