import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import bcrypt from "bcrypt";
import { generate6digitToken } from "../../utils/token";
import { transporter } from "../../config/nodemailer";
import { error } from "console";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const userExist = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (userExist) return res.status(409).json({ error: "Ocurrio un Error" });

      const salt = await bcrypt.genSalt(15);

      const userBodyPart = {
        name: body.name,
        password: await bcrypt.hash(body.password, salt),
        email: body.email,
        confirmed: false,
      };

      const newUser = await prisma.user.create({
        data: userBodyPart,
      });

      const token = await prisma.token.create({
        data: {
          token: generate6digitToken(),
          userId: newUser.id,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      await transporter.sendMail({
        from: `UpTask <${newUser.email}>`,
        to: newUser.email,
        subject: "Confirma tu cuenta",
        html: `<p>Probando emaicl ${token.token}</p>`,
      });

      res.status(200).json({ status: 200 });
    } catch (error) {
      res.status(500).json({ error: "Ocurrio un Error" });
    }
  };

  static getAllUser = async (req: Request, res: Response) => {
    const user = await prisma.user.findMany();
    res.json(user);
  };

  static confirtAccount = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      console.log("body", body);

      const tokenConfird = await prisma.token.findFirst({
        where: {
          token: body.token,
        },
      });

 
      if (!tokenConfird)
        return res.status(400).json({ error: "token invalido" });

      if (new Date() > tokenConfird.expiresAt) {
        return res.status(400).json({
          error: "Token expiro",
        });
      }

      const user = await prisma.user.findFirst({
        where: {
          token: {
            some: {
              token: body.token,
            },
          },
        },
      });

      if (!user) {
        return res.status(400).json({ error: "invalidate user" });
      }
      const updateUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          confirmed: true, // Cambiar `confirmed` a true
        },
      });

      return res.status(200).json({
        success: "Usuario autenticado",
      });
    } catch (error) {
      res.status(500).json({
        error: "Ocurrio un error",
      });
    }
  };
}
