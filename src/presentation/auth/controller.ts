import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import bcrypt from "bcrypt";
import { generate6digitToken } from "../../utils/token";
import { transporter } from "../../config/nodemailer";
import { error } from "console";
import { generateJWT } from "../../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const body = req.body;

      const userExist = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (userExist) return res.status(404).json({ error: "usuario existe" });

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

  static loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      if (!user.confirmed) {
        const token = await prisma.token.create({
          data: {
            token: generate6digitToken(),
            userId: user.id,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        });

        await transporter.sendMail({
          from: `UpTask <${user.email}>`,
          to: user.email,
          subject: "Confirma tu cuenta",
          html: `<p>Correo de confirmacion ${token.token}</p>`,
        });

        return res
          .status(401)
          .json({ error: "Usuario no confirmado, se te envio un email" });
      }

      const isPassWordCorrect = await bcrypt.compare(password, user.password);

      if (!isPassWordCorrect)
        return res.status(400).json({ error: "Contraseña incorrecta" });

      const userFormat = {
        id: user.id,
        name: user.name,
        email: user.email,
        confirmed: user.confirmed
      }

      res.status(200).json({
        ...userFormat,
        token: generateJWT(userFormat)
      });

    } catch (error) {
      res.status(500).json({
        error: "Ocurrio un error",
      });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!user)
        return res.status(400).json({ error: "usuario no encontrado" });

      if(user.confirmed) res.status(400).json({error: "Token ya confirmado"})

      const token = await prisma.token.create({
        data: {
          token: generate6digitToken(),
          userId: user.id,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      await transporter.sendMail({
        from: `UpTask <${user.email}>`,
        to: user.email,
        subject: "Confirma tu cuenta",
        html: `<p>Correo de confirmacion ${token.token}</p>`,
      });

      return res
        .status(200)
        .json({ success: "Se envio el token correctamente" });

      
    } catch (error) {}
  };


  static forgotPassword = async(req: Request, res:Response) =>{
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!user)
        return res.status(400).json({ error: "usuario no encontrado" });

      await transporter.sendMail({
        from: `UpTask <${user.email}>`,
        to: user.email,
        subject: "Restablecer contraseña",
        html: `<p>Ingresa al link para restablecer tu contraseña</p>`,
      });
      return res
      .status(200)
      .json({ success: "Se envio correctamente el email" });


    } catch (error) {
      
    }
  }

}
