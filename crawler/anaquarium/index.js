/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const puppeteer = require('puppeteer');
const crypto = require("crypto");
var wget = require('node-wget-promise');
const { Storage } = require('@google-cloud/storage');
const mysql = require("promise-mysql");
var utils = require('./utils.js');

exports.crawlAnaquarium = async (req, res) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--blink-settings=imagesEnabled=false'
    ]
  });
  const page = await browser.newPage();

  const pool = mysql.createPool({
    socketPath: "/cloudsql/" + process.env.PROJECT_ID + ":" + process.env.REGION + ":" + process.env.DBNAME,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: "aquahub",
    connectionLimit: 10
  });
  const start_url = 'http://www.an-aquarium.com/An/news.html';
  await page.goto(start_url);

  var base_urls = [start_url]
  await page.waitForSelector('div > p > font > a');
  var old_pages = await page.mainFrame().$$("div > p > font > a")
  for (let page of old_pages) {
    
    var url = await (await page.getProperty('href')).jsonValue();
    base_urls.push(url);
  }

  for (let base_url of base_urls) {
    if (base_url != start_url) {
      await page.goto(base_url); 
    }

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
      var hash = utils.createHash(utils.extractAnchor(item.url))
      var result;
      await pool.query('SELECT id FROM `article` WHERE `article_id` = ? and force_update = 0', [hash]).then(function(rows){
          result = rows
      });
      if (result.length != 0) {
        continue;
      }
      
      if (item.img != null) {
          let fileName = utils.createFileName(item, hash)
          await wget(item.img, {output: fileName}).then(metadata => {
            utils.upload(fileName)
          });
      }
      await utils.save(pool, item, hash);
      console.log(item)
    }
  }
  await pool.end();
  await browser.close();
  res.send(base_urls);
};
