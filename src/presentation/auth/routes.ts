import { Router, Request } from 'express';
import { AuthController } from "./controller";
import { body } from "express-validator";
import { handleInputErrors } from "../../middleware/validation";

export const routerAuth = Router()

routerAuth.post('/create-account', 
    body("name").notEmpty().withMessage("El nombre no puede ser vacio"),
    body("password").isLength({min: 8}).withMessage("El password es muy corto, minimo 8 caracteres"),
    body("password_confirmation").custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Los passowrd no son iguales')
        }
        return true
    }),
    body("email").isEmail().withMessage("Debe ser un email valido"),
    handleInputErrors,
    AuthController.createAccount)

routerAuth.get('/', AuthController.getAllUser)

routerAuth.post('/confirm-account', 
    body("token").notEmpty().withMessage("El token no tiene que ir vacio"),
    handleInputErrors,
    AuthController.confirtAccount)

routerAuth.post("/login",
    body("email").isEmail().withMessage("Debe ser un email valido"),
    body("password").notEmpty().withMessage("El password no debe ir vacio"),
    handleInputErrors,
    AuthController.loginUser
)

routerAuth.post("/request-code",
    body("email").isEmail().withMessage("Debe ser un correo"),
    handleInputErrors,
    AuthController.requestConfirmationCode
)