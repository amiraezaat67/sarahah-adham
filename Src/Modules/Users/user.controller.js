import { Router } from "express";
import { signup } from "./Service/user.service.js";
import { update } from "./Service/user.service.js";
import { deleteuser } from "./Service/user.service.js";
import { ListUserService } from "./Service/user.service.js";
import { Signin } from "./Service/user.service.js";
import { confirmotp } from "./Service/user.service.js";
import { logout } from "./Service/user.service.js";
import { authenticationMiddleware } from "../../Middleware/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middleware/authorization.middleware.js";
import { refreshToken } from "./Service/user.service.js";
import { priviledges } from "../../Common/enums/user.enum.js";
import { validationMiddleware } from "../../Middleware/validation.middleware.js";
import { signupSchema } from "../../Validators/Schemas/user.schema.js";
const router = Router();



router.post("/signup",validationMiddleware(signupSchema),signup)
router.put("/update",authenticationMiddleware,update)
router.delete("/delete",authenticationMiddleware,deleteuser)
router.get("/list", authenticationMiddleware,authorizationMiddleware(priviledges.ADMIN),ListUserService)
router.post("/signin",Signin)
router.put("/confirm",confirmotp)
router.post("/logout",authenticationMiddleware,logout)
router.post("/refresh-token",refreshToken)



export default router;