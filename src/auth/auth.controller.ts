import { User } from "./../user/user.entity";
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";

import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { Request, Response } from "express";
import * as bcrypt from "bcryptjs";
import { AuthGuard } from "./auth.guard";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post("register")
  async register(@Body(ValidationPipe) body: RegisterDto) {
    const { password_confirm, ...data } = body;
    if (body.password !== password_confirm) {
      throw new BadRequestException("Passwords Do Not Mattch");
    }

    const hashed_password = await bcrypt.hash(body.password, 12);

    return this.userService.save({
      ...data,
      password: hashed_password,
      createdBy: data.email,
      lastChangedBy: data.email,
    });
  }

  @Post("login")
  async login(
    @Body("email") email: string,
    @Body("password") password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    console.log(email, password);

    const user = await this.userService.findOne({ email });

    console.log(user);
    if (!user) {
      throw new NotFoundException("User Not Found,please create a new user");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException("Invalid Cridentials");
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
    });

    response.cookie("jwt", jwt, { httpOnly: true });

    return {
      message: "Login Success",
      token: jwt,
    };
  }

  @UseGuards(AuthGuard)
  @Post("user/update")
  async updateUserInfo(
    @Body("email") email: string,
    @Body("firstName") firstName: string,
    @Body("lastName") lastName: string,

    @Req() request: Request
  ) {
    const jwt = request.cookies["jwt"];

    const { id } = await this.jwtService.verifyAsync(jwt);

    await this.userService.update(id, { firstName, lastName, email });
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async userProfile(@Req() request: Request) {
    const jwt = request.cookies["jwt"];

    const { id } = await this.jwtService.verifyAsync(jwt);

    const user = await this.userService.findOne({ id });

    console.log(user);
    if (!user) {
      throw new NotFoundException("User Not Found,please create a new user");
    }

    return {
      me: user,
    };
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("jwt");

    return {
      message: "User logged out",
    };
  }
}
