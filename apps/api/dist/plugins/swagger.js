"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(swagger_1.default, {
        openapi: {
            info: {
                title: 'Splendly API',
                description: 'Splendly Backend API Documentation',
                version: '1.0.0',
            },
        },
    });
    fastify.register(swagger_ui_1.default, {
        routePrefix: '/docs',
        staticCSP: true,
    });
});
