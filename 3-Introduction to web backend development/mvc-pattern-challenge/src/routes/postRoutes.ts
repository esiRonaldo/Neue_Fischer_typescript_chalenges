import { Router } from "express";
import { showAbout, showContact, showExamplePost, showPost, showPosts } from "../controllers/postController";


const router = Router()

router.get("/", showPosts)
router.get("/posts/:slug", showPost)
router.get("/contact", showContact)
router.get("/about", showAbout);
router.get("/example-post", showExamplePost)

export default router;
