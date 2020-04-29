const puppeteer = require('puppeteer');

(async () =>{
  const browser = await puppeteer.launch({"headless": false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  await page.setViewport({width:0, height:0});
  await page.goto("http://localhost:5000");

  await page.type("#Uname", 'a@ractrainer.com');
  await page.type('#password', "test12345");

  await Promise.all([
    page.waitForNavigation(),
    page.click('#btnLogin')
  ]);

  await page.screenshot({path: 'login.png'});

  await Promise.all([
    page.waitForNavigation(),
    page.click('#startBtn')
  ]);



  await page.screenshot({path: 'startGame.png'});

  await page.click('#startButton');
  for(var i = 0; i < 40; i++){
     page.keyboard.press('Space');
    await page.waitFor(499);
  }


  await page.waitFor(100000);


  await page.screenshot({path: 'score.png'});

  await browser.close();
})();
