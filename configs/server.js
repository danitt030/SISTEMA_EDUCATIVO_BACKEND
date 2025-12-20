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

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(apiLimiter);
    // Para subir archivos estaticos
    app.use("/uploads", express.static(join(CURRENT_DIR, "../public/uploads")));
};

const routes = (app) => {
    app.get("/ping", (req, res) => {
        res.status(200).json({ message: "pong" });
    });
    
    // Rutas del proyecto
    app.use("/sistemaEducativo/v1/auth", authRoutes);
    app.use("/sistemaEducativo/v1/users", userRoutes);
    app.use("/sistemaEducativo/v1/cursos", cursoRoutes);
    app.use("/sistemaEducativo/v1/materias", materiaRoutes);
    app.use("/sistemaEducativo/v1/asignaciones", asignacionRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection()
        
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