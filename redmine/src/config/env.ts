import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    REDMINE_BASE_URL: process.env.REDMINE_BASE_URL!,
    REDMINE_API_KEY: process.env.REDMINE_API_KEY!,
    REDMINE_PROJECT_ID: Number(process.env.REDMINE_PROJECT_ID) || 393,
    REDMINE_ASIGNACIONES_A_MI: process.env.REDMINE_ASIGNACIONES_A_MI!
};