require('dotenv').config();
const puppeteer = require('puppeteer');

(async () =>{
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:5000");


  await page.type("#Uname", 'admin@ractrainer.com');
  await page.type('#password', process.env.ADMINPASS);




  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnLogin')
  ]);

  await page.waitFor(1000);

    await page.screenshot({path: 'rPortal.png'});
  //await page.waitFor(2000);
  const aHandle = await page.evaluateHandle(() => document.body);
  const resultHandle = await page.evaluateHandle(aHandle => {
    const element =  page.$('[href="createuser.html"]');
  }, aHandle);


    await Promise.all([
      page.waitForNavigation(),
      page.click(element)
     ]);

    await page.screenshot({path: 'createUser.png'});

  await browser.close();
})();
