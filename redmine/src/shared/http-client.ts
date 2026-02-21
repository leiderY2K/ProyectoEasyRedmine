import axios from "axios";
import https from "https";

export const httpClient = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});