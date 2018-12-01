const puppeteer = require('puppeteer');
const crypto = require("crypto");
var wget = require('node-wget');
const { Storage } = require('@google-cloud/storage');

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--blink-settings=imagesEnabled=false'
    ]
});
  const page = await browser.newPage();
  // await page.goto('http://aquaforest.tokyo/blog-2/');

  // await page.waitForSelector('div.excerpt_div > h4 > a');
  // var items = await page.mainFrame().$$("div.excerpt_div > h4 > a")
  // var i = 0
  var urls = ['http://aquaforest.tokyo/2018/11/30/post-37050/']
  // for(let item of items) {

	 //  var url = await (await item.getProperty('href')).jsonValue();
	 //  urls.push(url)
	  
	 //  //await page.waitForNavigation();
	 //  //await page.screenshot({path: 'example' + i++ + '.png'});
  // }

  
  console.log(urls)
  for(let url of urls) {
    var hash = createHash(url)
    await page.goto(url);
    await page.waitForSelector('div.entry-content');
    
    var item = await page.evaluate(function() {

      var imgTag = document.querySelector("div.entry-content img")
      var src = null;
      if (imgTag != null) {
        src = imgTag.src
      }
      return {
          title: document.querySelector("title").innerText,
          body: document.querySelector("div.entry-content").innerText,
          img: src
        };
    })
    if (item.img != null) {
        let fileName = createFileName(item, hash)
        wget({url: item.img, dest: fileName}, () => {
          upload(fileName)
        });
    }
    console.log(item)
  }
  
  await browser.close();
})();

function createHash(url) {
  var sha256 = crypto.createHash('sha256');
  sha256.update(url)
  return sha256.digest('hex');
}
function createFileName(item, hash) {
  let result = item.img.match(/([^\/.]+)/g);
  return hash + "." + result[result.length - 1]
}
function upload(file) {
  const storage = new Storage();
  storage.bucket("aquahub-image").upload(file, {
    gzip: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
  //https://storage.cloud.google.com/aquahub-image/c1249d26837990fc9a2d7404426fb9ba4fc3a40468dec8008b4a66a8afbfc60d.jpg
}

