import { PrismaClient } from "@prisma/client";
import { generateToken } from "./register";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function login(req, res) {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email
    },
  });

  if (!user) {
  res.status(400).json({msg: "wrong email"});
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(402).json({msg: "passwords don't match"});
  }

  res.json({
    id: user.id,
    name: user.name,
    username: user.name,
    email: user.email,
    token: generateToken(user._id),
    message: "user logged in",
  });
}
