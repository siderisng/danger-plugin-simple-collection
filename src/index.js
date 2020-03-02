/**
 * A collection of danger plugins
 */

import mentor from 'danger-plugin-mentor';
import jiraIssue from 'danger-plugin-jira-issue';

// import eslint from './plugins/eslint';
import jestCoverage from './plugins//coverage';
import getCustomReporting from './plugins/packageReport';

// import paths from './config/paths';

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
  // eslint(paths.eslintConfig);

  schedule(getCustomReporting());
}
