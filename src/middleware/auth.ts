import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from "../data/postgres";

export const authenticate = async(req: any, res: Response, next:NextFunction) =>{
    const bearer = req.headers.authorization
    console.log("bearer", bearer)
    if(!bearer){
        return res.status(400).json({error: "No Authorizado"})
    }

    console.log(req.headers.authorization)
    
    const token = bearer.split(' ')[1]

    try {
        const decoded = jwt.verify(token, "palabrasecret")

        if(typeof decoded === 'object' && decoded.id){
            const user = await prisma.user.findFirst({
                where: {
                    id: decoded.id,
                }
            })
            if(user){
                req.user = user
            }else{
               return res.status(500).json({error: "Error usuiaro no existe"})
            }
        }

        
    } catch (error) {
        return res.status(500).json({error: "Token no valido"})
    }

    next()
}