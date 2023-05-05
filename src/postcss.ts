import type { PluginCreator } from "postcss";
import valueParser from "postcss-value-parser";
import { defaultPostcssConfig } from "./config";
import generateFontScales from "./generateFontScales";
import { PostcssOpts } from "./types";

const plugin: PluginCreator<Partial<PostcssOpts>> = (opts = {}) => {
  const resolvedOptions = { ...defaultPostcssConfig, ...opts };
  const { prefix, replaceInline, generatorDirective } = resolvedOptions;
  const stepsMap = generateFontScales(resolvedOptions);
  return {
    postcssPlugin: "css-modular-type",

    // Replace each rule that has a variable matching the prefix
    Once(root, { result }) {
      root.walkDecls((decl) => {
        if (replaceInline && decl.value.includes(prefix)) {
          const parsed = valueParser(decl.value);

          parsed.walk((valueNode) => {
            // CSS variables is declared as a `word` node in `postcss-value-parser`
            if (valueNode.type !== "word") return;
            const value = stepsMap.get(valueNode.value.replace(/^--/, ""));
            if (value) {
              decl.value = value;
            } else {
              decl.warn(
                result,
                "Not replacing the following declaration. Step maybe out-of-bound.\n" +
                  `${decl.prop}: ${decl.value}`
              );
            }
          });
        }
      });
    },

    // Replace generatorDirective with variables
    Rule(rule, { Declaration }) {
      if (replaceInline) return;

      rule.walkComments((cmt) => {
        if (cmt.text === generatorDirective) {
          const fontVars = [];
          for (const [key, value] of stepsMap) {
            fontVars.push(new Declaration({ prop: `--${key}`, value }));
          }
          cmt.replaceWith(fontVars);
        }
      });
    },
  };
};

plugin.postcss = true;
export = plugin;
