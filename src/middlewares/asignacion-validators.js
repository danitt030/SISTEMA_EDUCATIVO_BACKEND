import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";
import { 
    cursoExists, 
    asignacionExists, 
    validarEstudiante, 
    validarEncargado 
} from "../helpers/db-validators.js";

// Inscribir estudiante
export const inscribirEstudianteValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    body("estudiante").notEmpty().withMessage("El estudiante es requerido")
        .isMongoId().withMessage("ID de estudiante no válido")
        .custom(validarEstudiante),
    body("curso").notEmpty().withMessage("El curso es requerido")
        .isMongoId().withMessage("ID de curso no válido")
        .custom(cursoExists),
    body("encargado").notEmpty().withMessage("El encargado es requerido")
        .isMongoId().withMessage("ID de encargado no válido")
        .custom(validarEncargado),
    body("cicloEscolar").notEmpty().withMessage("El ciclo escolar es requerido"),
    body("becado").optional().isBoolean().withMessage("Becado debe ser true o false"),
    body("observaciones").optional().isString().withMessage("Las observaciones deben ser texto"),
    validateField,
    handleErrors
];

// Obtener todas las asignaciones
export const obtenerAsignacionesValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    validateField,
    handleErrors
];

// Obtener asignación por ID
export const obtenerAsignacionPorIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("id").isMongoId().withMessage("ID de asignación no válido").custom(asignacionExists),
    validateField,
    handleErrors
];

// Obtener estudiantes por curso
export const obtenerEstudiantesPorCursoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("cursoId").isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    validateField,
    handleErrors
];

// Obtener cursos de un estudiante
export const obtenerCursosDeEstudianteValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PADRE_ROLE", "ALUMNO_ROLE"),
    param("uid").isMongoId().withMessage("ID de estudiante no válido"),
    validateField,
    handleErrors
];

// Obtener estudiantes por encargado
export const obtenerEstudiantesPorEncargadoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PADRE_ROLE"),
    param("uid").isMongoId().withMessage("ID de encargado no válido"),
    validateField,
    handleErrors
];

// Actualizar asignación
export const actualizarAsignacionValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("id").isMongoId().withMessage("ID de asignación no válido").custom(asignacionExists),
    body("curso").optional().isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    body("encargado").optional().isMongoId().withMessage("ID de encargado no válido").custom(validarEncargado),
    body("cicloEscolar").optional().notEmpty().withMessage("El ciclo escolar no puede estar vacío"),
    body("becado").optional().isBoolean().withMessage("Becado debe ser true o false"),
    body("observaciones").optional().isString().withMessage("Las observaciones deben ser texto"),
    validateField,
    handleErrors
];

// Cambiar curso
export const cambiarCursoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("id").isMongoId().withMessage("ID de asignación no válido").custom(asignacionExists),
    body("curso").notEmpty().withMessage("El curso es requerido")
        .isMongoId().withMessage("ID de curso no válido")
        .custom(cursoExists),
    validateField,
    handleErrors
];

// Eliminar asignación
export const eliminarAsignacionValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID de asignación no válido").custom(asignacionExists),
    validateField,
    handleErrors
];
