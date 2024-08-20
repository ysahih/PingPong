import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class IntraAuthGuard extends AuthGuard('intra'){
    async canActivate(context: ExecutionContext){
        try{
            const Activate = (await super.canActivate(context)) as boolean;
            const request = context.switchToHttp().getRequest();
            await super.logIn(request);
            return Activate;
        }
        catch (error){
         
            throw new UnauthorizedException();
        }
    }
}
