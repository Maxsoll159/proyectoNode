import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

export class ProjectController {
  static getAllProjects = async (req: any, res: Response) => {
    const projects = await prisma.project.findMany({
      include: {
        task: true,
      },
      where: {
        managerId: req.user.id,
      },
    });
    res.json(projects);
  };

  static createProject = async (req: any, res: Response) => {
    //boyd
    console.log("Hola", req.user);
    const project = await prisma.project.create({
      data: { ...req.body, managerId: req.user.id },
    });

    res.json(project);
  };

  static getIdProject = async (req: any, res: Response) => {
    const id = +req.params.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
      },
    });

    if(!project){
      return res.status(404).json({error: "Projecto no existe"})
    }

    if (project?.managerId !== req?.user?.id) {
      return res.status(400).json({ error: "No tienes autorizacion" });
    } 

    return res.json(project);
  };

  static updateProject = async (req: any, res: Response) => {
    const id = +req.params.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
      },
    });

    if (!project) return res.status(404).json({ error: "El id no ess valudo" });

    if (project?.managerId !== req?.user?.id) {
      return res.status(400).json({ error: "Usted no puede modificar este proyecto" });
    } 

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

  static deleteProject = async (req: any, res: Response) => {
    const id = +req.params.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
      },
    });

    if (!project) return res.status(400).json({ error: "Project no existe" });

    if (project?.managerId !== req?.user?.id) {
      return res.status(400).json({ error: "Usted no puede eliminar este proyecto" });
    } 

    const projectdelete = await prisma.project.delete({
      where: { id },
    });

    res.json(projectdelete);
  };

  static deleteProjectAll = async (req: Request, res: Response) => {
    try {
      const deleteAll = await prisma.project.deleteMany();
      return res.status(200).json({ success: deleteAll });
    } catch (error) {
      return res.status(500).json({ error: "Error servidor" });
    }
  };
}
