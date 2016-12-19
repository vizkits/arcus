'use strict';

const RelayRequest = require('tchannel/relay_handler').RelayRequest;

class RingpopHandler {
    constructor(options) {
        
        this.realHandler = options.realHandler;
        this.ringpop = options.ringpop;
        this.channel = options.channel;
        this.logger = options.logger;

        // Blacklist of methods that will not be 'auto-sharded' but instead will
        // be passed thru to the handler. Object mapping names to boolean.
        this.blacklist = options.blacklist || null;

        this.type = 'tchannel.endpoint-handler';
    }

    handleRequest(req, buildRes) {
        if (this.blacklist && this.blacklist[req.endpoint]) {
            return this.realHandler.handleRequest(req, buildRes);
        }

        const shardKey = req.headers.sk;
        if (!shardKey) {
            this.logger.warn('Ringpop got request without a shardKey', {
                socketRemoteAddr: req.remoteAddr,
                serviceName: req.serviceName,
                endpoint: req.endpoint,
                callerName: req.headers.cn,
                headers: req.headers,
                local: this.ringpop.whoami()
            });
            return buildRes().sendError(
                'BadRequest',
                '[ringpop] Request does not have sk header set'
            );
        }

        const dest = this.resolveHost(shardKey);
        console.log('dest: ' + dest);
        console.log('whoami: ' + this.ringpop.whoami());
        if (this.ringpop.whoami() === dest) {
            return this.realHandler.handleRequest(req, buildRes);
        }

        const peer = this.channel.peers.add(dest);
        const outreq = new RelayRequest(this.channel, peer, req, buildRes);
        outreq.createOutRequest();
    };

    resolveHost(shardKey) {
        return this.ringpop.lookup(shardKey);
    };

    register(arg1, fn) {
        this.realHandler.register(arg1, fn);
    }
}

module.exports = RingpopHandler;
