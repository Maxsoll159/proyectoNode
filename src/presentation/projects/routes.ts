import { Router } from "express";
import { ProjectController } from "./controller";
import { body, param } from "express-validator";
import { handleInputErrors } from "../../middleware/validation";
import { authenticate } from "../../middleware/auth";


export const routerProjects = Router()

routerProjects.get('/',  ProjectController.getAllProjects)


routerProjects.post("/", 
    body('projectName').notEmpty().withMessage('El nombre del projecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('El nombre del description es obligatorio'),
    handleInputErrors,
    ProjectController.createProject)

routerProjects.get('/:id',  
    param("id").notEmpty().withMessage('ID NO VALIDADO').isInt().withMessage('El ID debe ser un número entero'),
    handleInputErrors,
    ProjectController.getIdProject)

routerProjects.patch("/:id",
    param("id").notEmpty().withMessage('ID NO VALIDADO').isInt().withMessage('El ID debe ser un número entero'),
    handleInputErrors,
    ProjectController.updateProject
)

routerProjects.delete("/:id",
    param("id").notEmpty().withMessage('ID NO VALIDADO').isInt().withMessage('El ID debe ser un número entero'),
    handleInputErrors,
    ProjectController.deleteProject
)


routerProjects.delete("/", 
    handleInputErrors,
    ProjectController.deleteProjectAll
)