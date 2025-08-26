import { Router } from "express";
import { sendMessage } from "./Service/message.service.js";
import { getMessages } from "./Service/message.service.js";
const router = Router();

router.post("/send/:receiverId",sendMessage)
router.get("/",getMessages)


export default router;
