import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const reportPath = resolve('reports/security/npm-audit.json')
mkdirSync(dirname(reportPath), { recursive: true })

const command = spawnSync('npm', ['audit', '--json', '--audit-level=high'], {
  encoding: 'utf8',
  shell: process.platform === 'win32',
})

const rawOutput = [command.stdout, command.stderr].filter(Boolean).join('\n').trim()
writeFileSync(reportPath, rawOutput || '{"error":"npm audit produced no output"}\n')

if (command.status !== 0) {
  process.stderr.write('npm audit detected vulnerabilities at the configured threshold.\n')
  process.exit(command.status ?? 1)
}
