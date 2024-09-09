import jwt from "jsonwebtoken";

interface Props{
    id: number,
    name: string,
    email: string,
    confirmed: boolean
}
const secret = process.env.JWT_SECRET || 'default_secret';

export const generateJWT = (user: any) => {
  const token = jwt.sign(user, secret, {
    expiresIn: "5d",
  });

  return token
};
