# Google Search Console Checklist

## Status

| Item | Status | Notes |
|------|--------|-------|
| Verification file | Working | `google5c024d9bf4b6d156.html` returns 200 OK |
| robots.txt | Working | Accessible, sitemap URL included |
| Sitemap (deployed) | STALE | Old version with dead pages still live -- **push commits to deploy** |
| Sitemap (committed) | Fixed | 4 live pages only, ready to deploy |

## After You Push

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select property `ahtesham.dev.wadwarehouse.com` (or add it if not there)
3. Sitemaps > Submit: `https://ahtesham.dev.wadwarehouse.com/sitemap.xml`
4. URL Inspection > test your homepage URL
5. Check "Coverage" tab for any 404 errors from old pages -- Google will eventually drop them

## When You Get a Custom Domain

1. Add the new domain as a property in GSC
2. Use "Change of Address" tool to migrate from wadwarehouse subdomain
3. Update sitemap.xml, robots.txt, and resubmit
