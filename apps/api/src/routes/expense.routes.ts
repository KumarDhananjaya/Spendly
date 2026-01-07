import { FastifyInstance } from 'fastify';
import { expenseController } from '../controllers/expense.controller';

export default async function expenseRoutes(fastify: FastifyInstance) {
    fastify.addHook('onRequest', fastify.authenticate);
    fastify.get('/', expenseController.list);
    fastify.post('/', expenseController.create);
}
