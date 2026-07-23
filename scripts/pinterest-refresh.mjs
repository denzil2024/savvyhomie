import { loadEnv, saveEnv } from './pinterest-env.mjs'

export async function refreshAccessToken() {
  const { PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REFRESH_TOKEN } = loadEnv()
  if (!PINTEREST_REFRESH_TOKEN) throw new Error('No PINTEREST_REFRESH_TOKEN in .env yet, run the auth flow first')

  const basic = Buffer.from(`${PINTEREST_APP_ID}:${PINTEREST_APP_SECRET}`).toString('base64')
  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: PINTEREST_REFRESH_TOKEN,
    }),
  })
  const body = await res.json()
  if (!res.ok) throw new Error(`Refresh failed: ${JSON.stringify(body)}`)

  saveEnv({
    PINTEREST_ACCESS_TOKEN: body.access_token,
    PINTEREST_REFRESH_TOKEN: body.refresh_token ?? PINTEREST_REFRESH_TOKEN,
  })
  return body.access_token
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const token = await refreshAccessToken()
  console.log('Refreshed. New access token saved to .env.')
}
