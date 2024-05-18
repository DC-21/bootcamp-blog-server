import { Router } from "express";
import { PostCollection } from "./collection";

const postRouter = Router();
const postCollection = new PostCollection();

postRouter.post("/create", postCollection.Create);
postRouter.get("/fetch", postCollection.FindAll);
postRouter.get("/fetch/:userId", postCollection.FindByUserId);
postRouter.delete("/delete/:id", postCollection.Delete);

export default postRouter;
