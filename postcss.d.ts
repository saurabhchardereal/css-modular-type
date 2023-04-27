import type { PluginCreator } from "postcss";
import { PostcssOpts } from "./dist/src/types";
declare const plugin: PluginCreator<Partial<PostcssOpts>>;
export = plugin;
