import { Router } from "express";
import { prisma } from "../prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Senha incorreta" });
  }

  // Gera token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, "segredo123", {
    expiresIn: "1h",
  });

  return res.json({
    message: "Login bem-sucedido",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

export default router;
