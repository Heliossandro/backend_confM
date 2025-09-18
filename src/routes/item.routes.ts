/* model Item {
  id       Int    @id @default(autoincrement())
  name     String
  price    Float   
  description String
  menuId   Int

  menu     Menu   @relation(fields: [menuId], references: [id])
  cartItems CartItem[]
} */

import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

router.get("/", async(req,res) =>{
    try{
         const items = await prisma.item.findMany()
         res.json(items)
    } catch (error){
        res.status(500).json({error: "Erro ao buscar itens"})
    }
})

router.get("/:id", async(req,res) =>{
    const {id} = req.params
    try{
        const item = await prisma.item.findUnique({
            where: {id: Number(id)},
            include: {menu: true},
        })

        if (!item) return res.status(404).json({ error: "item não encontrado" });
    }catch(error){
        res.status(500).json({error: "Erro ao buscar item"})
    }
})

router.post("/", async(req,res) =>{
    const {name, price, description, menuId} = req.body

    if(!name || !price || !description || !menuId){
        return res.status(400).json({error: "Todos os campos são obrigatorios"})
    }
    
    try{

    }catch{

    }
})