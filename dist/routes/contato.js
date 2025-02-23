"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contatoRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function contatoRoutes(app) {
    app.get('/contato', async (request) => {
        const contatos = await prisma_1.prisma.contato.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return contatos;
    });
    app.get('/contato/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const contato = await prisma_1.prisma.contato.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return contato;
    });
    app.post('/contato', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            local: zod_1.z.string(),
            whatsapp: zod_1.z.string(),
            instagram: zod_1.z.string(),
            facebook: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
        });
        const { local, whatsapp, instagram, isPublic, facebook } = bodySchema.parse(request.body);
        const contato = await prisma_1.prisma.contato.create({
            data: {
                local,
                whatsapp,
                instagram,
                facebook,
                isPublic,
                userId: request.user.sub,
            },
        });
        return contato;
    });
    app.put('/contato/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            local: zod_1.z.string(),
            whatsapp: zod_1.z.string(),
            instagram: zod_1.z.string(),
            facebook: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
        });
        const { local, whatsapp, instagram, isPublic, facebook } = bodySchema.parse(request.body);
        let contato = await prisma_1.prisma.contato.findUniqueOrThrow({
            where: {
                id,
            },
        });
        contato = await prisma_1.prisma.contato.update({
            where: {
                id,
            },
            data: {
                local,
                whatsapp,
                instagram,
                facebook,
                isPublic,
            },
        });
        return contato;
    });
    app.delete('/contato/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.contato.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.contato.delete({
            where: {
                id,
            },
        });
    });
}
exports.contatoRoutes = contatoRoutes;
