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

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Retorna una lista con todos los usuarios del sistema
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439011
 *                       name:
 *                         type: string
 *                         example: Juan
 *                       surname:
 *                         type: string
 *                         example: Pérez
 *                       username:
 *                         type: string
 *                         example: jperez
 *                       email:
 *                         type: string
 *                         example: juan.perez@example.com
 *                       role:
 *                         type: string
 *                         example: ALUMNO_ROLE
 *                       phone:
 *                         type: string
 *                         example: "+34600123456"
 *                       profilePicture:
 *                         type: string
 *                         example: /uploads/profile-pictures/1234567890.jpg
 *                       estado:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: No autorizado - Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Token no válido
 *       403:
 *         description: Prohibido - El usuario no tiene permisos suficientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: No tienes permisos para realizar esta acción
 *       500:
 *         description: Error interno del servidor
 *     x-middleware:
 *       - validateJWT (Validación de token JWT)
 *       - hasRoles (Verificación de roles)
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.get("/", getUsersValidator, obtenerUsuarios);

/**
 * @swagger
 * /users/role/{role}:
 *   get:
 *     summary: Obtener usuarios por rol
 *     description: Retorna una lista de usuarios que tienen un rol específico
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE, PADRE_ROLE, ALUMNO_ROLE]
 *         description: Rol de los usuarios a buscar
 *         example: PROFESOR_ROLE
 *     responses:
 *       200:
 *         description: Usuarios encontrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       surname:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       profilePicture:
 *                         type: string
 *       400:
 *         description: Error de validación - Rol inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Rol no válido
 *       401:
 *         description: No autorizado - Token inválido
 *       403:
 *         description: Prohibido - Sin permisos suficientes
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "role": debe ser uno de los roles válidos del sistema
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/role/:role", getUsersByRoleValidator, obtenerUsuariosPorRole);

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Retorna los datos de un usuario específico mediante su ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     name:
 *                       type: string
 *                       example: Juan
 *                     surname:
 *                       type: string
 *                       example: Pérez
 *                     username:
 *                       type: string
 *                       example: jperez
 *                     email:
 *                       type: string
 *                       example: juan.perez@example.com
 *                     role:
 *                       type: string
 *                       example: ALUMNO_ROLE
 *                     phone:
 *                       type: string
 *                       example: "+34600123456"
 *                     profilePicture:
 *                       type: string
 *                       example: /uploads/profile-pictures/1234567890.jpg
 *                     estado:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Error de validación - ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: No es un ID válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - El usuario debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.get("/:uid", getUserByIdValidator, obtenerUsuarioPorId);

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario a actualizar
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan Carlos
 *               surname:
 *                 type: string
 *                 description: Apellido del usuario
 *                 example: Pérez García
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *                 example: "+34600987654"
 *               profilePicture:
 *                 type: string
 *                 description: URL de la imagen de perfil
 *                 example: /uploads/profile-pictures/nuevo.jpg
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario actualizado exitosamente
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     surname:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     profilePicture:
 *                       type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - El usuario debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.put("/:uid", updateUserValidator, actualizarUsuario);

/**
 * @swagger
 * /users/password/{uid}:
 *   patch:
 *     summary: Actualizar contraseña
 *     description: Actualiza la contraseña de un usuario. El usuario puede cambiar su propia contraseña o un admin puede cambiar la de cualquier usuario.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Nueva contraseña (mínimo 6 caracteres)
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Contraseña actualizada exitosamente
 *       400:
 *         description: Error de validación - Contraseña debe tener al menos 6 caracteres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: La contraseña debe tener al menos 6 caracteres
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - Campo "newPassword": requerido, mínimo 6 caracteres
 *       - El usuario debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *     x-roles-permitidos: Cualquier usuario autenticado (puede cambiar su propia contraseña)
 */
router.patch("/password/:uid", updatePasswordValidator, actualizarPassword);

/**
 * @swagger
 * /users/role/{uid}:
 *   patch:
 *     summary: Actualizar rol de usuario
 *     description: Cambia el rol de un usuario existente. Solo administradores pueden realizar esta acción.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newRole
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE, PADRE_ROLE, ALUMNO_ROLE]
 *                 description: Nuevo rol a asignar al usuario
 *                 example: PROFESOR_ROLE
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Rol actualizado exitosamente
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: PROFESOR_ROLE
 *       400:
 *         description: Error de validación - Rol inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: Rol no válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden cambiar roles
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - Campo "newRole": requerido, debe ser uno de los roles válidos
 *       - El usuario debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 */
router.patch("/role/:uid", updateRoleValidator, actualizarRole);

/**
 * @swagger
 * /users/{uid}:
 *   delete:
 *     summary: Eliminar usuario (borrado lógico)
 *     description: Realiza un borrado lógico del usuario, cambiando su estado a inactivo. Solo administradores pueden realizar esta acción.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario a eliminar
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente (borrado lógico)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario eliminado exitosamente
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     estado:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden eliminar usuarios
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - El usuario debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 *     x-nota: Este endpoint realiza un borrado lógico, no elimina físicamente el registro
 */
router.delete("/:uid", deleteUserValidator, eliminarUsuario);

/**
 * @swagger
 * /users/account/{uid}:
 *   delete:
 *     summary: Eliminar cuenta propia (borrado físico)
 *     description: Elimina permanentemente la cuenta del usuario. El usuario debe proporcionar su contraseña para confirmar la eliminación. Este es un borrado físico irreversible.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del usuario (debe coincidir con el usuario autenticado)
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña actual del usuario para confirmar la eliminación
 *                 example: myCurrentPassword
 *     responses:
 *       200:
 *         description: Cuenta eliminada permanentemente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Cuenta eliminada permanentemente
 *       400:
 *         description: Error de validación - Contraseña requerida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                         example: La contraseña es requerida
 *       401:
 *         description: No autorizado - Contraseña incorrecta o token inválido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - Campo "password": requerido, debe coincidir con la contraseña actual del usuario
 *       - El usuario debe existir en la base de datos
 *       - El uid debe pertenecer al usuario autenticado
 *     x-middleware:
 *       - validateJWT
 *     x-roles-permitidos: Cualquier usuario autenticado (solo puede eliminar su propia cuenta)
 *     x-advertencia: Esta acción es irreversible. Elimina permanentemente todos los datos del usuario.
 */
router.delete("/account/:uid", eliminarCuentaValidator, eliminarCuenta);

export default router;
