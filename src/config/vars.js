import path from 'path';

// import .env variables
require('dotenv-safe').load({
    path: path.join(__dirname, '../../.env'),
    sample: path.join(__dirname, '../../.env.example')
});

module.exports = {
    serviceName: 'report_service',
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    logs: process.env.NODE_ENV === 'production'
        ? 'combined'
        : 'dev',
    postgres: {
        uri: process.env.NODE_ENV === 'production'
            ? process.env.POSTGRES_URI
            : process.env.POSTGRES_URI_TEST
    },
    mongo: {
        uri:
            process.env.NODE_ENV === 'production'
                ? process.env.MONGO_URI
                : process.env.MONGO_URI_TEST
    },
    rabbit: {
        uri: process.env.RABBITMQ_URI
    },
    redis: {
        uri: process.env.REDIS_URI
    },
    otherServices: {
        manager: process.env.MANAGER_SERVICE_URL
    }
};
