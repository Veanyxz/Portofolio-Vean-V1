const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    audio: true,
  });
  const page = await context.newPage();

  const logs = [];
  page.on('console', (msg) => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (e) => logs.push(`[ERROR] ${e.message}`));

  console.log('Opening https://vean.my.id ...');
  await page.goto('https://vean.my.id', { waitUntil: 'networkidle', timeout: 30000 });

  // Click music toggle to start playback
  const toggle = await page.$('#music-toggle');
  console.log('Music toggle found:', !!toggle);
  if (toggle) {
    await toggle.click();
    console.log('Clicked music toggle');
    await page.waitForTimeout(500);
  }

  // Wait for beat detection to potentially fire and add 'beat' class
  await page.waitForTimeout(4000);

  const ring = await page.$('.photo-ring');
  const hasBeat = await ring.evaluate(el => el.classList.contains('beat'));
  console.log('Ring has .beat class:', hasBeat);

  // Take screenshot of profile area
  await page.screenshot({
    path: 'ring-test.png',
    clip: { x: 470, y: 80, width: 420, height: 420 },
  });
  console.log('Screenshot saved: ring-test.png');

  // Check console for beat detection logs
  const beatLogs = logs.filter(l => l.includes('BEAT'));
  console.log('Beat detection logs:', beatLogs.length, beatLogs.slice(0, 5).join(', '));

  // Check for any errors
  const errors = logs.filter(l => l.includes('[ERROR]'));
  console.log('Errors:', errors.length, errors.join(', '));

  await browser.close();

  console.log('\n=== RESULT ===');
  console.log('Has .beat class:', hasBeat);
  console.log('Beat logs:', beatLogs.length);
  console.log('Errors:', errors.length);
  process.exit(errors.length > 0 ? 1 : 0);
})().catch(e => {
  console.error('Test failed:', e.message);
  process.exit(1);
});
