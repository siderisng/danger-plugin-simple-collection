# danger-plugin-simple-collection

[![Build Status](https://travis-ci.org/siderisng/danger-plugin-simple-collection.svg?branch=master)](https://travis-ci.org/siderisng/danger-plugin-simple-collection)
[![npm version](https://badge.fury.io/js/danger-plugin-simple-collection.svg)](https://badge.fury.io/js/danger-plugin-simple-collection)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A collection of danger plugins

## Usage

Install:

```sh
yarn add danger-plugin-simple-collection --dev
```

Use this on your project's dangerfile.js:

```js
// dangerfile.js
import simpleCollection from 'danger-plugin-simple-collection'

const options = {
  jiraKey: 'FA', // required, key used for JIRA tickets eg. FA-123
  jiraUrl: 'https://<ORG_NAME>.atlassian.net/browse', // required, url to the account's/organization's JIRA home
  reportsPath = 'reports/danger', // optional default is reports/danger
};

simpleCollection(options);
```

Use this on your CI's shell commands: The below example is for Jenkins, change accordingly for the CI of your preference.

```bash
# Create folder structure
rm -f coverage-*.tar.gz
rm -rf reports
mkdir -p reports/danger # input folder needs to be the same as reportsPath in the configuration, note how this folder is referenced below too

# Run tests on develop
git checkout develop
npm ci
node scripts/test.js --env=jsdom --json --coverage --outputFile reports/danger/coverage-develop.json

# Run tests on branch
git checkout ${ghprbActualCommit}
npm ci
node scripts/test.js --env=jsdom --json --coverage --outputFile reports/danger/coverage-current.json

# Run danger task
yarn danger ci
```

## Plugins used

- [danger-plugin-mentor](https://github.com/hanneskaeufler/danger-plugin-mentor)

- [danger-plugin-jira-issue](https://github.com/macklinu/danger-plugin-jira-issue)

- [danger-plugin-no-console](https://github.com/withspectrum/danger-plugin-no-console)

- [danger-plugin-npm-audit](https://github.com/revathskumar/danger-plugin-npm-audit)

- Unit testing code coverage report (used code from [danger-plugin-istanbul-coverage](https://github.com/darcy-rayner/danger-plugin-istanbul-coverage))

## Changelog

See the GitHub [release history](https://github.com/siderisng/danger-plugin-simple-collection/releases).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
