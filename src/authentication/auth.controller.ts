import { Body, Controller, Get, Post, Put, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { authService } from "./auth.service";
import { Request, Response } from 'express';
import { LoginData, signupData } from "./dto/form";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./jwtStrategy/jwtguards";
import { generateJwtToken } from "./jwtStrategy/jwtToken";
import { FileInterceptor} from "@nestjs/platform-express";



@Controller()
export class authController{


    private readonly BackendUrl = process.env.FRONTEND_URL;

    constructor (private authS: authService){
    }

    @Get('generate-2fa')
    @UseGuards(JwtAuthGuard)
    async generateTwoFactorAuthenticationSecret(@Req() req: Request, @Res() res: Response){
        console.log(req.user['userName']);
        const src = await this.authS.TwofactorAuthentication(req.user['userName']);
        res.json(src);
    }

    @Post('validate-2fa')
    @UseGuards(JwtAuthGuard)
    async validateTwoFactorAuthenticationCode(@Req() req: Request, @Body('token') token: string, @Res() res: Response){
        console.log(token);
        const valid = await this.authS.validateTwofactor(token, req.user['userId']);
        res.json(valid);
    }
    
    @Get('disable-2fa')
    @UseGuards(JwtAuthGuard)
    async disableTwoFactorAuthentication(@Req() req: Request, @Res() res: Response){
        const message = await this.authS.disableTwofactor(req.user['userId']);
        res.json(message);
    }

    @Post('signin')
    async loginn(@Body() req: LoginData, @Res() response: Response){
        // console.log(req);
        const user = await this.authS.signin(req);
        if (user.error)
            response.status(400).json(user);
        else
            response.cookie('jwt', generateJwtToken(user.user), {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            }).send({'login': 'login success !'});
    }
    
    @Post('signup')
    async signup(@Body() req: signupData, @Res() response: Response){ 
        const user = await this.authS.signup(req);
        console.log('user',req, user);
        if (user.error)
            response.status(400).json(user.error);
        else
            response.cookie('jwt', generateJwtToken(user.data), {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            }).send(user.data);
    }

    @Get('api/auth/google')
    @UseGuards(AuthGuard("google"))
    googlesignup(@Req() req: Request, @Res() response: Response){
        response.cookie('jwt', req.user['jwt'], {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }).redirect(this.BackendUrl);
    }

    @Get('api/auth/intra')
    @UseGuards(AuthGuard('intra'))
    intraLogin(@Req() request: Request, @Res() response: Response){
         response.cookie('jwt', request.user, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }).redirect(this.BackendUrl);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async user(@Req() request: Request, @Res() res: Response) {
        console.log(request.user);
        const user = await this.authS.findUser(request.user['userId']);
        console.log(request.user['userId']);
        user ? res.json(user) : res.status(404).json({
            statusCode :404,
        });
    }
   
    @Get('logout')
    @UseGuards(JwtAuthGuard)
    async home(@Req() request: Request, @Res() res: Response){
        // console.log(request.user['email']);
        await this.authS.ValidateToken(request.user['userId'], false);
        res.clearCookie('jwt',{
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }).send({'logout': 'logout success !'});
    }

    @Put('/update')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('image') image: string, @Body('userName') userName: string,@Req() req: Request, @Body('Password') password: string , @Res() res: Response){
       
        // console.log(file);
        // console.log(file);
        // console.log(userName);
        // console.log(password);
        
        
        // if (file)
        try {
            const fileBase64 = file.buffer.toString('base64');

            // // You might want to prepend the data URL scheme that indicates the content type, for example:
            const base64DataURI : string = `data:${file.mimetype};base64,${fileBase64}`;
            
            // // console.log(base64DataURI);
            const user = await this.authS.Changedata(req.user['userId'], base64DataURI, userName, password);
        
            console.log(user);
            if (user.error)
                res.status(400).json(user.error);
            else
                res.send('ok');
        } catch (error) {
            if (!image)
                res.status(400).json({error: 'image is required'});
            const user = await this.authS.Changedata(req.user['userId'], image, userName, password);
            if (user.error)
                res.status(400).json(user.error);
            else
                res.send('ok');
        }
    }
}

