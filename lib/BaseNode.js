'use strict';

const path = require('path');

const RingpopAdapter = require(path.join(__dirname, 'adapters', 'RingpopAdapter.js'));

class BaseNode {
    constructor(options) {
        this.adapter = new RingpopAdapter(options);
    }

    bootstrap() {
        this.adapter.bootstrap();
    }

    register(name, options, handler) {
        this.adapter.register(name, options, handler);
    }
}

module.exports = BaseNode;
