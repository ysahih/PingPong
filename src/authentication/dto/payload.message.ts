import { IsString } from "class-validator";
import { type } from "os";

export class Payload {
    @IsString()
    id: string;
    @IsString()
    message: string
}