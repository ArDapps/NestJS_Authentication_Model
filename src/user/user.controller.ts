import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Get } from "@nestjs/common";

@Controller("user")
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.find();
  }
}
