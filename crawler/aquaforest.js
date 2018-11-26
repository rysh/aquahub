const puppeteer = require('puppeteer');
const crypto = require("crypto");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.goto('http://aquaforest.tokyo/blog-2/');

  // await page.waitForSelector('div.excerpt_div > h4 > a');
  // var items = await page.mainFrame().$$("div.excerpt_div > h4 > a")
  // var i = 0
  var urls = ['http://aquaforest.tokyo/2018/11/26/post-36961/']
  // for(let item of items) {

	 //  var url = await (await item.getProperty('href')).jsonValue();
	 //  urls.push(url)
	  
	 //  //await page.waitForNavigation();
	 //  //await page.screenshot({path: 'example' + i++ + '.png'});
  // }

  for(let url of urls) {
var sha256 = crypto.createHash('sha256');
sha256.update(url)
var hash = sha256.digest('hex')
console.log(hash)
}
  console.log(urls)
  for(let url of urls) {
    await page.goto(url);
    await page.waitForSelector('div.entry-content');

    let item = await page.evaluate(el => el.innerHTML, (await page.$("div.entry-content"))); 
    console.log(item)
  }
  
  await browser.close();
})();
