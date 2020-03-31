const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://ractrainer.firebaseapp.com/');

  // type in username and passsword to login
  await page.type('#Uname', 'test@ractrainer.com')
  await page.type('#password', 'aaaaaa')


  await page.screenshot({path: 'example.png'}); // take a screenshot of the login page with given login input

  // click the login button and navigate to the param page
  await Promise.all([
      page.waitForNavigation(),
      page.click('#btnLogin')
  ]);

  const bpm = await page.$('#BPM');
  await bpm.click({clickCount:3}) // click on input 3 times to highlight all
  await bpm.type('120') // type in 120 to the BPM on param page


  await page.screenshot({path: 'example2.png'}); // take screenshot after changing BPM

  await browser.close();
})();
