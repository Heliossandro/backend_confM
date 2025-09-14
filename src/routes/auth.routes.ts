import { Router } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

// segredo do JWT (em produção, usar variável de ambiente!)
const JWT_SECRET = "minha_chave_secreta";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // procurar usuário
  const user = await prisma.user.findUnique({ where:{email}});

  if (!user) {
    return res.status(401).json({ success: false, message: "Usuário não encontrado" });
  }

  // verificar senha
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ success: false, message: "Senha incorreta" });
  }

  // gerar token JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  res.json({
    success: true,
    message: "Login bem-sucedido",
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export default router;
