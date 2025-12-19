import { Router } from "express";
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuariosPorRole,
    actualizarUsuario,
    actualizarPassword,
    actualizarRole,
    eliminarUsuario,
    eliminarCuenta
} from "./user.controller.js";

import {
    getUsersValidator,
    getUserByIdValidator,
    getUsersByRoleValidator,
    updateUserValidator,
    updatePasswordValidator,
    updateRoleValidator,
    deleteUserValidator,
    eliminarCuentaValidator
} from "../middlewares/user-validators.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", getUsersValidator, obtenerUsuarios);

// Obtener usuarios por rol
router.get("/role/:role", getUsersByRoleValidator, obtenerUsuariosPorRole);

// Obtener usuario por ID
router.get("/:uid", getUserByIdValidator, obtenerUsuarioPorId);

// Actualizar usuario
router.put("/:uid", updateUserValidator, actualizarUsuario);

// Actualizar contraseña
router.patch("/password/:uid", updatePasswordValidator, actualizarPassword);

// Actualizar rol
router.patch("/role/:uid", updateRoleValidator, actualizarRole);

// Eliminar usuario (lógico)
router.delete("/:uid", deleteUserValidator, eliminarUsuario);

// Eliminar cuenta propia (físico)
router.delete("/account/:uid", eliminarCuentaValidator, eliminarCuenta);

export default router;
