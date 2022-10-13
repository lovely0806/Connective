import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function register(req, res) {
  const { name, username, email, password } = req.body;


  if (!name || !username || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }


  const findUserByEmail = await prisma.user.findFirst({
    where: {
      email: email,
    },
    select: { email: true },
  });

  const findUserByUsername = await prisma.user.findFirst({
    where: {
      username: username,
    },
    select: { email: true },
  });

   
   //checking which of the values are taken
  if (findUserByEmail && !findUserByUsername) {
    return res.status(400).json({ msg: "this email is taken" });
  } else if (findUserByUsername && !findUserByEmail) {
    return res.status(400).json({ msg: "this username is taken" });
  } else if (findUserByEmail && findUserByUsername) {
    return res.status(400).json({ msg: "username, and email are taken" });
  }

  // hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });


    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json("invalid data");
    }


  } catch (error) {
    res.status(400).json(error.message);
  }

}

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "30d",
  });
};
