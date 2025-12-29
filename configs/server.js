"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import axios from "axios";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import { dbConnection } from "./mongo.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import cursoRoutes from "../src/cursos/cursos.routes.js";
import materiaRoutes from "../src/materia/materia.routes.js";
import asignacionRoutes from "../src/asignacionEstudiante/asignacionEstudiante.routes.js";
import calificacionRoutes from "../src/calificacion/calificacion.routes.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";
import { crearAdmin } from "./admin-default.js";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    // Helmet con CSP desactivado para Swagger UI
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
        })
    );
    app.use(morgan("dev"));
    app.use(apiLimiter);
    // Para subir archivos estaticos
    app.use("/uploads", express.static(join(CURRENT_DIR, "../public/uploads")));
};

const routes = (app) => {
    app.get("/ping", (req, res) => {
        res.status(200).json({ message: "pong" });
    });
    
    // Endpoint JSON de la documentación Swagger
    app.get("/sistemaEducativo/v1/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerDocs);
    });
    
    // Swagger UI con HTML personalizado (funciona en Vercel)
    app.get("/sistemaEducativo/v1/api-docs", (req, res) => {
        const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Educativo API - Documentación</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
    <style>
        html { box-sizing: border-box; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin: 0; background: #fafafa; }
        .topbar { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            SwaggerUIBundle({
                url: window.location.origin + "/sistemaEducativo/v1/api-docs.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>`;
        res.setHeader("Content-Type", "text/html");
        res.send(html);
    });
    
    // Rutas del proyecto
    app.use("/sistemaEducativo/v1/auth", authRoutes);
    app.use("/sistemaEducativo/v1/users", userRoutes);
    app.use("/sistemaEducativo/v1/cursos", cursoRoutes);
    app.use("/sistemaEducativo/v1/materias", materiaRoutes);
    app.use("/sistemaEducativo/v1/asignaciones", asignacionRoutes);
    app.use("/sistemaEducativo/v1/calificaciones", calificacionRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        await crearAdmin();
        
    } catch (err) {
        console.log(`Database connection failed: ${err}`);
        process.exit(1);
    }
};

export const initServer = () => {
    const app = express();
    try{
        middlewares(app);
        conectarDB();
        routes(app);
        const port = process.env.PORT;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
        cron.schedule("*/5 * * * *", async () => {
            try {
                await axios.get(`http://localhost:${port}/ping`);
                console.log("Ping interno enviado para mantener el servidor activo");
            }catch(err){
                console.error("Error al enviar ping:", err.message);
            }
        });
    }catch(err){
        console.log(`Server init failed: ${err}`)
    }
}