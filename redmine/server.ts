import app from "./src/app";
import { ENV } from "./src/config/env";

app.listen(ENV.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${ENV.PORT}`);
});