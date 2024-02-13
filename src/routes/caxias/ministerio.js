"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ministerioRoutesCaxias = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../lib/prisma");
async function ministerioRoutesCaxias(app) {
    app.get('/ministerio/caxias', async (request) => {
        const ministerios = await prisma_1.prisma.ministerioCaxias.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return ministerios.map((ministerio) => {
            return {
                id: ministerio.id,
                name: ministerio.name,
                title: ministerio.title,
                local: ministerio.local,
                createdAt: ministerio.createdAt,
                coverUrl: ministerio.coverUrl,
            };
        });
    });
    app.get('/minsterio/caxias/:id', async (request, reply) => {
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        const ministerio = await prisma_1.prisma.ministerioCaxias.findUniqueOrThrow({
            where: {
                id,
            },
        });
        if (!ministerio.isPublic && ministerio.userId !== request.user.sub) {
            return reply.status(401).send();
        }
        return ministerio;
    });
    app.post('/ministerio/caxias', async (request) => {
        await request.jwtVerify();
        const bodySchema = zod_1.z.object({
            name: zod_1.z.string(),
            title: zod_1.z.string(),
            local: zod_1.z.string(),
            isPublic: zod_1.z.coerce.boolean().default(false),
            coverUrl: zod_1.z.string(),
        });
        const { name, title, isPublic, local, coverUrl } = bodySchema.parse(request.body);
        const ministerio = await prisma_1.prisma.ministerioCaxias.create({
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
    app.put('/ministerio/caxias/:id', async (request, reply) => {
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
        let ministerio = await prisma_1.prisma.ministerioCaxias.findUniqueOrThrow({
            where: {
                id,
            },
        });
        ministerio = await prisma_1.prisma.ministerioCaxias.update({
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
    app.delete('/ministerio/caxias/:id', async (request, reply) => {
        await request.jwtVerify();
        const paramsSchema = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = paramsSchema.parse(request.params);
        await prisma_1.prisma.ministerioCaxias.findUniqueOrThrow({
            where: {
                id,
            },
        });
        await prisma_1.prisma.ministerioCaxias.delete({
            where: {
                id,
            },
        });
    });
}
exports.ministerioRoutesCaxias = ministerioRoutesCaxias;
