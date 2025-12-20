import { Router } from "express";
import {
    crearMateria,
    obtenerMaterias,
    obtenerMateriaPorId,
    obtenerMateriasPorCurso,
    obtenerMateriasPorProfesor,
    actualizarMateria,
    asignarProfesor,
    eliminarMateria
} from "./materia.controller.js";

import {
    crearMateriaValidator,
    obtenerMateriasValidator,
    obtenerMateriaPorIdValidator,
    obtenerMateriasPorCursoValidator,
    obtenerMateriasPorProfesorValidator,
    actualizarMateriaValidator,
    asignarProfesorValidator,
    eliminarMateriaValidator
} from "../middlewares/materia-validators.js";

const router = Router();

// Crear materia
router.post("/crearMateria", crearMateriaValidator, crearMateria);

// Obtener todas las materias
router.get("/", obtenerMateriasValidator, obtenerMaterias);

// Obtener materias por curso
router.get("/curso/:cursoId", obtenerMateriasPorCursoValidator, obtenerMateriasPorCurso);

// Obtener materias por profesor
router.get("/profesor/:uid", obtenerMateriasPorProfesorValidator, obtenerMateriasPorProfesor);

// Obtener materia por ID
router.get("/:id", obtenerMateriaPorIdValidator, obtenerMateriaPorId);

// Actualizar materia
router.put("/:id", actualizarMateriaValidator, actualizarMateria);

// Asignar profesor a materia
router.patch("/asignar-profesor/:id", asignarProfesorValidator, asignarProfesor);

// Eliminar materia (lógico)
router.delete("/:id", eliminarMateriaValidator, eliminarMateria);

export default router;
