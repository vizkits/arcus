
const BaseClient = require('../lib/BaseClient.js');

const client = new BaseClient({
    cluster: 'test',
    name: 'client',
    host: '127.0.0.1',
    port: 4040
});

client.request('hello', 'arg1', 'arg2', (err, res, arg2, arg3) => {
    if (err) {
        console.log(err);
    } else {
        console.log('normal res:', {
            arg2: arg2.toString(),
            arg3: arg3.toString()
        });
    }
});
