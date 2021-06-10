import simpleCollection, { jiraKeyError } from './index'
import coverage from './plugins/coverage'
import getCustomReporting from './plugins/packageReport'
import npmAudit from './plugins/audit'
import jiraIssue from 'danger-plugin-jira-issue'
import mentor from 'danger-plugin-mentor'
import noConsole from 'danger-plugin-no-console'
import npmOutdated from 'danger-plugin-npm-outdated'

jest.mock('./plugins/coverage', () => jest.fn())
jest.mock('./plugins/packageReport', () => jest.fn())
jest.mock('./plugins/audit', () => jest.fn())
jest.mock('danger-plugin-jira-issue', () => jest.fn())
jest.mock('danger-plugin-mentor', () => jest.fn())
jest.mock('danger-plugin-no-console', () => jest.fn())
jest.mock('danger-plugin-npm-outdated', () => jest.fn())

global.schedule = () => jest.fn()
global.console = {
  error: jest.fn(),
}

describe('simpleCollection', () => {
  const options = {
    jiraKey: 'FA', // required, key used for JIRA tickets eg. FA-123
    jiraUrl: 'https://myorg.atlassian.net/browse', // required, url to the account's/organization's JIRA home
    reportsPath: 'reports/danger', // optional default is reports/danger
    noConsoleWhitelist: ['warn', 'error'], // optional, whitelist options for console calls, possible options log,warn,info,error
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should start and call all the plugins', () => {
    simpleCollection(options)
    expect(coverage).toHaveBeenCalled()
    expect(jiraIssue).toHaveBeenCalled()
    expect(npmAudit).toHaveBeenCalled()
    expect(mentor).toHaveBeenCalled()
    expect(getCustomReporting).toHaveBeenCalled()
    expect(noConsole).toHaveBeenCalled()
    expect(npmOutdated).toHaveBeenCalled()
  })

  it('should not start if no options are provided', () => {
    simpleCollection()
    expect(coverage).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith(jiraKeyError)
  })

  it('should not run the disabled modules', () => {
    const myOptions = {
      ...options,
      disabled: {
        coverage: true,
        npmAudit: true,
        packageReport: true,
      },
    }

    simpleCollection(myOptions)
    expect(coverage).not.toHaveBeenCalled()
    expect(jiraIssue).toHaveBeenCalled()
    expect(npmAudit).not.toHaveBeenCalled()
    expect(mentor).toHaveBeenCalled()
    expect(getCustomReporting).not.toHaveBeenCalled()
    expect(noConsole).toHaveBeenCalled()
    expect(npmOutdated).toHaveBeenCalled()
  })

  it('should run all if disabled attributes are false', () => {
    const myOptions = {
      ...options,
      disabled: {
        coverage: false,
        jiraIssue: false,
        mentor: false,
        packageReport: false,
        noConsole: false,
        npmAudit: false,
        npmOutdated: false,
      },
    }

    simpleCollection(myOptions)
    expect(coverage).toHaveBeenCalled()
    expect(jiraIssue).toHaveBeenCalled()
    expect(npmAudit).toHaveBeenCalled()
    expect(mentor).toHaveBeenCalled()
    expect(getCustomReporting).toHaveBeenCalled()
    expect(noConsole).toHaveBeenCalled()
    expect(npmOutdated).toHaveBeenCalled()
  })
})
