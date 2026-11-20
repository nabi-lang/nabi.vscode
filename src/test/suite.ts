// Runs inside VS Code: the extension starts nabils for a .nabi file, the
// file gets its language, and the server's hover and diagnostics come
// back. The fixture is never saved.
import * as assert from "node:assert/strict";
import * as path from "node:path";
import * as vscode from "vscode";
import type { Api } from "../extension";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function until<T>(what: string, f: () => T | undefined, ms = 60000): Promise<T> {
  const end = Date.now() + ms;
  for (;;) {
    const v = f();
    if (v !== undefined) {
      return v;
    }
    if (Date.now() > end) {
      throw new Error(`timed out waiting for ${what}`);
    }
    await sleep(200);
  }
}

async function check(name: string, f: () => Promise<void>): Promise<void> {
  await f();
  console.log(`ok   ${name}`);
}

export async function run(): Promise<void> {
  const cfg = vscode.workspace.getConfiguration("nabi");
  if (process.env.NABILS) {
    await cfg.update("server.path", process.env.NABILS, vscode.ConfigurationTarget.Global);
  }
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  assert.ok(folder, "a workspace folder");
  const file = vscode.Uri.file(path.join(folder, "src", "main.nabi"));

  const found = vscode.extensions.getExtension<Api>("nabi-lang.nabi");
  assert.ok(found, "the extension is installed");
  const ext = found;
  const doc = await vscode.workspace.openTextDocument(file);
  await vscode.window.showTextDocument(doc);

  await check("a .nabi file has the nabi language", async () => {
    assert.equal(doc.languageId, "nabi");
  });

  const api = await until("activation", () => (ext.isActive ? ext.exports : undefined));

  await check("nabils starts", async () => {
    const client = await until("a running server", () => (api.client()?.isRunning() ? api.client() : undefined));
    const info = client.initializeResult?.serverInfo;
    assert.equal(info?.name, "nabils");
  });

  await check("nabils answers hover", async () => {
    const pos = new vscode.Position(1, 8);
    let text = "";
    for (let i = 0; i < 100 && text === ""; i++) {
      const hovers =
        (await vscode.commands.executeCommand<vscode.Hover[]>("vscode.executeHoverProvider", file, pos)) ?? [];
      text = hovers
        .flatMap((h) => h.contents)
        .map((c) => (typeof c === "string" ? c : c.value))
        .join("\n");
      if (text === "") {
        await sleep(200);
      }
    }
    assert.match(text, /n: i64/);
  });

  await check("nabils reports a type error as it is typed", async () => {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(file, new vscode.Position(3, 0), '    let bad: i64 = "x";\n');
    assert.ok(await vscode.workspace.applyEdit(edit));
    const diags = await until("diagnostics", () => {
      const d = vscode.languages.getDiagnostics(file);
      return d.length > 0 ? d : undefined;
    });
    assert.ok(
      diags.some((d) => d.range.start.line === 3 && /mismatched types/.test(d.message)),
      JSON.stringify(diags)
    );
    await vscode.commands.executeCommand("workbench.action.files.revert");
  });

  await check("the restart command brings the server back", async () => {
    await vscode.commands.executeCommand("nabi.restartServer");
    await until("a running server", () => (api.client()?.isRunning() ? true : undefined));
  });
}
