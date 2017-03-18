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
        method: ['GET', 'POST'],
        path: '/getRecord',
        handler: function(request, reply) {
            const db = request.mongo.db;

            db.collection('records').findOne({  key: 'chp8vgSkJDbyDKAS' }, { key: 1, value: 1, createdAt:1, _id: 0 }, function (err, result) {
                if (err) {
                    return reply(Boom.internal('Internal MongoDB error', err));
                }

                if(result.createdAt && result.createdAt instanceof Date)
                {
                    result.createdAt = result.createdAt.toISOString().split('T')[0];
                }

                if(result.value && result.value.length > 45)
                    result.value = result.value.substring(0,45);

                reply(result);
            });
        }
    });

    server.start(function() {
        console.log('Server started at ' + server.info.uri);
    });
});