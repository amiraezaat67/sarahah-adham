import { Router } from "express";
// @commet : import all services from message.service.js instead of importing each service alone
// import * as messageService from "./Service/message.service.js";
import { sendMessage } from "./Service/message.service.js";
import { getMessages } from "./Service/message.service.js";
const router = Router();

router.post("/send/:receiverId",sendMessage)
router.get("/",getMessages)


export default router;
