import { GeneratorOpts, PostcssOpts, TailwindOpts } from "./types";

export const defaultGeneratorConfig = {
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
  suffixValues: ["xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl"],
  unit: "rem",
  insertMinMaxFontAsVariables: false,
} satisfies GeneratorOpts;

export const defaultPostcssConfig: PostcssOpts = {
  ...defaultGeneratorConfig,
  replaceInline: false,
  generatorDirective: "css-modular-type-generate",
};

export const defaultTailwindConfig: TailwindOpts = {
  ...defaultGeneratorConfig,
  prefix: "fluid-",
  suffixType: "values",
};
