// LSP client for nabils. Highlighting is the TextMate grammar; every other
// feature, including the `nabi.add` quick-fix command, is plain LSP. One
// server covers every workspace folder: nabils resolves each file's
// package on its own and asks for the manifest watchers it needs.
import { commands, ExtensionContext, window, workspace } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";

let client: LanguageClient | undefined;

// What activate() returns: the tests reach the client through it.
export interface Api {
  client(): LanguageClient | undefined;
}

function start(): void {
  const cfg = workspace.getConfiguration("nabi");
  if (!cfg.get<boolean>("server.enable", true)) {
    return;
  }
  const command = cfg.get<string>("server.path", "nabils") || "nabils";
  // No transport: plain stdio (nabils also accepts a `--stdio` argument).
  const server: ServerOptions = { command };
  const options: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "nabi" }],
  };
  client = new LanguageClient("nabi", "Nabi language server", server, options);
  client.start().catch((e) => {
    window.showWarningMessage(
      `Nabi: could not start the language server (${command}). ` +
        `Install the toolchain, or set "nabi.server.path". Highlighting still works. ${e}`
    );
  });
}

async function restart(): Promise<void> {
  const old = client;
  client = undefined;
  await old?.stop();
  start();
}

export function activate(context: ExtensionContext): Api {
  context.subscriptions.push(
    commands.registerCommand("nabi.restartServer", restart),
    workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("nabi.server")) {
        void restart();
      }
    })
  );
  start();
  return { client: () => client };
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}
