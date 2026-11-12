import { Router } from "express";
import {
    createPostApi,
    replacePostApi,
    deletePostApi,
} from "../controllers/apiController";

const router = Router();

router.post("/posts", createPostApi);
router.put("/posts/:slug", replacePostApi);
router.delete("/posts/:slug", deletePostApi);

export default router;
