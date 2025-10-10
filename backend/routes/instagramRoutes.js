import express from "express";
import { generateCaption, uploadToInstagram } from "./controllers/instagramController.js";

const router = express.Router();

router.post("/generate", generateCaption);
router.post("/upload", uploadToInstagram);

export default router;
