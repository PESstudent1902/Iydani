import puppeteer from 'puppeteer-core';

(async () => {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Capture console events
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Capture page errors
  page.on('pageerror', err => {
    console.error('[BROWSER EXCEPTION]:', err.toString());
  });

  // Capture failed requests
  page.on('requestfailed', request => {
    console.error('[REQUEST FAILED]:', request.url(), '-', request.failure()?.errorText);
  });

  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 10000 });

  console.log('Waiting 3 seconds for client script execution...');
  await new Promise(r => setTimeout(r, 3000));

  console.log('Extracting body innerHTML...');
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('--------------------------------------------------');
  console.log('HTML Body Content:');
  console.log(html);
  console.log('--------------------------------------------------');

  console.log('Taking screenshot...');
  await page.screenshot({ path: 'C:\\Users\\Vansh\\.gemini\\antigravity\\brain\\57d2c802-5f06-4504-bef0-a2b4ed2fe209\\screenshot.png' });

  await browser.close();
  console.log('Done.');
})().catch(err => {
  console.error('Puppeteer Script Error:', err);
});

