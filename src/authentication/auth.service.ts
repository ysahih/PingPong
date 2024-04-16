import { Injectable } from "@nestjs/common";
import { prismaService } from "src/prisma/prisma.service";
import { LoginData, signupData } from "./dto/form";
import * as argon from "argon2";
import { TwoFactorAuthenticationService } from "./2fa/2fa";

@Injectable({})
export class authService {
  constructor(
    private prism: prismaService,
    private Twofa: TwoFactorAuthenticationService
  ) {}

  async generateUniqueUsername(baseUsername: string): Promise<string> {
    let uniqueUsername = baseUsername;
    let suffix = 0;
    let userExists = true;

    while (userExists) {
      try {
        const user = await this.prism.user.findUnique({
          where: { userName: uniqueUsername },
        });
        if (!user) {
          userExists = false;
        } else {
          if (suffix === 0 && !userExists) return uniqueUsername;
          uniqueUsername = `${baseUsername}${suffix}`;
          suffix++;
        }
      } catch (error) {
        throw new Error(
          "An error occurred while checking for username uniqueness."
        );
      }
    }
    return uniqueUsername;
  }

  async generateTwoFactorAuthentication(userName: string) {
    try {
      const check = await this.prism.user.findUnique({
        where: {
          userName: userName,
        },
        select: {
          twoFa: true,
        },
      });
      if (check.twoFa) return { error: "2fa already enabled" };
      const secret =
        await this.Twofa.generateTwoFactorAuthenticationSecret(userName);
      if (!secret || !secret.secret || !secret.qrCodeData) return null;
      const user = await this.prism.user.update({
        where: {
          userName: userName,
        },
        data: {
          secret: secret.secret,
        },
      });
      if (user) return secret.qrCodeData;
      else return null;
    } catch (error) {
      return null;
    }
  }

  async enableTwofactor(id: number, token: string) {
    try {
      const userd = await this.prism.user.findUnique({
        where: {
          id: id,
        },
        select: {
            secret: true,
        },
      });
      if (!userd || !userd.secret)
        return { message: "2fa not enabled.", status: false };
      const valid = await this.Twofa.isTwoFactorAuthenticationCodeValid(
        userd.secret,
        token
      );
      if (!valid) return { message: "2fa not enabled..", status: false };
      const user = await this.prism.user.update({
        where: {
          id: id,
        },
        data: {
          twoFa: true,
          twofaCheck: true,
        },
      });
      if (user) return { message: "2fa enabled", status: true };
      else return { message: "2fa not enabled...", status: false };
    } catch (error) {
      return { message: "something went wrong 2fa not enabled", status: false };
    }
  }

  async disableTwofactor(id: number, token: string) {
    try {
      const userd = await this.prism.user.findUnique({
        where: {
          id: id,
        },
        select: {
          secret: true,
          twoFa: true,
        },
      });
      if(userd && !userd.twoFa) return { message: "2fa not enabled", status: true };
      if (!userd || !userd.secret || !userd.twoFa)
        return { message: "2fa not disabled", status: false };
      const valid = await this.Twofa.isTwoFactorAuthenticationCodeValid(
        userd.secret,
        token
      );
      if (!valid) return { message: "2fa not disabled", status: false };
      const user = await this.prism.user.update({
        where: {
          id: id,
        },
        data: {
          twoFa: false,
        },
      });
      if (user) return { message: "2fa disabled", status: true };
      else return { message: "2fa not disabled", status: false };
    } catch (error) {
      return {
        message: "something went wrong 2fa not disabled",
        status: false,
      };
    }
  }

  async verifyTwofactor(id: number,token: string ) {
    try {
      const user = await this.prism.user.findUnique({
        where: {
          id,
        },
        select: {
          secret: true,
        },
      });
      if (!user || !user.secret) return false;
      const valid = await this.Twofa.isTwoFactorAuthenticationCodeValid(
        user.secret,
        token
      );
      return valid;
    } catch (error) {
      return false;
    }
  }

  async Changedata(
    id: number,
    image: string,
    userName: string,
    password: string
  ) {
    try {
      const hash = await argon.hash(password);
      const user = await this.prism.user.update({
        where: {
          id,
        },
        data: {
          image,
          update: true,
          hash,
          userName,
        },
      });
      return { user: user };
    } catch (error) {
      return { error: error };
    }
  }

  async signup(req: signupData) {
    console.log(req);
    try {
      const hash = await argon.hash("req.password");
      const username = await this.generateUniqueUsername(req.firstName);
      console.log(username);
      const data = await this.prism.user.create({
        data: {
          email: req.email,
          lastName: req.lastName,
          firstName: req.firstName,
          hash: hash,
          userName: username,
        },
      });
      if (data) delete data.hash;
      // console.log(hash);
      return { data };
    } catch (error) {
      // console.log(error.meta?.target[0]);
      if (error.meta?.target[0])
        return {
          error: {
            message: `this ${error.meta?.target[0]} already exist`,
            target: error.meta?.target[0],
          },
        };
      else return { error: error };
    }
  }

  async findUserCallbak(id: number) {
    try {
      const user = await this.prism.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          userName: true,
          update: true,
        },
      });
      if (user) {
        this.ValidateToken(id, true, false);
      }
      return user || null;
    } catch (error) {
      return { error: error };
    }
  }

  async findUser(id: number) {
    try {
      const user = await this.prism.user.findUnique({
        where: {
          id,
        },
      });
      if (user) {
        await this.ValidateToken(id, true, undefined);
        delete user.hash;
      }
      if (user && !user.token) return null;
      return user || null;
    } catch (error) {
      return { error: error };
    }
  }

  async ValidateToken(id: number, bool: boolean, twoFa: boolean) {
    if(twoFa !== undefined)
    {
      await this.prism.user.update({
        where: {
          id,
        },
        data: {
          token: bool,
          twofaCheck: twoFa,
        },
      });
    }
    else{
      await this.prism.user.update({
        where: {
          id,
        },
        data: {
          token: bool,
        },
      });
    }
  }

  async ValideteUser(email: string, userName: string, image: string, first_name: string = 'null', last_name: string = 'null') {
    try {
      const user = await this.prism.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          userName: true,
          update: true,
        },
      });
      if (user) {
        this.ValidateToken(user.id, true, false);
        return user;
      } else {
        try {
          const username = await this.generateUniqueUsername(userName);
          const hash = await argon.hash("req.password");
          const data = await this.prism.user.create({
            data: {
              email: email,
              hash: hash,
              userName: username,
              firstName: first_name,
              lastName: last_name,
              image: image,
              token: true,
            },
            select: {
              id: true,
              email: true,
              userName: true,
              update: true,
            },
          });
          return data;
        } catch (error) {
          return { error: error };
        }
      }
    } catch (error) {
      return { error: error };
    }
  }

  async updateImage(id: number, image: string) {
    try {
      const user = await this.prism.user.update({
        where: {
          id,
        },
        data: {
          image: image,
        },
      });
      return user;
    } catch (error) {
      return { error: error };
    }
  }

  async signin(req: LoginData) {
    try {
      const user = await this.prism.user.findFirst({
        where: {
          OR: [{ email: req.email }, { userName: req.userName }],
        },
        select: {
          id: true,
          email: true,
          userName: true,
          hash: true,
          update: true,
        },
      });
      if (user && (await argon.verify(user.hash, req.password))) {
        console.log(req.email, "     ", req.userName);
        delete user.hash;
        await this.ValidateToken(user.id, true, false);
        return { user: user };
      } else return { error: "password icorrect !!" };
    } catch (error) {
      return { error: error };
    }
  }
}
