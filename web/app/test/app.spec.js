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

  afterEach(async function () {
    // await page.screenshot({ path: `${this.currentTest.title.replace(/\s+/g, '_')}.png` })
    await browser.close();
  });

  it('shows the initial board', async () => {
    const sel = '.card';

    await page.waitForSelector(sel);
    const list = await page.$$(sel);

    expect(list).to.have.length.at.least(12);
  });

  it('selects and unselects an element', async () => {
    const sel = '.card';

    await page.waitForSelector(sel);

    const element = await page.$(`:nth-match(${sel}, 2)`);
    await element.click();
    let classList = await element.getAttribute('class');

    expect(classList).to.include('selected');

    await element.click();
    classList = await element.getAttribute('class');
    expect(classList).to.not.include('selected');
  });
});
