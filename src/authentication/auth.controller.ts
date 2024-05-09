import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { authService } from "./auth.service";
import { Request, Response } from "express";
import { LoginData, signupData } from "./dto/form";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "./jwtStrategy/jwtguards";
import { generateJwtToken } from "./jwtStrategy/jwtToken";
import { FileInterceptor } from "@nestjs/platform-express";
import { cloudinaryService } from "./cloudinary.service";



// check in bakend if the user already has 2fa enabled
@Controller()

export class authController {
  private readonly FrontEndUrl = process.env.FRONTEND_URL;
  private readonly BackEndUrl = process.env.BACKEND_URL;

  constructor(private authS: authService, private cloudinaryService: cloudinaryService) {}

  @Get("generate-2fa")
  @UseGuards(JwtAuthGuard)
  async generateTwoFactorAuthenticationSecret(
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log(req.user);
    const src = await this.authS.generateTwoFactorAuthentication(
      req.user["userName"]
    );
    console.log(src);
    res.json(src);
  }

  @Post("disable-2fa")
  @UseGuards(JwtAuthGuard)
  async disableTwoFactorAuthenticationCode(
    @Req() req: Request,
    @Body("token") token: string,
    @Res() res: Response
  ) {
    console.log(token);
    const valid = await this.authS.disableTwofactor(req.user["userId"], token);
    res.json(valid);
  }

  @Post("enable-2fa")
  @UseGuards(JwtAuthGuard)
  async enableTwoFactorAuthenticationCode(
    @Req() req: Request,
    @Body("token") token: string,
    @Res() res: Response
  ) {
    console.log(token);
    const valid = await this.authS.enableTwofactor(req.user["userId"], token);
    res.json(valid);
  }

  @Post("verify-2fa")
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactorAuthenticationCode(
    @Req() req: Request,
    @Body("token") token: string,
    @Res() res: Response
  ) {
    console.log(token);
    const valid = await this.authS.verifyTwofactor(req.user["userId"], token);
    if (valid) await this.authS.ValidateToken(req.user["userId"], true, true);
    res.json(valid);
  }

  @Post("signin")
  async loginn(@Body() req: LoginData, @Res() response: Response) {
    // console.log(req);
    const user = await this.authS.signin(req);
    if (user.error) response.status(400).json(user);
    else
    response.cookie("jwt", generateJwtToken(user.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use 'true' in production
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Use 'none' in production with 'secure: true'
    }).send({ login: "login success !" });
  }

  @Post("signup")
  async signup(@Body() req: signupData, @Res() response: Response) {
    const user = await this.authS.signup(req);
    console.log("user", req, user);
    if (user.error) response.status(400).json(user.error);
    else
      response
        .cookie("jwt", generateJwtToken(user.data), {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .send(user.data);
  }

  @Get("api/auth/google")
  @UseGuards(AuthGuard("google"))
  googlesignup(@Req() req: Request, @Res() response: Response) {
    response
      .cookie("jwt", req.user["jwt"], {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .redirect(this.FrontEndUrl);
  }

  @Get("api/auth/intra")
  @UseGuards(AuthGuard("intra"))
  intraLogin(@Req() request: Request, @Res() response: Response) {
    try {
      response
        .cookie("jwt", request.user, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .redirect(this.FrontEndUrl);
    } catch (error) {
      response.status(400).json({ error: error });
    }
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async user(@Req() request: Request, @Res() res: Response) {
    // console.log(request.user);
    const user = await this.authS.findUser(request.user["userId"]);
    console.log(request.user["userId"]);
    user
      ? res.json(user)
      : res.status(404).json({
          statusCode: 404,
        });
  }

  @Get("logout")
  @UseGuards(JwtAuthGuard)
  async home(@Req() request: Request, @Res() res: Response) {
    await this.authS.ValidateToken(request.user["userId"], false, false);
    res
      .clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .send({ logout: "logout success !" });
  }

  @Put("/update")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("image") image: string,
    @Body("userName") userName: string,
    @Req() req: Request,
    @Body("Password") password: string,
    @Res() res: Response
  ) {
    try {
      console.log(file);
      const ImgUrl = await this.cloudinaryService.uploadImage(file);
      console.log('Imgae----------:  ', ImgUrl);
      // const fileBase64 = file.buffer.toString("base64");
      // const base64DataURI: string = `data:${file.mimetype};base64,${fileBase64}`;
      const base64DataURI: string = ImgUrl;
      const user = await this.authS.Changedata(
        req.user["userId"],
        base64DataURI,
        userName,
        password
      );
      console.log(user);
      if (user.error) res.status(400).json(user.error);
      else {
        const data = {
          id: user.user.id,
          email: user.user.email,
          userName: user.user.userName,
          update: user.user.update,
        };
        res
          .cookie("jwt", generateJwtToken(data), {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .send("ok");
      }
    } catch (error) {
      if (!image) res.status(400).json({ error: "image is required" });
      const user = await this.authS.Changedata(
        req.user["userId"],
        image,
        userName,
        password
      );
      if (user.error) res.status(400).json(user.error);
      else {
        const data = {
          id: user.user.id,
          email: user.user.email,
          userName: user.user.userName,
          update: user.user.update,
        };
        res
          .cookie("jwt", generateJwtToken(data), {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .send("ok");
      }
    }
  }
}
