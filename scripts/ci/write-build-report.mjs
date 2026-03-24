import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const distDir = resolve('dist')
const reportPath = resolve('reports/build/build-report.json')
mkdirSync(dirname(reportPath), { recursive: true })

const files = readdirSync(distDir, { withFileTypes: true })

const summarize = (dir, prefix = '') => {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name
    const absolutePath = resolve(dir, entry.name)

    if (entry.isDirectory()) {
      return summarize(absolutePath, relativePath)
    }

    return {
      file: relativePath,
      sizeBytes: statSync(absolutePath).size,
    }
  })
}

const report = {
  generatedAt: new Date().toISOString(),
  artifactDirectory: 'dist',
  topLevelEntries: files.map((entry) => entry.name),
  assets: summarize(distDir),
}

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)
