
const assert = require('assert');
const utils = require('../utils');


describe("utils test", function(){
  it("createHash:", function(){
  	var hash = utils.createHash("hoge")
  	assert.equal("ecb666d778725ec97307044d642bf4d160aabb76f56c0069c71ea25b1e926825", hash);
  });
});