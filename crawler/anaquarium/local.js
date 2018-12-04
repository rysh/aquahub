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
  const base_url = 'http://www.an-aquarium.com/An/news.html';
  await page.goto(base_url);

  await page.waitForSelector('div > p + table');
  var data = await page.evaluate(function() {
    var doms = document.querySelectorAll("div > p + table")
    var data = []
    for(let dom of doms) {
      
      var obj = {}
      obj.body = dom.innerText 

      var body2 = obj.body.replace(/\n/g, '');
      var body3 = body2.replace(/。.*/g, '');
      if (body3.length > 100) {
        body3 = body3.substring(0,100)
      } 
      console.log(body3)
      obj.title = "An aquarium. -" + body3

      if (!!dom.querySelector("img")) {
        obj.img = dom.querySelector("img").src
      } else {
        obj.img = null
      }
      data.push(obj)
    }
    return data
  })

  var items = await page.mainFrame().$$("div > p > a")
  for (  var i = 0;  i < items.length;  i++  ) {
    
    var anchor = await (await items[i].getProperty('name')).jsonValue();
    data[i].url = base_url + "#" + anchor
  }

  for(let item of data) {
    var hash = createHash(extractAnchor(item.url))
    // console.log(hash)
    var result;
    await pool.query('SELECT id FROM `article` WHERE `article_id` = ?', [hash]).then(function(rows){
        result = rows
    });
    if (result.length != 0) {
      continue;
    }
    
    if (item.img != null) {
        let fileName = createFileName(item, hash)
        await wget(item.img, {output: fileName}).then(metadata => {
          upload(fileName)
        });
    }
    await save(pool, item, hash);
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
function extractAnchor(url) {
  let result = url.match(/([^\/#]+)/g);
  return "#" + result[result.length - 1]
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
}
function createImageUrl(item,hash) {
  if (item.img == null) {
    return null;
  }
  return 'https://storage.cloud.google.com/aquahub-image/' + createFileName(item, hash)
}
function save(pool, item, hash) {
  try {
    return pool.query("insert into article set ?",{
      article_id: hash,
      url: item.url,
      image_url: createImageUrl(item, hash),
      title: item.title,
      body: item.body,
      force_update: 0
    }); 
  } catch (e) {
    console.log(e)
  }
}
