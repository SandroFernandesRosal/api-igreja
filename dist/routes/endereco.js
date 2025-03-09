"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enderecoRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function enderecoRoutes(app) {
    app.get('/endereco', async (request) => {
        const enderecos = await prisma_1.prisma.endereco.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return enderecos;
    });
    app.get('/endereco/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const endereco = await prisma_1.prisma.endereco.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return endereco;
    });
    app.post('/endereco', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            local: zod_1.z.string(),
            rua: zod_1.z.string(),
            cep: zod_1.z.string(),
            numero: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
        });
        const { local, rua, isPublic, cep, numero } = bodySchema.parse(request.body);
        const endereco = await prisma_1.prisma.endereco.create({
            data: {
                local,
                rua,
                cep,
                numero,
                isPublic,
                userId: request.user.sub,
            },
        });
        return endereco;
    });
    app.put('/endereco/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            local: zod_1.z.string(),
            rua: zod_1.z.string(),
            cep: zod_1.z.string(),
            numero: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
        });
        const { local, rua, isPublic, cep, numero } = bodySchema.parse(request.body);
        let endereco = await prisma_1.prisma.endereco.findUniqueOrThrow({
            where: {
                id,
            },
        });
        endereco = await prisma_1.prisma.endereco.update({
            where: {
                id,
            },
            data: {
                local,
                rua,
                cep,
                numero,
                isPublic,
            },
        });
        return endereco;
    });
    app.delete('/endereco/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.endereco.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.endereco.delete({
            where: {
                id,
            },
        });
    });
}
exports.enderecoRoutes = enderecoRoutes;
