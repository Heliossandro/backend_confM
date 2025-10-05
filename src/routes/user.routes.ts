import { Router } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";

const router = Router();

// Buscar todos os usuários
router.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Criar novo usuário
router.post("/", async (req, res) => {
  const { name, email, password, number } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email já está em uso." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, number },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
});


// Editar usuário
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, number } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email, number },
  });

  res.json(updatedUser);
});

// Apagar usuário
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.$transaction([
      prisma.cartItem.deleteMany({
        where: { cart: { userId: Number(id) } },
      }),
      prisma.cart.deleteMany({
        where: { userId: Number(id) },
      }),
      prisma.user.delete({
        where: { id: Number(id) },
      }),
    ]);

    res.status(200).json({ message: "Usuário e dados associados apagados com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao apagar usuário." });
  }
});



export default router;
