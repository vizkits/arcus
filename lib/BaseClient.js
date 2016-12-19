'use strict';

const path = require('path');

const TChannelAdapter = require(path.join(__dirname, 'adapters', 'TChannelAdapter.js'));

class BaseClient {
    constructor(options) {
        this.adapter = new TChannelAdapter(options);
    }

    request(name, arg1, arg2, callback) {
        this.adapter.request(name, arg1, arg2, callback);
    }
}

module.exports = BaseClient;