import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { transporter } from "../utils/mailer";

const router = Router();
const prisma = new PrismaClient();

/**
 * 👉 Criar carrinho com itens
 * body esperado:
 * {
 *   "userId": 1,
 *   "items": [
 *      { "itemId": 2, "quantity": 3 },
 *      { "itemId": 5, "quantity": 1 }
 *   ]
 * }
 */

router.post("/", async (req: Request, res: Response) => {
  const { userId, items } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado" });

    // Cria carrinho
    const cart = await prisma.cart.create({
      data: {
        userId,
        items: {
          create: items.map((item: { itemId: number; quantity: number }) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: { include: { item: true } } },
    });

    // 📨 Email para a loja (tu)
    await transporter.sendMail({
      from: `"Minha Loja" <${process.env.EMAIL_USER}>`,
      to: "zenosama892@gmail.com", // email da loja
      subject: "📦 Nova Compra Recebida",
      html: `
        <h2>Nova compra realizada</h2>
        <p><b>Cliente:</b> ${user.name}</p>
        <p><b>Email:</b> ${user.email}</p>
        <h3>Itens:</h3>
        <ul>
          ${cart.items
            .map(
              (i) =>
                `<li>${i.item.name} - ${i.quantity} x ${i.item.price.toLocaleString(
                  "pt-AO",
                  { style: "currency", currency: "AOA" }
                )}</li>`
            )
            .join("")}
        </ul>
      `,
    });

    // 📨 Email para o cliente
    await transporter.sendMail({
      from: `"Minha Loja" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "💳 Dados para Pagamento da Sua Compra",
      html: `
        <h2>Olá ${user.name}, obrigado pela sua compra! 🎉</h2>
        <p>Segue o resumo do seu pedido:</p>
        <ul>
          ${cart.items
            .map(
              (i) =>
                `<li>${i.item.name} - ${i.quantity} x ${i.item.price.toLocaleString(
                  "pt-AO",
                  { style: "currency", currency: "AOA" }
                )}</li>`
            )
            .join("")}
        </ul>
        <h3>Total: ${cart.items
          .reduce((acc, i) => acc + i.item.price * i.quantity, 0)
          .toLocaleString("pt-AO", {
            style: "currency",
            currency: "AOA",
          })}</h3>
        
        <p><b>IBAN para pagamento:</b> AO06 1234 5678 9012 3456 7890</p>
        <p>Após efetuar o pagamento, responda este email com o comprovativo.</p>
        <br/>
        <p>Atenciosamente, <br/>Equipe da Loja 💖</p>
      `,
    });

    res.status(201).json({ message: "Compra finalizada e emails enviados", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar carrinho e enviar emails" });
  }
});


/**
 * 👉 Listar todos os carrinhos
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const carts = await prisma.cart.findMany({
      include: { items: { include: { item: true } }, user: true },
    });
    res.json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar carrinhos" });
  }
});

/**
 * 👉 Buscar carrinho por ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: Number(id) },
      include: { items: { include: { item: true } }, user: true },
    });

    if (!cart) return res.status(404).json({ error: "Carrinho não encontrado" });

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar carrinho" });
  }
});

/**
 * 👉 Atualizar quantidade de um item do carrinho
 * body esperado:
 * { "quantity": 5 }
 */
router.put("/item/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedItem = await prisma.cartItem.update({
      where: { id: Number(id) },
      data: { quantity },
    });
    res.json(updatedItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar item do carrinho" });
  }
});

/**
 * 👉 Remover um item do carrinho
 */
router.delete("/item/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.cartItem.delete({ where: { id: Number(id) } });
    res.json({ message: "Item removido do carrinho" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover item" });
  }
});

/**
 * 👉 Remover carrinho inteiro
 */
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.cart.delete({ where: { id: Number(id) } });
    res.json({ message: "Carrinho removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao remover carrinho" });
  }
});

export default router;
