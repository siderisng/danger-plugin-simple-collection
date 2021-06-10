/* global schedule */
/**
 * A collection of danger plugins
 */

import mentor from 'danger-plugin-mentor'
import jiraIssue from 'danger-plugin-jira-issue'
import noConsole from 'danger-plugin-no-console'
import npmOutdated from 'danger-plugin-npm-outdated'

import coverage from './plugins/coverage'
import getCustomReporting from './plugins/packageReport'
import npmAudit from './plugins/audit'

export const jiraKeyError =
  '===== No JIRA key specified. This is required. ======'
export const jiraUrlError =
  '===== No JIRA workspace url specified. This is required. ====='

export default function simpleCollection({
  jiraKey,
  jiraUrl,
  reportsPath = 'reports/danger',
  noConsoleWhitelist = ['error', 'warn'],
  disabled = {},
} = {}) {
  if (!disabled.jiraIssue) {
    if (!jiraKey) return console.error(jiraKeyError)
    if (!jiraUrl) return console.error(jiraUrlError)
  }

  const whitelist = { whitelist: noConsoleWhitelist }

  if (!disabled.coverage) coverage(reportsPath)

  if (!disabled.jiraIssue)
    jiraIssue({
      key: jiraKey,
      url: jiraUrl,
      emoji: ':paperclip:',
      format(emoji, jiraUrls) {
        // Optional Formatter
        return emoji + ' JIRA Issue - ' + jiraUrls
      },
      location: 'title', // Optional location, either 'title' or 'branch'
    })

  if (!disabled.mentor) mentor()

  if (!disabled.packageReport) schedule(getCustomReporting())

  if (!disabled.noConsole) schedule(noConsole(whitelist))

  if (!disabled.npmAudit) schedule(npmAudit())

  if (!disabled.npmOutdated) schedule(npmOutdated())
}
