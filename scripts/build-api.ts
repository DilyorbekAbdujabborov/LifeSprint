import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["api/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  outfile: "api/index.js",
  sourcemap: false,
  external: ["pg", "bcryptjs", "jsonwebtoken", "cookie-parser", "express", "@google/genai"],
});

console.log("api/index.js bundled successfully");
