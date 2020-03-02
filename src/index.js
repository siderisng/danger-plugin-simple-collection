/**
 * A collection of danger plugins
 */

import { schedule } from 'danger';
import mentor from 'danger-plugin-mentor';
import jiraIssue from 'danger-plugin-jira-issue';

import eslint from './config/danger/eslint';
import jestCoverage from './config/danger/coverage';
import getCustomReporting from './config/danger/packageReport';

import paths from './config/paths';

export default function simpleCollection() {
  jestCoverage();
  jiraIssue({
    key: 'FW',
    url: 'https://travelexdigital.atlassian.net/browse',
    emoji: ':paperclip:',
    format(emoji, jiraUrls) {
      // Optional Formatter
      return emoji + ' JIRA Issue - ' + jiraUrls;
    },
    location: 'title', // Optional location, either 'title' or 'branch'
  });

  mentor();
  eslint(paths.eslintConfig);

  schedule(getCustomReporting());
}
