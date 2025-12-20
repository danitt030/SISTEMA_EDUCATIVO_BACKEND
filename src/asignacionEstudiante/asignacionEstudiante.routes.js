import { Router } from "express";
import {
    inscribirEstudiante,
    obtenerAsignaciones,
    obtenerAsignacionPorId,
    obtenerEstudiantesPorCurso,
    obtenerCursosDeEstudiante,
    obtenerEstudiantesPorEncargado,
    actualizarAsignacion,
    cambiarCurso,
    eliminarAsignacion
} from "./asignacionEstudiante.controller.js";

import {
    inscribirEstudianteValidator,
    obtenerAsignacionesValidator,
    obtenerAsignacionPorIdValidator,
    obtenerEstudiantesPorCursoValidator,
    obtenerCursosDeEstudianteValidator,
    obtenerEstudiantesPorEncargadoValidator,
    actualizarAsignacionValidator,
    cambiarCursoValidator,
    eliminarAsignacionValidator
} from "../middlewares/asignacion-validators.js";

const router = Router();

// Inscribir estudiante
router.post("/inscribir", inscribirEstudianteValidator, inscribirEstudiante);

// Obtener todas las asignaciones
router.get("/", obtenerAsignacionesValidator, obtenerAsignaciones);

// Obtener estudiantes por curso
router.get("/curso/:cursoId", obtenerEstudiantesPorCursoValidator, obtenerEstudiantesPorCurso);

// Obtener cursos de un estudiante
router.get("/estudiante/:uid", obtenerCursosDeEstudianteValidator, obtenerCursosDeEstudiante);

// Obtener estudiantes por encargado (hijos)
router.get("/encargado/:uid", obtenerEstudiantesPorEncargadoValidator, obtenerEstudiantesPorEncargado);

// Obtener asignación por ID
router.get("/:id", obtenerAsignacionPorIdValidator, obtenerAsignacionPorId);

// Actualizar asignación
router.put("/:id", actualizarAsignacionValidator, actualizarAsignacion);

// Cambiar curso (trasladar)
router.patch("/cambiar-curso/:id", cambiarCursoValidator, cambiarCurso);

// Eliminar asignación (dar de baja)
router.delete("/:id", eliminarAsignacionValidator, eliminarAsignacion);

export default router;
