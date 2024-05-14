/// <reference types="multer" />
export declare class cloudinaryService {
    constructor();
    uploadImage(file: Express.Multer.File): Promise<any>;
}
