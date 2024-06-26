import { Router } from "express";
import { UserCollection } from "./collection";

const userRouter = Router();
const usercollection = new UserCollection();

userRouter.post("/signup", usercollection.RegisterUser);
userRouter.post("/login", usercollection.Login);

export default userRouter;
