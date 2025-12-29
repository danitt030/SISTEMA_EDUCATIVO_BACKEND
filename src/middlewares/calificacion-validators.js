import { body, param, query } from "express-validator";
import { validateField } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";
import {
    cursoExists,
    materiaExists,
    calificacionExists,
    validarEstudiante
} from "../helpers/db-validators.js";

// 1. Registrar calificacion
export const registrarCalificacionValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "PROFESOR_ROLE"),
    body("estudiante").notEmpty().withMessage("El estudiante es requerido")
        .isMongoId().withMessage("ID de estudiante no valido")
        .custom(validarEstudiante),
    body("materia").notEmpty().withMessage("La materia es requerida")
        .isMongoId().withMessage("ID de materia no valido")
        .custom(materiaExists),
    body("curso").notEmpty().withMessage("El curso es requerido")
        .isMongoId().withMessage("ID de curso no valido")
        .custom(cursoExists),
    body("bimestre").notEmpty().withMessage("El bimestre es requerido")
        .isInt({ min: 1, max: 4 }).withMessage("El bimestre debe ser 1, 2, 3 o 4"),
    body("cicloEscolar").notEmpty().withMessage("El ciclo escolar es requerido")
        .isInt({ min: 2020, max: 2100 }).withMessage("Ciclo escolar no valido"),
    body("zona").notEmpty().withMessage("La zona es requerida")
        .isFloat({ min: 0, max: 60 }).withMessage("La zona debe estar entre 0 y 60"),
    body("examen").notEmpty().withMessage("El examen es requerido")
        .isFloat({ min: 0, max: 40 }).withMessage("El examen debe estar entre 0 y 40"),
    body("observaciones").optional().isString().withMessage("Las observaciones deben ser texto"),
    validateField,
    handleErrors
];

// 2. Obtener todas las calificaciones
export const obtenerCalificacionesValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    validateField,
    handleErrors
];

// 3. Obtener calificacion por ID
export const obtenerCalificacionPorIdValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("ID de calificacion no valido")
        .custom(calificacionExists),
    validateField,
    handleErrors
];

// 4. Obtener calificaciones por estudiante (Boleta)
export const obtenerCalificacionesPorEstudianteValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE", "PADRE_ROLE", "ALUMNO_ROLE"),
    param("uid").isMongoId().withMessage("ID de estudiante no valido"),
    param("ciclo").isInt({ min: 2020, max: 2100 }).withMessage("Ciclo escolar no valido"),
    validateField,
    handleErrors
];

// 5. Obtener cuadro de notas
export const obtenerCuadroNotasValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("cursoId").isMongoId().withMessage("ID de curso no valido")
        .custom(cursoExists),
    param("materiaId").isMongoId().withMessage("ID de materia no valido")
        .custom(materiaExists),
    param("bimestre").isInt({ min: 1, max: 4 }).withMessage("El bimestre debe ser 1, 2, 3 o 4"),
    query("cicloEscolar").notEmpty().withMessage("El ciclo escolar es requerido")
        .isInt({ min: 2020, max: 2100 }).withMessage("Ciclo escolar no valido"),
    validateField,
    handleErrors
];

// 6. Editar calificacion
export const editarCalificacionValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "PROFESOR_ROLE"),
    param("id").isMongoId().withMessage("ID de calificacion no valido")
        .custom(calificacionExists),
    body("zona").optional()
        .isFloat({ min: 0, max: 60 }).withMessage("La zona debe estar entre 0 y 60"),
    body("examen").optional()
        .isFloat({ min: 0, max: 40 }).withMessage("El examen debe estar entre 0 y 40"),
    body("observaciones").optional().isString().withMessage("Las observaciones deben ser texto"),
    validateField,
    handleErrors
];

// 7. Eliminar calificacion
export const eliminarCalificacionValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID de calificacion no valido")
        .custom(calificacionExists),
    validateField,
    handleErrors
];

// 8. Generar boleta PDF
export const generarBoletaPDFValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE", "PADRE_ROLE", "ALUMNO_ROLE"),
    param("uid").isMongoId().withMessage("ID de estudiante no valido"),
    param("ciclo").isInt({ min: 2020, max: 2100 }).withMessage("Ciclo escolar no valido"),
    validateField,
    handleErrors
];
