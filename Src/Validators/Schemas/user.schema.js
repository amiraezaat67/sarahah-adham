import Joi from "joi";
import { GenderEnum } from "../../Common/enums/user.enum.js";
import { skillsLevelEnum } from "../../Common/enums/user.enum.js";


export const signupSchema = {
    body: Joi.object({
    firstName:Joi.string().min(3).max(20).required().alphanum().messages({
        "string.min":"First name must be at least 3 characters long",
        "string.max":"First name must be at most 20 characters long",
        "string.alphanum":"First name must contain only letters and numbers",
        "any.required":"First name is required",
    }),
    lastName:Joi.string().min(3).max(20).required().alphanum().messages({
        "string.min":"Last name must be at least 3 characters long",
        "string.max":"Last name must be at most 20 characters long",
        "string.alphanum":"Last name must contain only letters and numbers",
        "any.required":"Last name is required",
    }),
    age:Joi.number().greater(18).less(80).required(),
    gender:Joi.string().valid(...Object.values(GenderEnum)).optional(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    confirmPassword:Joi.string().required().valid(Joi.ref('password')),
    phoneNumber:Joi.string().required(),
    testarrays:Joi.array().items(Joi.string(),Joi.number()).required(),
    isconfirmed:Joi.boolean().required().truthy("true").falsy("false").default(false),
    skills:Joi.array().items(Joi.object({
        name:Joi.string().valid(Joi.in("skillsNames")).required(),
        level:Joi.string().valid(...Object.values(skillsLevelEnum)).required(),
    })).required(),
})

}



