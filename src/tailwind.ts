import twPlugin from "tailwindcss/plugin";
import { defaultTailwindConfig } from "./config";
import generateFontScales from "./generateFontScales";
import { TailwindOpts } from "./types";

export = twPlugin.withOptions(
  () => {
    return ({ matchUtilities, theme }) => {
      matchUtilities(
        { text: (value: string) => ({ fontSize: value }) },
        { values: theme("fluidFontSize") }
      );
    };
  },
  (opts: Partial<TailwindOpts>) => {
    const overrides = { insertMinMaxFontAsVariables: false };

    const resolvedOptions = {
      ...defaultTailwindConfig,
      ...opts,
      ...overrides,
    };
    const fontSteps = generateFontScales(resolvedOptions);
    return {
      theme: { fluidFontSize: Object.fromEntries(fontSteps.entries()) },
    };
  }
);
