import { ExecutionContext, Injectable , UnauthorizedException} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Optional: Implement custom behavior for failed authentication

  
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest();
  //   const token = request.headers.authorization.replace('Bearer ', '');

  //   const decodedToken = jwt.decode(token);
  //   const expirationDate = decodedToken; // Convert expiration time to milliseconds
  //   console.log(decodedToken['exp']);
  //   // if (Date.now() > expirationDate.) {
  //   //   throw new UnauthorizedException('Token expired');
  //   // }

  //   return true;
  // }
}
