"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let cloudinaryService = class cloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    async uploadImage(file) {
        try {
            let result;
            if (file.path) {
                result = await cloudinary_1.v2.uploader.upload(file.path);
            }
            else if (file.buffer) {
                const uploadResponse = await new Promise((resolve, reject) => {
                    const stream = cloudinary_1.v2.uploader.upload_stream({ resource_type: 'auto', folder: 'ProfileImages' }, (error, result) => {
                        if (error)
                            reject(error);
                        else
                            resolve(result);
                    });
                    stream.end(file.buffer);
                });
                result = uploadResponse;
            }
            else {
                throw new Error('File not available');
            }
            return result ? result.secure_url : null;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
};
exports.cloudinaryService = cloudinaryService;
exports.cloudinaryService = cloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], cloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map