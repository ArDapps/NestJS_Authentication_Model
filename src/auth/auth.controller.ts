import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";

import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dtos/register.dto";
import { Request } from "express";
import * as bcrypt from "bcryptjs";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  @Post("register")
  async register(@Body() body: RegisterDto, @Req() request: Request) {
    const { password_confirm, ...data } = body;
    if (body.password !== password_confirm) {
      throw new BadRequestException("Passwords Do Not Mattch");
    }

    const hashed_password = await bcrypt.hash(body.password, 12);

    return this.userService.save({
      ...data,
      password: hashed_password,
      createdBy: data.firstName,
      lastChangedBy: data.firstName,
    });
  }
}
