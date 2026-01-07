import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export default fp(async (fastify) => {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/splendly';

    try {
        await mongoose.connect(mongoUrl);
        fastify.log.info('Connected to MongoDB via Mongoose');

        fastify.decorate('mongoose', mongoose);

        fastify.addHook('onClose', async () => {
            await mongoose.connection.close();
        });
    } catch (error) {
        fastify.log.error({ err: error }, 'Error connecting to MongoDB');
        process.exit(1);
    }
});

declare module 'fastify' {
    interface FastifyInstance {
        mongoose: typeof mongoose;
    }
}
