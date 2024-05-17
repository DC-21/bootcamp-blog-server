import { Request, Response } from "express";
import { RegisterUserDto } from "./dto";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { hash } from "bcrypt";

export class UserCollection {
  async RegisterUser(req: Request, res: Response) {
    try {
      const dto = new RegisterUserDto(req.body);

      const errors = await validate(dto);
      if (errors.length > 0) {
        return res.status(StatusCodes.CONFLICT).json({
          error: errors.map((e) => e.constraints),
        });
      }

      const isEmail = await prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (isEmail) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "user already exists",
        });
      }

      const hashPassword = await hash(dto.password, 10);

      const user = await prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          password: hashPassword,
        },
      });

      return res.status(StatusCodes.CREATED).json(user);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "something went wrong",
        error: error || error.message,
      });
    }
  }
}
