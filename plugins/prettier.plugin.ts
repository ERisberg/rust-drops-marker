import { WebpackPluginInstance, Compiler } from "webpack";
import { format, getSupportInfo } from "prettier";
import fs from "fs/promises";

async function getDefaultExtensions() {
  return (
    (await getSupportInfo()).languages
      .map((l) => l.extensions)
      .reduce((a, b) => (a ?? []).concat(b ?? []), []) ?? [
      ".css",
      ".graphql",
      ".js",
      ".json",
      ".jsx",
      ".less",
      ".sass",
      ".scss",
      ".ts",
      ".tsx",
      ".vue",
      ".yaml",
    ]
  );
}

export default class PrettierPlugin implements WebpackPluginInstance {
  encoding: string = "utf-8";

  async apply(compiler: Compiler): Promise<void> {
    compiler.hooks.emit.tap("PrettierPlugin", async (compilation) => {
      const promises: Promise<void>[] = [];

      const extensions = await getDefaultExtensions();

      for (const filepath of compilation.fileDependencies) {
        if (extensions.some((ext) => filepath.endsWith(ext))) {
          await this.formatFile(filepath);
        }
      }
      return Promise.all(promises);
    });
  }

  async formatFile(filepath: string): Promise<void> {
    try {
      if (/node_modules/.exec(filepath)) {
        return;
      }
      console.log(filepath);
      const content = await fs.readFile(filepath, { encoding: "utf-8" });
      const formatted = await format(content, {
        filepath,
        // parser: path.extname(filepath) === ".ts" ? "typescript" : undefined,
        // plugins: [
        //     "asyncGenerators",
        //     "bigInt",
        //     "classProperties",
        //     "classPrivateProperties",
        //     "classPrivateMethods",
        //     "decorators",
        //     "doExpressions",
        //     "dynamicImport",
        //     "exportDefaultFrom",
        //     "exportNamespaceFrom",
        //     "functionBind",
        //     "functionSent",
        //     "importMeta",
        //     "logicalAssignment",
        //     "nullishCoalescingOperator",
        //     "numericSeparator",
        //     "objectRestSpread",
        //     "optionalCatchBinding",
        //     "optionalChaining",
        //     "partialApplication",
        //     "pipelineOperator",
        //     "throwExpressions",
        // ],
      });
      try {
        await fs.writeFile(filepath, formatted, { encoding: "utf-8" });
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
