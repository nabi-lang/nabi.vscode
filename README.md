<img src="https://raw.githubusercontent.com/nabi-lang/nabi/main/assets/icons/icon-512-transparent.png" alt="Nabi" width="96">

# Nabi for Visual Studio Code

[![CI](https://github.com/nabi-lang/nabi.vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/nabi-lang/nabi.vscode/actions/workflows/ci.yml) [![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/nabi-lang.nabi?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=nabi-lang.nabi) [![Open VSX](https://img.shields.io/open-vsx/v/nabi-lang/nabi?label=Open%20VSX)](https://open-vsx.org/extension/nabi-lang/nabi) [![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue)](#license)

Nabi language support: syntax highlighting for `.nabi` and `.nabion`, and the
Nabi language server `nabils`.

## Features

- Syntax highlighting from the [nabi-syntax](https://github.com/nabi-lang/nabi-syntax)
  grammars.
- From `nabils`, over LSP:
  - diagnostics as you type
  - hover
  - completion
  - go to definition
  - find references
  - rename
  - document symbols
  - formatting
  - semantic highlighting of macros, user-defined literal suffixes,
    keywords and operators
  - signature help
  - quick fixes, including `nabi add` for a missing package
- One server for every folder of a multi-root workspace; each file is
  checked against its own package.
- **Nabi: Restart the Language Server** in the command palette.

## Install

From the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nabi-lang.nabi):
search for **Nabi** in the Extensions view, or run

```sh
code --install-extension nabi-lang.nabi
```

VSCodium, Cursor and other editors that use [Open VSX](https://open-vsx.org/extension/nabi-lang/nabi)
find it there under the same id. Each
[release](https://github.com/nabi-lang/nabi.vscode/releases) also carries the
`.vsix`, for `code --install-extension nabi-<version>.vsix` offline.

## Requirements

Install Nabi 0.1 or later so `nabils` is on your `PATH`.

Linux and macOS:

```sh
curl -fsSL https://nabi.sh | sh
```

Windows (PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://nabi.sh/install.ps1 | iex"
```

More at <https://nabi-lang.org/download>. Without `nabils` you still get
highlighting.

## Settings

| Setting              | Default  | Description                                      |
| -------------------- | -------- | ------------------------------------------------ |
| `nabi.server.path`   | `nabils` | Path to `nabils`, if it is not on `PATH`.        |
| `nabi.server.enable` | `true`   | Run the language server. Off: highlighting only. |

A change to either restarts the server.

## Grammars

`syntaxes/nabi.tmLanguage.json` (`source.nabi`) and
`syntaxes/nabion.tmLanguage.json` (`source.nabion`) are copies of the
grammars in [nabi-syntax](https://github.com/nabi-lang/nabi-syntax), at the
commit in `nabi-syntax.rev`. Change them there, then sync:

```sh
node scripts/sync-grammar.mjs --from ../nabi-syntax   # copy from a checkout, pin its HEAD
node scripts/sync-grammar.mjs                         # fetch at the pinned commit
node scripts/sync-grammar.mjs --check                 # what CI runs
```

`r#match` is one word for double-click and word motions.

## Build and test

Node 24 or newer.

```sh
npm ci
npm run compile    # type-check, bundle into out/extension.js
npm test           # start VS Code with the extension on test/fixture
npm run package    # -> nabi-<version>.vsix
code --install-extension nabi-<version>.vsix
```

`npm test` downloads VS Code into `.vscode-test/` (`VSCODE_TEST_CACHE`
moves it) and checks that `nabils` starts, answers hover and reports a
type error as it is typed. `NABILS=/path/to/nabils` tests another server.
On Linux without a display, run it under `xvfb-run -a`.

Releasing is in [CONTRIBUTING.md](https://github.com/nabi-lang/nabi.vscode/blob/main/CONTRIBUTING.md).

## License

Licensed under either of
[MIT](https://github.com/nabi-lang/nabi.vscode/blob/main/LICENSE-MIT) or
[Apache-2.0](https://github.com/nabi-lang/nabi.vscode/blob/main/LICENSE-APACHE),
at your option.
