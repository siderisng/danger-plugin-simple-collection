/* global schedule */
/**
 * A collection of danger plugins
 */

import mentor from 'danger-plugin-mentor';
import jiraIssue from 'danger-plugin-jira-issue';
import noConsole from 'danger-plugin-no-console'

// import eslint from './plugins/eslint';
import jestCoverage from './plugins/coverage';
import getCustomReporting from './plugins/packageReport';

export default function simpleCollection({
  jiraKey,
  jiraUrl = 'https://travelexdigital.atlassian.net/browse',
  reportsPath = 'reports/danger',
  // eslintPath, 
} = {}) {

  if (!jiraKey) return console.error('===== No JIRA key specified. This is required. ======')
  if (!jiraUrl) return console.error('===== No JIRA workspace url specified. This is required. =====')

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

  schedule(noConsole())
}
