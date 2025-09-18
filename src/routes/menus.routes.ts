import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

// ✅ 1. Listar todos os menus
router.get("/", async (req, res) => {
  try {
    const menus = await prisma.menu.findMany();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar menus" });
  }
});

// ✅ 2. Buscar um menu por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: Number(id) },
      include: { items: true },
    });

    if (!menu) return res.status(404).json({ error: "Menu não encontrado" });

    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar menu" });
  }
});

// ✅ 3. Criar um novo menu
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const newMenu = await prisma.menu.create({
      data: { name },
    });
    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar menu" });
  }
});

// ✅ 4. Atualizar um menu
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedMenu = await prisma.menu.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.json(updatedMenu);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar menu" });
  }
});

// ✅ 5. Deletar um menu
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.menu.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Menu deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar menu" });
  }
});

export default router;
