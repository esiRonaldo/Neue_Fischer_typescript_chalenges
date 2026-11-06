import { Router } from "express";
import {
    listAdminPosts,
    showNewPostForm,
    createPost,
    showEditPostForm,
    saveEditedPost,
    removePost,
} from "../controllers/adminController";

const router = Router();

router.get("/", listAdminPosts);
router.get("/posts/new", showNewPostForm);
router.post("/posts", createPost);
router.get("/posts/:slug/edit", showEditPostForm);
router.post("/posts/:slug", saveEditedPost);
router.post("/posts/:slug/delete", removePost);

export default router;
