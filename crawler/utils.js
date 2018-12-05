const crypto = require("crypto");
const { Storage } = require('@google-cloud/storage');
const utils = {
  createHash : function (url) {
    var sha256 = crypto.createHash('sha256');
    sha256.update(url)
    return sha256.digest('hex');
  },
  extractAnchor: function (url) {
    let result = url.match(/([^\/#]+)/g);
    return "#" + result[result.length - 1]
  },
  extractAnchor: function (url) {
    let result = url.match(/([^\/#]+)/g);
    return "#" + result[result.length - 1]
  },
  createFileName: function (item, hash) {
    let result = item.img.match(/([^\/.]+)/g);
    return hash + "." + result[result.length - 1]
  },
  upload: function(file) {
    const s = new Storage();
    s.bucket("aquahub-image").upload(file, {
      gzip: true,
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });
  },
  createImageUrl: function(item,hash) {
    if (item.img == null) {
      return null;
    }
    return 'https://storage.cloud.google.com/aquahub-image/' + createFileName(item, hash)
  },
  save: async function(pool, item, hash) {
    try {
      await pool.query('SELECT id FROM `article` WHERE `article_id` = ?', [hash]).then(function(rows){
          result = rows
      });
      if (result.length != 0) {
        return pool.query("update article set url = ?, body= ?, force_update=0 where article_id = ?", [item.url, item.body, hash]); 
      } else {
        return pool.query("insert into article set ?",{
          article_id: hash,
          url: item.url,
          image_url: createImageUrl(item, hash),
          title: item.title,
          body: item.body,
          force_update: 0
        }); 
      }
    } catch (e) {
      console.log(e)
    }
  }
}
module.exports = utils;





