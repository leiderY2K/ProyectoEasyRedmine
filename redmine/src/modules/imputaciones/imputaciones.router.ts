import { Router } from "express";
import { postImputaciones, getMisPeticiones, getActividades, getPeticionesGenerales } from "./imputaciones.controller";

const router = Router();

router.post("/", postImputaciones);
router.get("/mis-peticiones", getMisPeticiones);
router.get("/peticiones-generales", getPeticionesGenerales);
router.get("/actividades", getActividades);

export default router;