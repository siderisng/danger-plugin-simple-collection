/* global danger, markdown, warn */
import parseCoverage from 'byzantine';
import fs from 'fs';
import { includes, forEach, keyBy, groupBy } from 'lodash';
import path from 'path';
import generateMarkdownTable from 'markdown-table';

const rootDir = process.cwd();
const getFileAbsolutePath = filePath => path.join(rootDir, filePath);
let coverageFilePath = getFileAbsolutePath('reports/danger/coverage-current.json');
let coverageFilePathPrev = getFileAbsolutePath('reports/danger/coverage-develop.json');
class CoverageParser {
  constructor() {
    this.getFileCoverageStats = filePath => {
      const fileCoverage = this.getCoverageForFile(filePath);
      if (fileCoverage) {
        const { branches, statements } = fileCoverage;
        return [this.getCoverageState(branches), this.getCoverageState(statements)];
      }
      return [0, 0];
    };
    this.getCoverageState = ({ covered, all }) => {
      if (all > 0) return covered / all;
      else return covered > 0 ? 1 : 0;
    };

    this.getCoverageForFile = filePath => this.coverageByPath[getFileAbsolutePath(filePath)];
  }
  parse(path = coverageFilePath) {
    // tslint:disable-next-line
    const coverageJson = require(path);
    const coverages = parseCoverage(coverageJson.coverageMap);
    this.coverageByPath = keyBy(coverages, coverage => coverage.path);
  }

  coverageFileExists(path = coverageFilePath) {
    return fs.existsSync(path);
  }
}

const roundPercentage = num => Math.round(num * 100) / 100;
const formatCoverageState = (stat, prevStat) => {
  const percentage = roundPercentage(stat * 100);
  const prevPercentage = roundPercentage(prevStat * 100);
  const difference = roundPercentage((stat - prevStat) * 100);
  let icon;
  if (difference === 0) {
    icon = '=';
  } else if (difference > 0) {
    icon = '⬆️';
  } else {
    icon = '🔻';
  }
  const GREEN = '00ff00';
  const RED = 'ff0000';
  const ORANGE = 'ffaa00';
  let color = GREEN;
  if (percentage < 80) {
    color = ORANGE;
  }
  if (percentage < 50) {
    color = RED;
  }
  return `![${percentage}](https://placehold.it/15/${color}/000000?text=+) ${percentage}% (${prevPercentage}%)${icon}`;
};
const generateMarkdownLineForFileCoverage = filePath => {
  const fileCoverage = coverageParser.getFileCoverageStats(filePath);
  const fileCoveragePrev = coverageParserPrev.getFileCoverageStats(filePath);
  const filePathWithoutFirstFolder = filePath.slice(filePath.indexOf('/') + 1);
  return [`↦ ${filePathWithoutFirstFolder}`].concat(
    fileCoverage.map((stat, i) => formatCoverageState(stat, fileCoveragePrev[i]))
  );
};
const generateCoverageTable = files => {
  const filesNeedingCoverage = files.filter(shouldFileHaveCoverage);
  const filesByFolder = groupBy(filesNeedingCoverage, file => file.split('/')[0]);
  const table = [];
  forEach(filesByFolder, (folderFiles, folderName) => {
    table.push([`:file_folder: **${folderName}**`, '', '']);
    forEach(folderFiles, file => table.push(generateMarkdownLineForFileCoverage(file)));
  });
  return table;
};
const shouldFileHaveCoverage = file =>
  includes(file, 'src/') &&
  (file.endsWith('.js') || file.endsWith('.jsx')) &&
  !file.endsWith('.spec.js') &&
  !file.endsWith('.spec.jsx') &&
  !file.endsWith('.test.js') &&
  !file.endsWith('.feature') &&
  !file.endsWith('.page.js') &&
  !includes(file, 'jha/') &&
  !includes(file, '__tests__/') &&
  !includes(file, '__mocks__/') &&
  !includes(file, '__stories__/');

export default function coverage(reportsPath = 'reports/danger') {
  const { git } = danger;

  coverageFilePath = getFileAbsolutePath(reportsPath = '/coverage-current.json');
  coverageFilePathPrev = getFileAbsolutePath(reportsPath = '/coverage-develop.json');

  const coverageParser = new CoverageParser();
  const coverageParserPrev = new CoverageParser();

  if (coverageParser.coverageFileExists() && coverageParserPrev.coverageFileExists(coverageFilePathPrev)) {
    coverageParser.parse();
    coverageParserPrev.parse(coverageFilePathPrev);
    let coverageTable = [['File', 'Branches', 'Statements']];

    if (!!git.created_files.length) {
      coverageTable = coverageTable
        .concat([[], [':heavy_plus_sign: **NEW FILES**'], []])
        .concat(generateCoverageTable(git.created_files));
    }
    const jsFiles = git.modified_files.filter(shouldFileHaveCoverage);
    if (!!jsFiles.length) {
      coverageTable = coverageTable
        .concat([[], [':pencil2: **MODIFIED FILES**'], []])
        .concat(generateCoverageTable(git.modified_files));
    }

    if (!!jsFiles.length || !!git.created_files.length)
      markdown(`# Coverage \n ${generateMarkdownTable(coverageTable)}`);
  } else {
    if (coverageParser.coverageFileExists() && !coverageParserPrev.coverageFileExists(coverageFilePathPrev)) {
      warn('No coverage develop file available, you should have a coverage-develop.json file in your reports.');
    } else if (!coverageParser.coverageFileExists() && coverageParserPrev.coverageFileExists(coverageFilePathPrev)) {
      warn(
        'No coverage file available, please run `yarn jest --coverage` before running this plugin. You should have a coverage-current.json file in your reports.'
      );
    } else {
      warn(
        'No coverage files available, please run `yarn jest --coverage` before running this plugin. You should have a coverage-current.json and a coverage-develop.json file in your reports.'
      );
    }
  }
}
