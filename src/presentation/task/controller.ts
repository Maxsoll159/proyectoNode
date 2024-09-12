import { Request, Response } from "express";
import { prisma } from "../../data/postgres";

export class TaskController {
  static getAllTask = async (req: Request, res: Response) => {
    const taks = await prisma.task.findMany();
    res.json(taks);
  };

  static createTask = async (req: Request, res: Response) => {
    const body = req.body;
    console.log("bodyu", body);
    const newTaks = await prisma.task.create({
      data: body,
    });
    res.json(newTaks);
  };

  static getIdProjectTask = async (req: Request, res: Response) => {
    const projectId = +req.params.projectId;
    const task = await prisma.task.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        project: true,
      },
    });
    res.json(task);
  };

  static getIdTask = async (req: Request, res: Response) => {
    try {
      const id = +req.params.id;
      const task = await prisma.task.findFirst({
        where: { id },
      });
      if (!task) return res.status(400).json({ error: "La tarea no existe" });
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };


  static deleteAllTask = async(req: Request, res: Response) =>{
    try {
      const deleteTaskAll = await prisma.task.deleteMany()
      return res.status(200).json({success: deleteTaskAll})
    } catch (error) {
      return res.status(500).json({error: "Error al borrar task"})
    }
  }
}
