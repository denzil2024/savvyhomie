import { readFileSync, writeFileSync } from 'node:fs'

const ENV_PATH = new URL('../.env', import.meta.url)

export function loadEnv() {
  const raw = readFileSync(ENV_PATH, 'utf8')
  const vars = {}
  for (const line of raw.split('\n')) {
    const idx = line.indexOf('=')
    if (idx < 0) continue
    vars[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return vars
}

export function saveEnv(updates) {
  const vars = { ...loadEnv(), ...updates }
  const lines = Object.entries(vars).map(([k, v]) => `${k}=${v}`)
  writeFileSync(ENV_PATH, lines.join('\n') + '\n')
}
