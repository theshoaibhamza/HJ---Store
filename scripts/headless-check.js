const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const consoleMsgs = [];
    const pageErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      const text = msg.text();
      consoleMsgs.push({ type: msg.type(), text });
    });

    page.on('pageerror', err => {
      pageErrors.push(String(err));
    });

    page.on('requestfailed', req => {
      const f = req.failure() || {};
      failedRequests.push({ url: req.url(), reason: f.errorText || f });
    });

    console.log('Navigating to http://localhost:8000 ...');
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Allow some time for lazy scripts to run
    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log('\n--- CONSOLE MESSAGES ---');
    consoleMsgs.forEach(m => console.log(`[${m.type}] ${m.text}`));

    console.log('\n--- PAGE ERRORS ---');
    pageErrors.forEach(e => console.error(e));

    console.log('\n--- FAILED REQUESTS ---');
    failedRequests.forEach(r => console.error(`${r.url} => ${r.reason}`));

    const hasProblems = consoleMsgs.some(m => m.type === 'error' || m.type === 'warning') || pageErrors.length > 0 || failedRequests.length > 0;
    process.exit(hasProblems ? 1 : 0);
  } catch (err) {
    console.error('Headless check failed:', err);
    process.exit(2);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();