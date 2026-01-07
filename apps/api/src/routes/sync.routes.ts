import { FastifyInstance } from 'fastify';
import { syncController } from '../controllers/sync.controller';

export default async function syncRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', fastify.authenticate);
    fastify.post('/', syncController.sync);
}
