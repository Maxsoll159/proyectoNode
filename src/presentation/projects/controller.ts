import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

export class ProjectController {
  static getAllProjects = async (req: Request, res: Response) => {
    const projects = await prisma.project.findMany({
        include: {
            task: true
        }
    });
    res.json(projects);
  };

  static createProject = async (req: Request, res: Response) => {
    //boyd
    const project = await prisma.project.create({
      data: req.body,
    });
    res.json(project);
  };

  static getIdProject = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
      },
    });

    project
      ? res.json(project)
      : res.status(400).json({ error: "Project no existe" });
  };

  static updateProject = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
      },
    });

    if (!project) return res.status(404).json({ error: "El id no ess valudo" });

    const { projectName, clientName, description } = req.body;
 
    const updateProject = await prisma.project.update({
      where: { id },
      data: {
        projectName: projectName,
        clientName: clientName,
        description: description,
      },
    });
    

    res.json(updateProject);
  };

  static deleteProject = async(req: Request, res:Response) =>{
    const id = +req.params.id


    const project = await prisma.project.findFirst({
        where: {
          id,
        },
      });

    if(!project) return res.status(400).json({error: "Project no existe"})

    const projectdelete = await prisma.project.delete({
        where: {id}
    })


    res.json(projectdelete)

  }
}
