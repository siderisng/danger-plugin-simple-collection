'use strict'
const exec = require('child_process').exec

const getSummary = (metadata = {}) => {
  const { vulnerabilities = {}, totalDependencies = 0 } = metadata
  const totalVulnerabilities = Object.values(vulnerabilities).reduce(
    (total, level) => total + level,
    0,
  )
  const summary = Object.keys(vulnerabilities)
    .map(level => ({ level, count: vulnerabilities[level] }))
    .filter(levelCount => levelCount.count > 0)
    .map(levelCount => `${levelCount.count} ${levelCount.level}`)
    .join(', ')

  if (totalVulnerabilities > 0) {
    return `found ${totalVulnerabilities} vulnerabilities (${summary}) in ${totalDependencies} scanned packages`
  }

  return ''
}

const execP = auditCommand => {
  return new Promise((resolve, reject) => {
    exec(auditCommand, function(error, stdout, stderr) {
      if (stdout) {
        const { metadata } = JSON.parse(stdout)
        resolve(getSummary(metadata))
      }
      if (error !== null) {
        reject(error)
      }
    })
  })
}

export default async function npmAudit(options = {}) {
  let auditCommand = 'npm audit --json'
  if (options.registry) {
    auditCommand += ` --registry ${options.registry}`
  }

  try {
    const severityline = await execP(auditCommand)
    if (severityline) {
      warn(severityline)
    }
  } catch (err) {
    warn('npm audit plugin error: ' + error.message)
  }
}
