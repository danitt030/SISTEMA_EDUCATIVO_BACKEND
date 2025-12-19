import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { handleErrors } from "./handle-errors.js";
import { cursoExists, validarCoordinador } from "../helpers/db-validators.js";

// Enums para validaciones
const NIVELES = ["PREPRIMARIA", "PRIMARIA", "BASICO"];
const GRADOS = [
    "PARVULOS_1", "PARVULOS_2", "PARVULOS_3", "PREPARATORIA",
    "PRIMERO_PRIMARIA", "SEGUNDO_PRIMARIA", "TERCERO_PRIMARIA",
    "CUARTO_PRIMARIA", "QUINTO_PRIMARIA", "SEXTO_PRIMARIA",
    "PRIMERO_BASICO", "SEGUNDO_BASICO", "TERCERO_BASICO"
];
const SECCIONES = ["A", "B", "C"];
const JORNADAS = ["MATUTINA", "VESPERTINA"];

// Crear curso
export const crearCursoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("nivel").notEmpty().withMessage("El nivel es requerido")
        .isIn(NIVELES).withMessage("Nivel no válido"),
    body("grado").notEmpty().withMessage("El grado es requerido")
        .isIn(GRADOS).withMessage("Grado no válido"),
    body("seccion").notEmpty().withMessage("La sección es requerida")
        .isIn(SECCIONES).withMessage("Sección no válida"),
    body("jornada").notEmpty().withMessage("La jornada es requerida")
        .isIn(JORNADAS).withMessage("Jornada no válida"),
    body("cicloEscolar").notEmpty().withMessage("El ciclo escolar es requerido"),
    body("capacidadMaxima").optional().isInt({ min: 1 }).withMessage("La capacidad debe ser un número mayor a 0"),
    body("coordinador").optional().isMongoId().withMessage("ID de coordinador no válido"),
    validateField,
    handleErrors
];

// Obtener todos los cursos
export const obtenerCursosValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    validateField,
    handleErrors
];

// Obtener curso por ID
export const obtenerCursoPorIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("id").isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    validateField,
    handleErrors
];

// Obtener cursos por nivel
export const obtenerCursosPorNivelValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("nivel").isIn(NIVELES).withMessage("Nivel no válido"),
    validateField,
    handleErrors
];

// Obtener cursos por grado
export const obtenerCursosPorGradoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("grado").isIn(GRADOS).withMessage("Grado no válido"),
    validateField,
    handleErrors
];

// Obtener cursos por ciclo
export const obtenerCursosPorCicloValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE"),
    param("ciclo").notEmpty().withMessage("El ciclo escolar es requerido"),
    validateField,
    handleErrors
];

// Obtener cursos por coordinador
export const obtenerCursosPorCoordinadorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("uid").isMongoId().withMessage("ID de coordinador no válido"),
    validateField,
    handleErrors
];

// Actualizar curso
export const actualizarCursoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("id").isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    body("nivel").optional().isIn(NIVELES).withMessage("Nivel no válido"),
    body("grado").optional().isIn(GRADOS).withMessage("Grado no válido"),
    body("seccion").optional().isIn(SECCIONES).withMessage("Sección no válida"),
    body("jornada").optional().isIn(JORNADAS).withMessage("Jornada no válida"),
    body("cicloEscolar").optional().notEmpty().withMessage("El ciclo escolar no puede estar vacío"),
    body("capacidadMaxima").optional().isInt({ min: 1 }).withMessage("La capacidad debe ser un número mayor a 0"),
    validateField,
    handleErrors
];

// Asignar coordinador
export const asignarCoordinadorValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    body("coordinador").notEmpty().withMessage("El coordinador es requerido")
        .isMongoId().withMessage("ID de coordinador no válido")
        .custom(validarCoordinador),
    validateField,
    handleErrors
];

// Eliminar curso
export const eliminarCursoValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("ID de curso no válido").custom(cursoExists),
    validateField,
    handleErrors
];
