import { loadEnv, saveEnv } from './pinterest-env.mjs'

const redirectUrl = process.argv[2]
if (!redirectUrl) {
  console.error('Usage: node scripts/pinterest-auth-exchange.mjs "<full redirect URL>"')
  process.exit(1)
}

const code = new URL(redirectUrl).searchParams.get('code')
if (!code) {
  console.error('No ?code= found in that URL')
  process.exit(1)
}

const { PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REDIRECT_URI } = loadEnv()
if (!PINTEREST_APP_SECRET) {
  console.error('PINTEREST_APP_SECRET is empty in .env, fill it in first')
  process.exit(1)
}

const basic = Buffer.from(`${PINTEREST_APP_ID}:${PINTEREST_APP_SECRET}`).toString('base64')

const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${basic}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: PINTEREST_REDIRECT_URI,
  }),
})

const body = await res.json()
if (!res.ok) {
  console.error('Token exchange failed:', JSON.stringify(body, null, 2))
  process.exit(1)
}

saveEnv({
  PINTEREST_ACCESS_TOKEN: body.access_token,
  PINTEREST_REFRESH_TOKEN: body.refresh_token,
})

console.log('Success. Access token and refresh token saved to .env.')
console.log('Scopes granted:', body.scope)
