import { body, param } from "express-validator";
import { emailExists, usernameExists, userExists } from "../helpers/db-validators.js";
import { validarCampos } from "./validate-fields.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const registerValidator = [
    body("name").notEmpty().withMessage("El nombre es requerido"),
    body("surname").notEmpty().withMessage("El apellido es requerido"),
    body("username").notEmpty().withMessage("El username es requerido"),
    body("email").notEmpty().withMessage("El email es requerido"),
    body("email").isEmail().withMessage("No es un email válido"),
    body("email").custom(emailExists),
    body("username").custom(usernameExists),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("phone").notEmpty().withMessage("El teléfono es requerido"),
    body("role").optional().isIn(["ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE", "PADRE_ROLE", "ALUMNO_ROLE"]).withMessage("Rol no válido"),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("No es un email válido"),
    body("username").optional().notEmpty().withMessage("El username no puede estar vacío"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
    validarCampos
];

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido"),
    param("uid").custom(userExists),
    validarCampos
];

export const deleteUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido"),
    param("uid").custom(userExists),
    validarCampos
];

export const updateUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    param("uid").isMongoId().withMessage("No es un ID válido"),
    param("uid").custom(userExists),
    validarCampos
];

export const getUsersValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "COORDINADOR_ROLE"),
    validarCampos
];