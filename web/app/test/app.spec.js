const { webkit } = require('playwright');
const { expect } = require('chai');

const BASE_URL = 'http://localhost:8080';

describe('App.jsx', () => {

  let page, browser, context;

  beforeEach(async () => {
    browser = await webkit.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(BASE_URL);
  });

  afterEach(async function() {
    // await page.screenshot({ path: `${this.currentTest.title.replace(/\s+/g, '_')}.png` })
    await browser.close()
  });

  it('shows the initial board', async () => {
    const sel = '.card'; 

    await page.waitForResponse(/start$/);
    const list = await page.$$(sel);

    expect(list).to.have.length.at.least(12);
  });
});