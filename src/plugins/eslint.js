// Provides dev-time type structures for  `danger` - doesn't affect runtime.
/* global danger, fail, warn */
import { CLIEngine } from 'eslint';

/**
 * Eslint your code with
 */
export default async function eslint(config, extensions) {
  const allFiles = danger.git.created_files.concat(danger.git.modified_files);
  const options = { baseConfig: config };
  if (extensions) {
    options.extensions = extensions;
  }
  const cli = new CLIEngine(options);
  // let eslint filter down to non-ignored, matching the extensions expected
  const filesToLint = allFiles.filter(f => {
    return !cli.isPathIgnored(f) && cli.options.extensions.some(ext => f.endsWith(ext));
  });
  return Promise.all(filesToLint.map(f => lintFile(cli, config, f)));
}

async function lintFile(linter, config, path) {
  const contents = await danger.github.utils.fileContents(path);
  const report = linter.executeOnText(contents, path);

  if (report.results.length !== 0) {
    report.results[0].messages.map(msg => {
      if (msg.fatal) {
        return fail(`Fatal error linting ${path} with eslint.`);
      }

      const fn = { 1: warn, 2: fail }[msg.severity];

      return fn(`${path} line ${msg.line} – ${msg.message} (${msg.ruleId})`, path, msg.line);
    });
  }
}
