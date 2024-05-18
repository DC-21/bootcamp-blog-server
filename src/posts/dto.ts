import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  constructor(d: CreatePostDto) {
    this.title = d.title;
    this.description = d.description;
    this.image = d.image;
    this.userId = d.userId;
  }
}
