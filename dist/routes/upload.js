"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRoutes = void 0;
const googleapis_1 = require("googleapis");
const node_crypto_1 = require("node:crypto");
const node_path_1 = require("node:path");
const google_auth_library_1 = require("google-auth-library");
const GOOGLE_API_FOLDER_ID = '1G2Bg5Qs3t5jeB6DM0eZqMUVcwmSaGNzD';
async function uploadRoutes(app) {
    const auth = new google_auth_library_1.GoogleAuth({
        keyFile: './credentials.json',
        scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const client = await auth.getClient();
    const oauth2Client = client;
    app.post('/upload', async (request, reply) => {
        const upload = await request.file({
            limits: {
                fileSize: 5242880, //   5mb
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
        const drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
        const fileMetadata = {
            name: fileName,
            parents: [GOOGLE_API_FOLDER_ID],
        };
        const media = {
            mimeType: upload.mimetype,
            body: upload.file,
        };
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id',
        });
        // Obtenha a URL do arquivo
        const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
        return { fileUrl };
    });
    app.post('/upload/sobre', async (request, reply) => {
        const upload = await request.file({
            limits: {
                fileSize: 50000000, //   50mb
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
        const drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
        const fileMetadata = {
            name: fileName,
            parents: [GOOGLE_API_FOLDER_ID],
        };
        const media = {
            mimeType: upload.mimetype,
            body: upload.file,
        };
        const response = await drive.files.create({
            requestBody: fileMetadata,
            media,
            fields: 'id',
        });
        const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
        return { fileUrl };
    });
}
exports.uploadRoutes = uploadRoutes;
