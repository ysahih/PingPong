import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// @Injectable()
// export class IntraGuard extends AuthGuard('intra'){
//     async canActivate(context: ExecutionContext){
//         const Activate = (await super.canActivate(context)) as boolean;
//         const request = context.switchToHttp().getRequest();
//         await super.logIn(request);
//         return Activate;
//     }
// }