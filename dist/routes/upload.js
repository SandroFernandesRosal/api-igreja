"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const node_fs_1 = require("node:fs");
const node_stream_1 = require("node:stream");
const node_util_1 = require("node:util");
const pump = (0, node_util_1.promisify)(node_stream_1.pipeline);
async function uploadRoutes(app) {
    app.post('/upload', async (request, reply) => {
        const upload = await request.file({
            limits: {
                fileSize: 5242880, // 5mb
            },
        });
        if (!upload) {
            return reply.status(400).send();
        }
        const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
        const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);
        if (!isValidFileFormat) {
            return reply.status(400).send();
        }
        const fileId = (0, node_crypto_1.randomUUID)();
        const extension = (0, node_path_1.extname)(upload.filename);
        const fileName = fileId.concat(extension);
        const writeStream = (0, node_fs_1.createWriteStream)((0, node_path_1.resolve)(__dirname, '../../uploads/', fileName));
        await pump(upload.file, writeStream);
        const fullUrl = request.protocol.concat('://').concat(request.hostname);
        const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();
        return { fileUrl };
    });
}
exports.uploadRoutes = uploadRoutes;
