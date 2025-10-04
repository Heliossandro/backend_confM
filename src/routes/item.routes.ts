import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar itens" });
  }
});

// GET BY ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: Number(id) },
      include: { menu: true },
    });

    if (!item) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar item" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  const { name, price, description, menuId, status } = req.body;

  if (!name || !price || !description || !menuId || !status ) {
    return res
      .status(400)
      .json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        price: Number(price),
        description,
        menuId: Number(menuId),
        status,
      },
    });


    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, description, menuId, status } = req.body;

  try {
    const updatedItem = await prisma.item.update({
      where: { id: Number(id) },
      data: {
        name,
        price: Number(price),
        description,
        menuId: Number(menuId),
        status,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar item" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.item.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Item deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar item" });
  }
});

export default router;
