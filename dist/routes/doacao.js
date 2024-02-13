"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doacaoRoutes = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function doacaoRoutes(app) {
    app.get('/doacao', async (request) => {
        const doacoes = await prisma_1.prisma.doacao.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return doacoes.map((doacao) => {
            return {
                id: doacao.id,
                local: doacao.local,
                banco: doacao.banco,
                conta: doacao.conta,
                agencia: doacao.agencia,
                nomebanco: doacao.nomebanco,
                pix: doacao.pix,
                nomepix: doacao.nomepix,
                createdAt: doacao.createdAt,
            };
        });
    });
    app.get('/doacao/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const doacao = await prisma_1.prisma.doacao.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return doacao;
    });
    app.post('/doacao', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            local: zod_1.z.string(),
            banco: zod_1.z.string(),
            conta: zod_1.z.string(),
            agencia: zod_1.z.string(),
            nomebanco: zod_1.z.string(),
            pix: zod_1.z.string(),
            nomepix: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
        });
        const { local, banco, conta, agencia, nomebanco, pix, nomepix, isPublic } = bodySchema.parse(request.body);
        const doacao = await prisma_1.prisma.doacao.create({
            data: {
                local,
                banco,
                conta,
                agencia,
                nomebanco,
                pix,
                nomepix,
                isPublic,
                userId: request.user.sub,
            },
        });
        return doacao;
    });
    app.put('/doacao/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            local: zod_1.z.string(),
            banco: zod_1.z.string(),
            conta: zod_1.z.string(),
            agencia: zod_1.z.string(),
            nomebanco: zod_1.z.string(),
            pix: zod_1.z.string(),
            nomepix: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
        });
        const { local, banco, conta, agencia, nomebanco, pix, nomepix, isPublic } = bodySchema.parse(request.body);
        let doacao = await prisma_1.prisma.doacao.findUniqueOrThrow({
            where: {
                id,
            },
        });
        doacao = await prisma_1.prisma.doacao.update({
            where: {
                id,
            },
            data: {
                local,
                banco,
                conta,
                agencia,
                nomebanco,
                pix,
                nomepix,
                isPublic,
            },
        });
        return doacao;
    });
    app.delete('/doacao/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.doacao.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.doacao.delete({
            where: {
                id,
            },
        });
    });
}
exports.doacaoRoutes = doacaoRoutes;
