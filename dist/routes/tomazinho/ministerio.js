"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ministerioRoutesTomazinho = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function ministerioRoutesTomazinho(app) {
    app.get('/ministerio/tomazinho', async (request) => {
        const offsetQuery = request.query.offset;
        const offset = offsetQuery ? parseInt(offsetQuery, 10) : 0;
        const itemsPerPage = 12;
        const ministerio = await prisma_1.prisma.ministerioTomazinho.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            skip: offset,
            take: itemsPerPage,
        });
        return ministerio;
    });
    app.get('/minsterio/tomazinho/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const ministerio = await prisma_1.prisma.ministerioTomazinho.findUniqueOrThrow({
            where: {
                id,
            },
        });
        return ministerio;
    });
    app.post('/ministerio/tomazinho', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            title: zod_1.z.string(),
            local: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            coverUrl: zod_1.z.string(),
        });
        const { name, title, isPublic, local, coverUrl } = bodySchema.parse(request.body);
        const ministerio = await prisma_1.prisma.ministerioTomazinho.create({
            data: {
                name,
                title,
                local,
                isPublic,
                userId: request.user.sub,
                coverUrl,
            },
        });
        return ministerio;
    });
    app.put('/ministerio/tomazinho/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            title: zod_1.z.string(),
            local: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            coverUrl: zod_1.z.string(),
        });
        const { name, title, isPublic, local, coverUrl } = bodySchema.parse(request.body);
        let ministerio = await prisma_1.prisma.ministerioTomazinho.findUniqueOrThrow({
            where: {
                id,
            },
        });
        ministerio = await prisma_1.prisma.ministerioTomazinho.update({
            where: {
                id,
            },
            data: {
                name,
                title,
                local,
                isPublic,
                coverUrl,
            },
        });
        return ministerio;
    });
    app.delete('/ministerio/tomazinho/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.ministerioTomazinho.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.ministerioTomazinho.delete({
            where: {
                id,
            },
        });
    });
}
exports.ministerioRoutesTomazinho = ministerioRoutesTomazinho;
