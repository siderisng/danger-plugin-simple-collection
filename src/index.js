/* global schedule */
/**
 * A collection of danger plugins
 */

import mentor from 'danger-plugin-mentor';
import jiraIssue from 'danger-plugin-jira-issue';
import noConsole from 'danger-plugin-no-console'
import npmOutdated from "danger-plugin-npm-outdated";

import jestCoverage from './plugins/coverage';
import getCustomReporting from './plugins/packageReport';
import npmAudit from './plugins/audit';

export default function simpleCollection({
  jiraKey,
  jiraUrl,
  reportsPath = 'reports/danger',
  noConsoleWhitelist = ['error', 'warn'],
} = {}) {

  if (!jiraKey) return console.error('===== No JIRA key specified. This is required. ======')
  if (!jiraUrl) return console.error('===== No JIRA workspace url specified. This is required. =====')

  const whitelist = { whitelist: noConsoleWhitelist };

  jestCoverage(reportsPath);
  jiraIssue({
    key: jiraKey,
    url: jiraUrl,
    emoji: ':paperclip:',
    format(emoji, jiraUrls) {
      // Optional Formatter
      return emoji + ' JIRA Issue - ' + jiraUrls;
    },
    location: 'title', // Optional location, either 'title' or 'branch'
  });

  mentor();

  // if (eslintPath) eslint(eslintPath)

  schedule(getCustomReporting());

  schedule(noConsole(whitelist));

  schedule(npmAudit());

  schedule(npmOutdated())
}
