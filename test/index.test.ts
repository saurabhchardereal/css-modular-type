import assert from "node:assert/strict";
import { readFileSync /*, writeFileSync */ } from "node:fs";
import path from "node:path";
import process from "node:process";
import postcss from "postcss";
import { PostcssOpts } from "../src/types";
import postcssPlugin from "../src/postcss";
import tailwind from "tailwindcss";
import tailwindPlugin from "../src/tailwind";

type Tail<T extends any[]> = T extends [any, ...infer Tail] ? Tail : never;
type WithoutFirstParam<T extends (...args: any) => any> = Tail<Parameters<T>>;

function filename(name: string) {
  return path.join(process.cwd(), "test/fixtures", name);
}

function processCss(
  plugin: typeof postcssPlugin | typeof tailwind,
  from: string,
  pluginOpts?: any
) {
  if (plugin.name === "tailwindcss") {
    const { content, ...restProp } = pluginOpts;
    pluginOpts = {
      corePlugins: { preflight: false },
      plugins: [tailwindPlugin(restProp)],
      content: [{ raw: String.raw`${content}` }],
    };
  }

  return postcss([plugin(pluginOpts)]).process(readFileSync(from, "utf8"), {
    from,
  });
}

function assertCss(
  plugin: typeof postcssPlugin | typeof tailwind,
  inputFilename: string,
  outputFile: string | undefined,
  pluginOpts?: Partial<PostcssOpts> & { content?: string },
  message?: string
) {
  const from = filename(inputFilename) + ".css";
  const actual = processCss(plugin, from, pluginOpts);
  let expected = "";
  if (outputFile) {
    expected = readFileSync(filename(outputFile), "utf8");
    // writeFileSync(filename(outputFile) + ".actual.css", actual.css);
  } else {
    expected = readFileSync(filename(inputFilename) + ".expected.css", "utf8");
    // writeFileSync(filename(inputFilename) + ".actual.css", actual.css);
  }
  assert.equal(actual.css.trim(), expected.trim(), message);
  assert.equal(actual.warnings().length, 0);
}

function assertPostcss(...args: WithoutFirstParam<typeof assertCss>) {
  return assertCss(postcssPlugin, ...args);
}

function assertTailwind(...args: WithoutFirstParam<typeof assertCss>) {
  return assertCss(tailwind, ...args);
}

function assertPostcssThrows(
  inputFilename: string,
  pluginOpts?: Partial<PostcssOpts>,
  message?: string
) {
  const from = filename(inputFilename) + ".css";
  assert.throws(() => processCss(postcssPlugin, from, pluginOpts), message);
}

assertTailwind(
  "tailwind",
  undefined,
  { content: "" },
  "To replace @apply utility"
);

assertTailwind(
  "tailwind-custom-suffix",
  undefined,
  {
    content:
      "<div class='text-fluid-0'></div><span class='text-fluid-5'></span>",
    suffixType: "numbered",
  },
  "To add utility with custom suffix values"
);

assertTailwind(
  "tailwind-custom-suffix",
  "tailwind-custom-suffix-extended.expected.css",
  {
    content:
      "<div class='text-fluid-2xs'></div><span class='text-fluid-4xl'></span>",
    minStep: 3,
    maxStep: 6,
    suffixValues: (values) => ["2xs", ...values, "4xl"],
  },
  "To add utility with custom extended suffix values"
);

assertTailwind(
  "tailwind-html-utility",
  undefined,
  {
    prefix: "scale-",
    suffixType: "numbered",
    content: "<div class='text-scale-0'></div>",
  },
  "To add utility at the top of css with custom prefix and suffixType"
);

assertPostcss(
  "rule-default",
  undefined,
  {
    replaceInline: true,
  },
  "Replace default inline"
);

assertPostcss(
  "rule-default",
  "rule-with-px-unit.expected.css",
  { unit: "px", replaceInline: true },
  "Replace with px values"
);

assertPostcss(
  "rule-default",
  "rule-with-precision-0.expected.css",
  {
    replaceInline: true,
    precision: 0,
  },
  "Replace with precision 0"
);

assertPostcss(
  "rule-with-values-prefix",
  "rule-default.expected.css",
  {
    replaceInline: true,
    suffixType: "values",
  },
  "Replace with suffix type"
);

assertPostcss(
  "rule-custom-prefix",
  "rule-default.expected.css",
  {
    replaceInline: true,
    prefix: "step-",
  },
  "Replace with custom prefix"
);

assertPostcss(
  "rule-generator-directive",
  undefined,
  {},
  "Replace with px values"
);

assertPostcss(
  "rule-generator-directive",
  "rule-generator-directive.css",
  {
    replaceInline: true,
  },
  "Should not replace generative directive"
);

assertPostcss(
  "rule-generator-directive-custom",
  "rule-generator-directive.expected.css",
  {
    generatorDirective: "generate-font-vars",
  },
  "Should replace custom generative directive"
);

assertPostcss(
  "rule-generator-directive",
  "rule-min-max-vars.expected.css",
  {
    insertMinMaxFontAsVariables: true,
  },
  "Should insert min and max font vars"
);

assertPostcssThrows(
  "rule-generator-directive",
  {
    suffixType: "values",
    suffixValues: ["xs", "base"],
  },
  "Throws due to insufficient suffixValues"
);

assertPostcssThrows(
  "rule-generator-directive",
  {
    minStep: -1,
  },
  "Throws due to negative minStep"
);
