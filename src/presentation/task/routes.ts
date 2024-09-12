import { Router } from "express";
import { TaskController } from "./controller";
import { body, param } from "express-validator";
import { handleInputErrors } from '../../middleware/validation';

export const routerTask = Router();

routerTask.get("/", TaskController.getAllTask);

routerTask.post(
  "/",
  body("name").notEmpty().withMessage("El name del projecto es obligatorio"),
  body("description").notEmpty().withMessage("la description obligatorio"),
  body("status")
    .notEmpty()
    .withMessage("El status es obligatorio")
    .isIn(["peding", "onHold", "inProgress", "underReview", "completed"])
    .withMessage('El status debe ser "peding", "onHold", "inProgress", "underReview", "completed"'),
  body("projectId").notEmpty().withMessage("El projectId es obligatorio"),
  handleInputErrors,
  TaskController.createTask
);

routerTask.get('/projectId/:projectId', 
    param("id").notEmpty().withMessage('ID NO VALIDADO').isInt().withMessage('El ID debe ser un número entero'),
    handleInputErrors,
    TaskController.getIdProjectTask)

routerTask.get("/:id", 
    param("id").notEmpty().withMessage('ID NO VALIDADO').isInt().withMessage('El ID debe ser un número entero'),
    handleInputErrors,      
    TaskController.getIdTask
)


routerTask.delete("/",
  TaskController.deleteAllTask
)