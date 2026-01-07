import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';

export default fp(async (fastify) => {
    fastify.register(jwt, {
        secret: process.env.JWT_SECRET || 'supersecretkey-change-me-in-production',
    });

    fastify.decorate('authenticate', async (request: any, reply: any) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: any;
    }
}
