"use strict";
const path = require('path');
const fs = require('fs');

class StoreJson {
  constructor(data, filename) {
    this.data = data;
  }

  save (filename, cb) {
    fs.writeFile(filename, JSON.stringify(this.data), cb);
  }
}

module.exports = StoreJson;
