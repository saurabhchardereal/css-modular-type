import assert from "node:assert/strict";
import { readFileSync /*, writeFileSync */ } from "node:fs";
import postcss from "postcss";
import { PostcssOpts } from "../src/types";

function process(from: string, pluginOpts?: Partial<PostcssOpts>) {
  return postcss([require("../src/postcss")(pluginOpts)]).process(
    readFileSync(from, "utf8"),
    { from }
  );
}

function filename(name: string) {
  return __dirname + "/../../test/fixtures/" + name;
}

function assertPostcss(
  inputFilename: string,
  outputFile: string | undefined,
  pluginOpts?: Partial<PostcssOpts>,
  message?: string
) {
  const from = filename(inputFilename) + ".css";
  const actual = process(from, pluginOpts);
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

function assertPostcssThrows(
  inputFilename: string,
  pluginOpts?: Partial<PostcssOpts>,
  message?: string
) {
  const from = filename(inputFilename) + ".css";
  assert.throws(() => process(from, pluginOpts), message);
}

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
