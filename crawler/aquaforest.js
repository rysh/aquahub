const puppeteer = require('puppeteer');
const crypto = require("crypto");
var wget = require('node-wget-promise');
const { Storage } = require('@google-cloud/storage');
const mysql = require("promise-mysql");

(async () => {
  const browser = await puppeteer.launch({
    args: [
      '--blink-settings=imagesEnabled=false'
    ]
  });
  const page = await browser.newPage();

  const pool = mysql.createPool({
    //socketPath: "/cloudsql/" + "$PROJECT_ID:$REGION:$DBNAME",
    host: "127.0.0.1",
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: "aquahub",
    connectionLimit: 10
  });

  await page.goto('http://aquaforest.tokyo/blog-2/');

  await page.waitForSelector('div.excerpt_div > h4 > a');
  var items = await page.mainFrame().$$("div.excerpt_div > h4 > a")
  // var i = 0
  // var urls = ['http://aquaforest.tokyo/2018/11/30/post-37050/']
  var urls = []
  for(let item of items) {

	  var url = await (await item.getProperty('href')).jsonValue();
	  urls.push(url)
  }
  urls.sort();

  
  console.log(urls)
  for(let url of urls) {
    var hash = createHash(url)
    var result;
    await pool.query('SELECT id FROM `article` WHERE `article_id` = ?', [hash]).then(function(rows){
        result = rows
    });
    if (result.length != 0) {
      continue;
    }

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
        await wget(item.img, {output: fileName}).then(metadata => {
          upload(fileName)
        });
    }
    await save(pool, item, url, hash);
    console.log(item)
  }
  await pool.end();
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
function createImageUrl(item,hash) {
  if (item.img == null) {
    return null;
  }
  return 'https://storage.cloud.google.com/aquahub-image/' + createFileName(item, hash)
}
function save(pool, item, url, hash) {
  try {
    return pool.query("insert into article set ?",{
      article_id: hash,
      url: url,
      image_url: createImageUrl(item, hash),
      title: item.title,
      body: item.body,
      force_update: 0
    }); 
  } catch (e) {
    console.log(e)
  }
}