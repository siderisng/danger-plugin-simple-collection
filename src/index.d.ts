interface IOptions {
  jiraKey: string;
  jiraUrl: string;
  reportsPath?: string;
  noConsoleWhitelist?: string[];
  disabled?: { 
    coverage?: boolean,
    jiraIssue?: boolean,
    mentor?: boolean,
    packageReport?: boolean,
    noConsole?: boolean,
    npmAudit?: boolean,
    npmOutdated?: boolean,
  }
};

export default function simpleCollection(options: IOptions): void
