import { Request, Response, NextFunction } from "express";
import { procesarImputaciones, PayloadImputaciones, obtenerMisPeticionesAplicacion, obtenerActividadesAplicacion, obtenerMisPeticionesGenAplicacion } from "./imputaciones.service";

export async function postImputaciones(req: Request, res: Response, next: NextFunction) {
    try {
        const payload: PayloadImputaciones = req.body;

        if (!payload || Object.keys(payload).length === 0) {
            return res.status(400).json({ error: "El payload no puede estar vacío" });
        }

        const resultados = await procesarImputaciones(payload);
        const hayErrores = resultados.detalle.some(r => r.status === "error");

        return res.status(hayErrores ? 207 : 200).json({
            message: hayErrores ? "Algunas imputaciones fallaron" : "Todas las imputaciones fueron exitosas",
            resultados
        });

    } catch (error) {
        next(error);
    }
}

export async function getMisPeticiones(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const peticiones = await obtenerMisPeticionesAplicacion(process.env.REDMINE_API_KEY!);
        return res.json(peticiones);

    } catch (error) {
        next(error);
    }
}

export async function getActividades(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const actividades = await obtenerActividadesAplicacion(process.env.REDMINE_API_KEY!);

        const tracker = req.query['tracker'] as string | undefined;

        if (tracker) {
            const trackerLower = tracker.toLowerCase();
            const filtradas = actividades.filter(act => {
                const match = act.name.match(/\((.*?)\)/);
                const tipo = match ? match[1].toLowerCase() : '';
                return tipo && trackerLower.includes(tipo);
            });
            return res.json(filtradas);
        }

        return res.json(actividades);
    } catch (error) {
        next(error);
    }
}

export async function getPeticionesGenerales(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const peticiones = await obtenerMisPeticionesGenAplicacion(process.env.REDMINE_API_KEY!);
        return res.json(peticiones);
    } catch (error) {
        next(error);
    }
}