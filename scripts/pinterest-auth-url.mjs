import { loadEnv } from './pinterest-env.mjs'

const { PINTEREST_APP_ID, PINTEREST_REDIRECT_URI } = loadEnv()

const scopes = [
  'boards:read',
  'boards:read_secret',
  'pins:read',
  'pins:read_secret',
  'user_accounts:read',
].join(',')

const url = new URL('https://www.pinterest.com/oauth/')
url.searchParams.set('client_id', PINTEREST_APP_ID)
url.searchParams.set('redirect_uri', PINTEREST_REDIRECT_URI)
url.searchParams.set('response_type', 'code')
url.searchParams.set('scope', scopes)
url.searchParams.set('state', 'savvyhomie-report-setup')

console.log('Open this URL, log in, click Allow:\n')
console.log(url.toString())
console.log('\nAfter approving, the browser will land on a broken localhost page.')
console.log('Copy the FULL address bar text (it has ?code=... in it) and send it back.')
