import Fastify from 'fastify';
import dotenv from 'dotenv';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';

import mongodbPlugin from './plugins/mongodb';
import jwtPlugin from './plugins/jwt';
import swaggerPlugin from './plugins/swagger';

import authRoutes from './routes/auth.routes';
import expenseRoutes from './routes/expense.routes';
import syncRoutes from './routes/sync.routes';

dotenv.config();

const fastify = Fastify({
    logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Register Plugins
fastify.register(mongodbPlugin);
fastify.register(jwtPlugin);
fastify.register(swaggerPlugin);

// Register Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(expenseRoutes, { prefix: '/api/expenses' });
fastify.register(syncRoutes, { prefix: '/api/sync' });

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
