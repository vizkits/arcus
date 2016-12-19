'use strict';

const path = require('path');

var TChannel = require('tchannel');

class TChannelAdapter {
    constructor(options) {
        this.cluster = options.cluster;
        this.name = options.name;
        this.host = options.host;
        this.port = options.port;
        this.timeout = options.timeout || 1500;

        this.channel = new TChannel();

        this.appChannel = this.channel.makeSubChannel({
            serviceName: this.cluster,
            peers: [this.host + ':' + this.port],
            requestDefaults: {
                hasNoParent: true,
                headers: {
                    'as': 'raw',
                    'cn': this.name
                }
            }
        });
    }

    request(name, arg1, arg2, callback) {
        this.appChannel.request({
            serviceName: this.cluster,
            timeout: this.timeout,
            headers: {
                sk: this.host + ':' + this.port + '0'
            }
        }).send(name, arg1, arg2, callback);
    }
}

module.exports = TChannelAdapter;