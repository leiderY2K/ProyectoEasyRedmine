import { httpClient } from "../../shared/http-client";
import { ENV } from "../../config/env";
import { mapToIssueResumen, mapToActividad } from "./imputaciones.mapper";

export interface EntradaTiempo {
    imputationDate: string;
    hours: number;
    comment: string;
    activityId: string;
}

export interface ResultadoImputacion {
    issueId: string | number;
    comments: string;
    status: "ok" | "error";
    error?: any;
}

export type PayloadImputaciones = Record<number, EntradaTiempo[]>;

export async function procesarImputaciones(payload: PayloadImputaciones) {
    const resultados: ResultadoImputacion[] = [];
    const exitosos = resultados.filter(r => r.status === 'ok');
    const fallidos = resultados.filter(r => r.status === 'error');

    for (const [issueId, entradas] of Object.entries(payload)) {
        for (const entrada of entradas) {
            try {
                await httpClient.post(
                    `${ENV.REDMINE_BASE_URL}/time_entries.json`,
                    {
                        time_entry: {
                            project_id: ENV.REDMINE_PROJECT_ID,
                            issue_id: Number(issueId),
                            spent_on: entrada.imputationDate, //"2026-02-19"
                            hours: entrada.hours,
                            comments: entrada.comment,
                            activity_id: entrada.activityId
                        }
                    },
                    {
                        headers: {
                            "X-Redmine-API-Key": ENV.REDMINE_API_KEY,
                            "Content-Type": "application/json"
                        }
                    }
                );

                resultados.push({ issueId, comments: entrada.comment, status: "ok" });
                console.log(`Imputado issue ${issueId} - ${entrada.comment}`);

            } catch (error: any) {
                resultados.push({ issueId, comments: entrada.comment, status: "error", error: error.response?.data || error.message });
                console.error(`Error issue ${issueId}:`, error.response?.data || error.message);
            }
        }
    }

    return {
        success: fallidos.length === 0,
        imputadas: exitosos.length,
        errores: fallidos.length,
        detalle: resultados
    };
}

export async function obtenerMisPeticiones(apiKey: string) {
    const response = await httpClient.get(
        `${ENV.REDMINE_BASE_URL}/issues.json`,
        {
            params: {
                assigned_to_id: "me",
                status_id: "open"
            },
            headers: {
                "X-Redmine-API-Key": apiKey
            }
        }
    );

    return response.data;
}

export async function obtenerActividades(apiKey: string) {
    const response = await httpClient.get(
        `${ENV.REDMINE_BASE_URL}/enumerations/time_entry_activities.json`,
        {
            headers: {
                "X-Redmine-API-Key": apiKey
            }
        }
    );
    return response.data;
}

export async function obtenerPeticionesGenerales(apiKey: string) {
    const response = await httpClient.get(
        `${ENV.REDMINE_BASE_URL}/issues.json`,
        {
            params: {
                watcher_id: "me"
            },
            headers: {
                "X-Redmine-API-Key": apiKey
            }
        }
    );
    return response.data;
}

export async function obtenerMisPeticionesAplicacion(apiKey: string) {
    const redmineData = await obtenerMisPeticiones(apiKey);
    return mapToIssueResumen(redmineData);
}

export async function obtenerMisPeticionesGenAplicacion(apiKey: string) {
    const redmineDataActGen = await obtenerPeticionesGenerales(apiKey);
    return mapToIssueResumen(redmineDataActGen);
}

export async function obtenerActividadesAplicacion(apiKey: string) {
    const redmineDataAct = await obtenerActividades(apiKey);
    return mapToActividad(redmineDataAct);
}
