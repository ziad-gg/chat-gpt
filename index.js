const puppeteer = require('puppeteer')
require('dotenv').config();

async function login() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://chat.openai.com/login');
    await page.waitForSelector('#email');
    await page.type('#email', process.env.OPENAI_EMAIL);
    await page.type('#password', process.env.OPENAI_PASSWORD);
    await page.click('#submit-button');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await browser.close();
}
  
login()