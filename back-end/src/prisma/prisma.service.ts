import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class prismaService extends PrismaClient {
    constructor(){
        super({
            datasources:{
                db: {
                    url: process.env.DATABASE_URL
                },
            },
        });
    }
}