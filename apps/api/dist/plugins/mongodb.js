"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/splendly';
    try {
        await mongoose_1.default.connect(mongoUrl);
        fastify.log.info('Connected to MongoDB via Mongoose');
        fastify.decorate('mongoose', mongoose_1.default);
        fastify.addHook('onClose', async () => {
            await mongoose_1.default.connection.close();
        });
    }
    catch (error) {
        fastify.log.error({ err: error }, 'Error connecting to MongoDB');
        process.exit(1);
    }
});
