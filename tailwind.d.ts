import { GeneratorOptions } from "./dist/src/types";
declare const plugin: {
  (options: Partial<GeneratorOptions>): {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
  };
  __isOptionsFunction: true;
};
export = plugin;
