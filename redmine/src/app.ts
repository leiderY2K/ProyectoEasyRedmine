import express from "express";
import cors from "cors";
import imputacionesRouter from "./modules/imputaciones/imputaciones.router";
import { errorMiddleware } from "./shared/middlewares/error.middleware";

const app = express();

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

app.use("/api/imputaciones", imputacionesRouter);
// app.use("/api/proyectos", proyectosRouter);  
// app.use("/api/usuarios", usuariosRouter);

app.use(errorMiddleware);

export default app;