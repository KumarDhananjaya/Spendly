"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const mongodb_1 = __importDefault(require("./plugins/mongodb"));
const jwt_1 = __importDefault(require("./plugins/jwt"));
const swagger_1 = __importDefault(require("./plugins/swagger"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const sync_routes_1 = __importDefault(require("./routes/sync.routes"));
dotenv_1.default.config();
const fastify = (0, fastify_1.default)({
    logger: true,
}).withTypeProvider();
fastify.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
fastify.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
// Register Plugins
fastify.register(mongodb_1.default);
fastify.register(jwt_1.default);
fastify.register(swagger_1.default);
// Register Routes
fastify.register(auth_routes_1.default, { prefix: '/api/auth' });
fastify.register(expense_routes_1.default, { prefix: '/api/expenses' });
fastify.register(sync_routes_1.default, { prefix: '/api/sync' });
const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();
