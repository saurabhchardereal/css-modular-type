import * as twPlugin from "tailwindcss/plugin";
import { defaultGeneratorConfig } from "./config";
import generateFontScales from "./generateFontScales";
import { GeneratorOptions } from "./types";

export = twPlugin.withOptions((opts: Partial<GeneratorOptions>) => {
  return ({ addUtilities }) => {
    const resolvedOptions = { ...defaultGeneratorConfig, ...opts };
    const fontSteps = generateFontScales(resolvedOptions);

    const twUtilities: Record<string, { fontSize: string }> = {};
    for (const [_key, value] of fontSteps) {
      const key = _key.replace(/^--/, ".");
      twUtilities[key] = { fontSize: value };
    }

    addUtilities(twUtilities);
  };
});
