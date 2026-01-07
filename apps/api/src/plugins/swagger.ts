import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export default fp(async (fastify) => {
    fastify.register(swagger, {
        openapi: {
            info: {
                title: 'Splendly API',
                description: 'Splendly Backend API Documentation',
                version: '1.0.0',
            },
        },
    });

    fastify.register(swaggerUi, {
        routePrefix: '/docs',
        staticCSP: true,
    });
});
