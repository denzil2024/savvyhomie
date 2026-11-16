export const config = {
  matcher: '/(.*)',
}

const allowedCountries = new Set([
  'US', 'GB', 'CA', 'AU',
  'DE', 'FR', 'NL', 'IE', 'CH', 'SE', 'NO', 'DK', 'FI',
  'KE',
])

const botUA = /googlebot|bingbot|duckduckbot|slurp|baiduspider|yandexbot|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|gptbot|claudebot|perplexitybot|ahrefsbot|semrushbot|mj12bot/i

export default function middleware(req) {
  const country = req.headers.get('x-vercel-ip-country')
  const userAgent = req.headers.get('user-agent') || ''
  const isBot = botUA.test(userAgent)

  if (!isBot && country && !allowedCountries.has(country)) {
    return new Response('Access denied', { status: 403 })
  }
}
