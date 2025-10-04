import express from "express";
import cors from "cors"
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import  menusRoutes from "./routes/menus.routes"
import itemRoutes from "./routes/item.routes"
import cartRoutes from "./routes/cart.routes"

const app = express();
const PORT = 5000;

app.use(cors())
app.use(express.json())

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do sistema de gestão da confeitaria");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/menus", menusRoutes)
app.use("/items", itemRoutes)
app.use("/cart", cartRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
