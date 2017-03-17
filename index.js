const Hapi = require('hapi');
const Boom = require('boom');
require('dotenv').config();

const dbOpts = {
    url: process.env.MONGODB_CONNECTION_URL,
    settings: {
        poolSize: 10
    },
    decorate: true
};

const server = new Hapi.Server();
server.connection({
    port: process.env.PORT || process.env.SERVER_PORT || 8080,
    host: process.env.SERVER_HOST
});

server.register({
    register: require('hapi-mongodb'),
    options: dbOpts
}, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }

    server.route( {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply({ message: 'Hello world!'});
        }
    });

    server.route( {
        method: 'GET',
        path: '/getRecord',
        handler: function(request, reply) {
            const db = request.mongo.db;

            db.collection('records').findOne({  key: 'chp8vgSkJDbyDKAS' }, function (err, result) {
                if (err) {
                    return reply(Boom.internal('Internal MongoDB error', err));
                }

                reply(result);
            });
        }
    });

    server.start(function() {
        console.log('Server started at ' + server.info.uri);
    });
});