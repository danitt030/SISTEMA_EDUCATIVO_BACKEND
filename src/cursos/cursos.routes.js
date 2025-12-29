import { Router } from "express";
import {
    crearCurso,
    obtenerCursos,
    obtenerCursoPorId,
    obtenerCursosPorNivel,
    obtenerCursosPorGrado,
    obtenerCursosPorCiclo,
    obtenerCursosPorCoordinador,
    actualizarCurso,
    asignarCoordinador,
    eliminarCurso,
    obtenerCursosPorProfesor
} from "./cursos.controller.js";

import {
    crearCursoValidator,
    obtenerCursosValidator,
    obtenerCursoPorIdValidator,
    obtenerCursosPorNivelValidator,
    obtenerCursosPorGradoValidator,
    obtenerCursosPorCicloValidator,
    obtenerCursosPorCoordinadorValidator,
    actualizarCursoValidator,
    asignarCoordinadorValidator,
    eliminarCursoValidator
} from "../middlewares/cursos-validators.js";

const router = Router();

// Crear curso
router.post("/crearCurso", crearCursoValidator, crearCurso);

// Obtener todos los cursos
router.get("/", obtenerCursosValidator, obtenerCursos);

// Obtener cursos por nivel
router.get("/nivel/:nivel", obtenerCursosPorNivelValidator, obtenerCursosPorNivel);

// Obtener cursos por grado
router.get("/grado/:grado", obtenerCursosPorGradoValidator, obtenerCursosPorGrado);

// Obtener cursos por ciclo escolar
router.get("/ciclo/:ciclo", obtenerCursosPorCicloValidator, obtenerCursosPorCiclo);

// Obtener cursos por profesor (donde tiene materias asignadas)
router.get("/profesor/:uid", obtenerCursosPorProfesor);

// Obtener cursos por coordinador
router.get("/coordinador/:uid", obtenerCursosPorCoordinadorValidator, obtenerCursosPorCoordinador);

// Obtener curso por ID
router.get("/:id", obtenerCursoPorIdValidator, obtenerCursoPorId);

// Actualizar curso
router.put("/:id", actualizarCursoValidator, actualizarCurso);

// Asignar coordinador a un curso
router.patch("/asignar-coordinador/:id", asignarCoordinadorValidator, asignarCoordinador);

// Eliminar curso (lÃ³gico)
router.delete("/:id", eliminarCursoValidator, eliminarCurso);

export default router;
