import { Router } from "express";
import {
    registrarCalificacion,
    obtenerCalificaciones,
    obtenerCalificacionPorId,
    obtenerCalificacionesPorEstudiante,
    obtenerCuadroNotas,
    editarCalificacion,
    eliminarCalificacion,
    generarBoletaPDF
} from "./calificacion.controller.js";

import {
    registrarCalificacionValidator,
    obtenerCalificacionesValidator,
    obtenerCalificacionPorIdValidator,
    obtenerCalificacionesPorEstudianteValidator,
    obtenerCuadroNotasValidator,
    editarCalificacionValidator,
    eliminarCalificacionValidator,
    generarBoletaPDFValidator
} from "../middlewares/calificacion-validators.js";

const router = Router();

// 1. Registrar calificación
router.post("/registrar", registrarCalificacionValidator, registrarCalificacion);

// 2. Obtener todas las calificaciones
router.get("/", obtenerCalificacionesValidator, obtenerCalificaciones);

// 3. Obtener calificaciones por estudiante (BOLETA)
router.get("/estudiante/:uid/:ciclo", obtenerCalificacionesPorEstudianteValidator, obtenerCalificacionesPorEstudiante);

// 4. Generar boleta en PDF
router.get("/boleta/:uid/:ciclo", generarBoletaPDFValidator, generarBoletaPDF);

// 5. Obtener cuadro de notas (todos los alumnos de un curso/materia/bimestre)
router.get("/cuadro/:cursoId/:materiaId/:bimestre", obtenerCuadroNotasValidator, obtenerCuadroNotas);

// 6. Obtener calificación por ID
router.get("/:id", obtenerCalificacionPorIdValidator, obtenerCalificacionPorId);

// 7. Editar calificación
router.put("/:id", editarCalificacionValidator, editarCalificacion);

// 8. Eliminar calificación
router.delete("/:id", eliminarCalificacionValidator, eliminarCalificacion);

export default router;
