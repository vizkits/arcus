'use strict';

const path = require('path');

const Ringpop = require('ringpop');
const TChannel = require('tchannel');

const RingpopHandler = require(path.join(__dirname, 'RingpopHandler.js'));

class RingpopAdapter {
    constructor(options) {
        this.cluster = options.cluster;
        this.name = options.name;
        this.nodes = options.nodes;
        this.host = options.host || '127.0.0.1';
        this.port = options.port;

        this.channel = new TChannel();
        this.ringpop = new Ringpop({
            app: this.cluster,
            hostPort: this.host + ':' + this.port,
            channel: this.channel.makeSubChannel({
                serviceName: 'ringpop',
                trace: false
            })
        });

        this.appChannel = this.channel.makeSubChannel({
            serviceName: this.cluster
        });

        this.appChannel.handler = new RingpopHandler({
            channel: this.appChannel,
            ringpop: this.ringpop,
            logger: this.channel.logger,
            realHandler: this.appChannel.handler
        });

        this.ringpop.setupChannel();
    }

    bootstrap(cb) {
        const that = this;

        this.channel.listen(this.port, this.host, onListen);

        function onListen() {
            that.ringpop.bootstrap(that.nodes, onBootstrap);
        }

        function onBootstrap() {
            console.log('app: ' + that.name + ' listening on ' +
                that.channel.address().port);
        }
    }

    register(name, options, handler) {
        this.appChannel.register(name, options, handler);
    }
}

module.exports = RingpopAdapter;
