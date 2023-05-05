import { TailwindOpts } from "./dist/src/types";
declare function plugin(options: Partial<TailwindOpts>): {
  handler: () => void;
};

declare namespace plugin {
  const __isOptionsFunction: true;
}

export = plugin;
