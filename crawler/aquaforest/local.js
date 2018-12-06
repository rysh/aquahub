const puppeteer = require('puppeteer');
const crypto = require("crypto");
var wget = require('node-wget-promise');
const { Storage } = require('@google-cloud/storage');
const mysql = require("promise-mysql");
var utils = require('../utils.js');

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
  var urls = []
  for(let item of items) {

	  var url = await (await item.getProperty('href')).jsonValue();
	  urls.push(url)
  }
  urls.sort();

  
  console.log(urls)
  for(let url of urls) {
    var hash = utils.createHash(url)
    var result;
    await pool.query('SELECT id FROM `article` WHERE `article_id` = ? and force_update = 0', [hash]).then(function(rows){
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
    item.url = url
    if (item.img != null) {
        let fileName = utils.createFileName(item, hash)
        await wget(item.img, {output: fileName}).then(metadata => {
          utils.upload(fileName)
        });
    }
    await utils.save(pool, item, hash);
    console.log(item)
  }
  await pool.end();
  await browser.close();
})();
