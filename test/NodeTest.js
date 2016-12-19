
const BaseNode = require('../lib/BaseNode.js');

const node1 = new BaseNode({
    cluster: 'test',
    name: 'app1',
    port: 4040,
    nodes: ['127.0.0.1:4040', '127.0.0.1:4041']
});

const node2 = new BaseNode({
    cluster: 'test',
    name: 'app2',
    port: 4041,
    nodes: ['127.0.0.1:4040', '127.0.0.1:4041']
});


node1.register('hello', (req, res, arg2, arg3) => {
    res.headers.as = 'raw';
    res.sendOk('result', 'hello from node1 for ' + req.headers.sk);
});
node1.bootstrap();

node2.register('hello', (req, res, arg2, arg3) => {
    res.headers.as = 'raw';
    res.sendOk('result', 'hello from node2 for ' + req.headers.sk);
});

node2.bootstrap();