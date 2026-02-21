import { Request, Response, NextFunction } from "express";

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(" Error:", err.message);
    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
}