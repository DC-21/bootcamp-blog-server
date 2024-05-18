import { Request, Response } from "express";
import { LoginDto, RegisterUserDto } from "./dto";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { hash, compare } from "bcrypt";
import * as jwt from "jsonwebtoken";

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

  async Login(req: Request, res: Response) {
    try {
      const dto = new LoginDto(req.body);

      const errors = await validate(dto);

      if (errors.length) {
        return res.status(StatusCodes.CONFLICT).json({
          error: errors.map((e) => e.constraints),
        });
      }

      const findUser = await prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!findUser) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "user not found",
        });
      }

      const passwordMatch = await compare(dto.password, findUser.password);

      if (!passwordMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "incorrect password",
        });
      }

      const payload = {
        id: findUser.id,
        username: findUser.username,
        email: findUser.email,
      };

      const token = jwt.sign(payload, `${process.env.SECRETE_KEY}`);

      return res.status(StatusCodes.ACCEPTED).json({
        token: token,
        user: payload,
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error || error.message,
        message: "something went wrong",
      });
    }
  }
}
