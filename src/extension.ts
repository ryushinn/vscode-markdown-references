import { config } from "process";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "Markdown References" is now active!'
  );
  return {
    extendMarkdownIt(md: any) {
      // the crossref plugins
      const crossRefConfig = vscode.workspace.getConfiguration("crossref");
      const isListOfFigures = crossRefConfig.get("listOfFigures");
      const isListOfTables = crossRefConfig.get("listOfTables");

      md = md.use(require("markdown-it-figure-references"), {
        anchor: { enable: false },
        list: { enable: isListOfFigures },
      });
      md = md.use(require("markdown-it-table-references"), {
        anchor: { enable: false },
        list: { enable: isListOfTables },
      });
      md = md.use(require("markdown-it-references"));

      // the citation/bibliography plugin
      const bibConfig = vscode.workspace.getConfiguration("bibliography");
      var bibPath: String = bibConfig.get("bibPath");
      var localePath: String = bibConfig.get("localePath");
      var cslPath: String = bibConfig.get("cslPath");

      bibPath = bibPath.trim();
      localePath = localePath.trim();
      cslPath = cslPath.trim();

      const folders = vscode.workspace.workspaceFolders;
      if (folders && folders.length >= 1 && bibPath.includes("$WSDirectory")) {
        bibPath = bibPath.replace("$WSDirectory", folders[0].uri.fsPath);
      }

      if (
        folders &&
        folders.length >= 1 &&
        localePath.includes("$WSDirectory")
      ) {
        localePath = localePath.replace("$WSDirectory", folders[0].uri.fsPath);
      }

      if (folders && folders.length >= 1 && cslPath.includes("$WSDirectory")) {
        cslPath = cslPath.replace("$WSDirectory", folders[0].uri.fsPath);
      }

      var opts = {};
      opts["bibPath"] = bibPath;
      if (localePath.length != 0) {
        opts["localePath"] = localePath;
      }
      if (cslPath.length != 0) {
        opts["cslPath"] = cslPath;
      }

      md = md.use(require("@arothuis/markdown-it-biblatex"), opts);

      return md;
    },
  };
}

export function deactivate() {}
