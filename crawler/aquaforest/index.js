/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
const puppeteer = require('puppeteer');
const crypto = require("crypto");
const mysql = require("mysql");

exports.helloGET = async (req, res) => {
  var title = "default";
  var scrapingData = {};
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  // const c = mysql.createConnection({
  //   socketPath: "/cloudsql/" + "$PROJECT_ID:$REGION:$DBNAME",
  //   user: "$USER",
  //   password: "$PASS",
  //   database: "$DATABASE"
  // });
  // c.connect();

  var urls = ['http://aquaforest.tokyo/2018/11/26/post-36961/']

  for(let url of urls) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(url)
    var hash = sha256.digest('hex')

    // c.query(`SELECT * FROM table`, (e, results) => {
    //   // callback
    // })

    await page.goto(url);
    await page.waitForSelector('div.entry-content');
    scrapingData = await page.evaluate(() => {
        return {
          title: document.querySelector("title").innerText,
          body: document.querySelector("div.entry-content").innerHtml
        };
    });
  }
  res.send(scrapingData);
};