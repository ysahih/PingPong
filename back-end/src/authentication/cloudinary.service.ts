import { Injectable } from '@nestjs/common';
import {v2 as cloudinary} from 'cloudinary';
          


@Injectable()
export class  cloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }

    async uploadImage(file: Express.Multer.File) {
        try {
            let result : any;
            if (file.path) { // File is saved to disk
              result = await cloudinary.uploader.upload(file.path);
            } else if (file.buffer) { // File is in memory
              const uploadResponse = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { resource_type: 'image', folder: 'ProfileImages'},
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                  }
                );
                stream.end(file.buffer);
              });
              result = uploadResponse;
            } else {
              throw new Error('File not available');
            }
        
            return result ? result.secure_url : null;
          } catch (error) {
           
            return null;
          }
    }
}
