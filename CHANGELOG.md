# Changelog

All notable changes to this extension. Versions follow semver, independent of the Nabi toolchain.

## 0.1.0 (unreleased)

First release.

- Syntax highlighting for `.nabi` and `.nabion` from the nabi-syntax
  TextMate grammars.
- The `nabils` language server over LSP: diagnostics as you type, hover,
  completion, go to definition, find references, rename, document symbols,
  formatting, semantic highlighting, signature help and quick fixes
  (including `nabi add` for a missing package).
- One server for every folder of a multi-root workspace.
- Settings `nabi.server.path` and `nabi.server.enable`; the command
  **Nabi: Restart the Language Server**.
- Needs Nabi 0.1 or later for `nabils`; highlighting works without it.
