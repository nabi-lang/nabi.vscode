# Contributing to nabi.vscode

The VS Code extension for Nabi: syntax, language configuration, and an LSP
client for `nabils`.

## Development

Run `npm ci`, open the folder in VS Code, and launch the extension with F5.
The LSP needs `nabils` on your `PATH` (install Nabi). `npm run compile`
type-checks and bundles `src/` into `out/extension.js`; `npm test` runs
`src/test/suite.ts` inside a downloaded VS Code against `test/fixture`;
`npm run package` builds the `.vsix`.

Never edit `syntaxes/` by hand: change the grammars in
[nabi-syntax](https://github.com/nabi-lang/nabi-syntax), then run
`node scripts/sync-grammar.mjs --from ../nabi-syntax`.

## Submitting

Open a pull request against `main` with `npm test` passing. By contributing
you agree that your work is licensed under both MIT and Apache-2.0, the
project's dual license.

## Releasing

The extension is published as `nabi-lang.nabi` to the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nabi-lang.nabi)
and [Open VSX](https://open-vsx.org/extension/nabi-lang/nabi). Its version is
independent of the Nabi toolchain.

1. Bump `version` in `package.json` (`npm version X.Y.Z --no-git-tag-version`
   keeps `package-lock.json` in step) and add an `## X.Y.Z` entry to
   `CHANGELOG.md`. Commit on `main`.
2. Tag and push:

   ```sh
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

`.github/workflows/publish.yml` then builds, checks the grammars against
nabi-syntax, packages `nabi-X.Y.Z.vsix`, publishes it to both registries and
attaches it to a GitHub release for the tag. The tag must match
`package.json`.

### One-time setup

- VS Code Marketplace: a publisher `nabi-lang`
  (<https://marketplace.visualstudio.com/manage>) with a trusted publishing
  policy for GitHub Actions: owner `nabi-lang`, repository `nabi.vscode`,
  workflow `publish.yml`, no environment. No secret is stored; the workflow
  publishes with `vsce publish --oidc`.
- Open VSX: an account at <https://open-vsx.org> (sign in with GitHub, sign
  the publisher agreement), the namespace `nabi-lang`, and a trusted
  publisher on it for GitHub: repository `nabi-lang/nabi.vscode`, workflow
  `publish.yml`, no environment. No secret is stored; the workflow
  publishes with `ovsx publish --trusted-publishing`.

If a release stops halfway, run the workflow by hand from main
(Actions, Publish / Extension to the marketplaces, Run workflow) with the tag; versions already published
are skipped and the `.vsix` on the GitHub release is replaced.

## Sign your work

Nabi uses the [Developer Certificate of Origin 1.1](https://developercertificate.org/)
(DCO) instead of a CLA. By adding a `Signed-off-by` line to a commit you
certify that you wrote the change, or otherwise have the right to submit it
under this repository's license. `git commit -s` adds the line:

```text
Signed-off-by: Your Name <you@example.com>
```

Use your name and an email you can be reached at; the email must be the
commit's author email. The `DCO / Check sign-off` check fails a pull request with an
unsigned commit. To fix it, run `git commit --amend -s` (last commit) or
`git rebase --signoff main` (every commit), then push again. The full text
of the DCO is in the
[organization's CONTRIBUTING.md](https://github.com/nabi-lang/.github/blob/main/CONTRIBUTING.md#developer-certificate-of-origin).
