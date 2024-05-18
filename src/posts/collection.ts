import { Request, Response } from "express";
import { CreatePostDto } from "./dto";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";

export class PostCollection {
  async Create(req: Request, res: Response) {
    try {
      const dto = new CreatePostDto(req.body);

      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(StatusCodes.CONFLICT).json({
          error: errors.map((e) => e.constraints),
        });
      }

      const post = await prisma.post.create({
        data: {
          title: dto.title,
          description: dto.description,
          image: dto.image,
          userId: dto.userId,
        },
      });

      return res.status(StatusCodes.CREATED).json(post);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: " something went wrong",
        error: error.message || error,
      });
    }
  }

  async FindAll(_req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany();

      return res.status(StatusCodes.ACCEPTED).json(posts);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message || error,
        message: "something went wrong",
      });
    }
  }

  async FindByUserId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);

      const posts = await prisma.post.findMany({
        where: {
          userId: userId,
        },
      });

      return res.status(StatusCodes.ACCEPTED).json(posts);
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message || error,
        message: "something went wrong",
      });
    }
  }

  async Delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      await prisma.post.delete({
        where: {
          id: id,
        },
      });

      return res.status(StatusCodes.ACCEPTED).json({
        message: "post has been deleted",
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error.message || error,
        message: "something went wrong",
      });
    }
  }
}
