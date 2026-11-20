// Downloads VS Code, starts it on test/fixture with this extension, and
// runs suite.ts inside it. NABILS names the server to test (else nabils
// on PATH); VSCODE_VERSION the VS Code build (default: stable);
// VSCODE_TEST_CACHE where it is downloaded (default: .vscode-test).
import * as path from "node:path";
import { runTests } from "@vscode/test-electron";

async function main(): Promise<void> {
  const root = path.resolve(__dirname, "../..");
  const fixture = path.join(root, "test", "fixture");
  try {
    await runTests({
      version: process.env.VSCODE_VERSION ?? "stable",
      cachePath: process.env.VSCODE_TEST_CACHE ?? path.join(root, ".vscode-test"),
      extensionDevelopmentPath: root,
      extensionTestsPath: path.join(__dirname, "suite.js"),
      launchArgs: [fixture, "--disable-extensions", "--disable-workspace-trust", "--skip-welcome"],
      extensionTestsEnv: { NABILS: process.env.NABILS ?? "" },
    });
  } catch (e) {
    console.error(`tests failed: ${e}`);
    process.exit(1);
  }
}

void main();
