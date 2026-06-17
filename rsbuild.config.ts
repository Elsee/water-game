import {defineConfig} from "@rsbuild/core";
import {pluginBabel} from "@rsbuild/plugin-babel";
import {pluginReact} from "@rsbuild/plugin-react";
import * as path from "node:path";
import * as os from "node:os";

const homeDir = path.basename(os.homedir());
const projectName = homeDir
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, "-")
  .replace(/-+/g, "-");

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginBabel({
      include: /\.[jt]sx?$/,
      exclude: [/[\\/]node_modules[\\/]/],
      babelLoaderOptions(opts) {
        opts.plugins?.unshift("babel-plugin-react-compiler");
      },
    }),
  ],
  html: {
    scriptLoading: "module",
  },
  output: {
    target: "web",
    filename: {
      html: isProd ? `${projectName}-project.html` : undefined,
    },
    dataUriLimit: {
      image: Number.MAX_SAFE_INTEGER,
      svg: Number.MAX_SAFE_INTEGER,
    },
    inlineScripts: true,
    inlineStyles: true,
    legalComments: "inline",
  },
});
