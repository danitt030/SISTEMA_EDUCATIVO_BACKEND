import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";
import { cursoExists, materiaExists, validarProfesor } from "../helpers/db-validators.js";

// Crear materia
export const crearMateriaValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    body("nombre").notEmpty().withMessage("El nombre de la materia es requerido"),
    body("curso").notEmpty().withMessage("El curso es requerido")
        .isMongoId().withMessage("ID de curso no válido")
        .custom(cursoExists),
    body("descripcion").optional().isString().withMessage("La descripción debe ser texto"),
    body("profesor").optional().isMongoId().withMessage("ID de profesor no válido")
        .custom(validarProfesor),
    validateField,
    handleErrors
];

// Obtener todas las materias
export const obtenerMateriasValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    validateField,
    handleErrors
];

// Obtener materia por ID
export const obtenerMateriaPorIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("id").isMongoId().withMessage("ID de materia no válido").custom(materiaExists),
    validateField,
    handleErrors
];

// Obtener materias por curso
export const obtenerMateriasPorCursoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("cursoId").isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    validateField,
    handleErrors
];

// Obtener materias por profesor
export const obtenerMateriasPorProfesorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("uid").isMongoId().withMessage("ID de profesor no válido"),
    validateField,
    handleErrors
];

// Actualizar materia
export const actualizarMateriaValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("id").isMongoId().withMessage("ID de materia no válido").custom(materiaExists),
    body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío"),
    body("descripcion").optional().isString().withMessage("La descripción debe ser texto"),
    body("curso").optional().isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    validateField,
    handleErrors
];

// Asignar profesor
export const asignarProfesorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("id").isMongoId().withMessage("ID de materia no válido").custom(materiaExists),
    body("profesor").notEmpty().withMessage("El profesor es requerido")
        .isMongoId().withMessage("ID de profesor no válido")
        .custom(validarProfesor),
    validateField,
    handleErrors
];

// Eliminar materia
export const eliminarMateriaValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID de materia no válido").custom(materiaExists),
    validateField,
    handleErrors
];
