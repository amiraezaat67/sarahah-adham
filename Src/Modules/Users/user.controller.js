import { Router } from "express";
/** @commet : import all services from user.service.js instead of importing each service alone */
// import * as userService from "./Service/user.service.js";
import { signup } from "./Service/user.service.js";
import { update } from "./Service/user.service.js";
import { deleteuser } from "./Service/user.service.js";
import { ListUserService } from "./Service/user.service.js";
import { Signin } from "./Service/user.service.js";
import { confirmotp } from "./Service/user.service.js";
import { logout } from "./Service/user.service.js";
/** @commet : see the clean up video to re-construct the project structure due to the scalability of the project */
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
router.get("/list", authenticationMiddleware,authorizationMiddleware(priviledges.ADMIN),ListUserService) // make sure from the naming convention of the services, should be listUser not ListUserService
router.post("/signin",Signin) // make sure from the naming convention of the services, should be singin not Signin
router.put("/confirm",confirmotp)
router.post("/logout",authenticationMiddleware,logout)
router.post("/refresh-token",refreshToken)



export default router;