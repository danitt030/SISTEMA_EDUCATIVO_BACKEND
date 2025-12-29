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

/**
 * @swagger
 * /api/materias/crearMateria:
 *   post:
 *     summary: Crear nueva materia
 *     description: Crea una nueva materia en el sistema y la asigna a un curso específico
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - curso
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la materia
 *                 example: Matemáticas Avanzadas
 *               curso:
 *                 type: string
 *                 description: ID del curso al que pertenece la materia
 *                 example: 507f1f77bcf86cd799439011
 *               descripcion:
 *                 type: string
 *                 description: Descripción opcional de la materia
 *                 example: Curso avanzado de álgebra y cálculo diferencial
 *               profesor:
 *                 type: string
 *                 description: ID del profesor asignado (opcional)
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Materia creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Materia creada exitosamente
 *                 materia:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439013
 *                     nombre:
 *                       type: string
 *                       example: Matemáticas Avanzadas
 *                     curso:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     descripcion:
 *                       type: string
 *                     profesor:
 *                       type: string
 *                     estado:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Error de validación
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
 *                         example: El nombre de la materia es requerido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Sin permisos suficientes
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Campo "nombre": requerido
 *       - Campo "curso": requerido, debe ser un ID de MongoDB válido y existir en la BD
 *       - Campo "descripcion": opcional, debe ser texto
 *       - Campo "profesor": opcional, debe ser un ID de MongoDB válido y tener rol PROFESOR_ROLE
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.post("/crearMateria", crearMateriaValidator, crearMateria);

/**
 * @swagger
 * /api/materias:
 *   get:
 *     summary: Obtener todas las materias
 *     description: Retorna una lista con todas las materias del sistema
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de materias obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 materias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 507f1f77bcf86cd799439013
 *                       nombre:
 *                         type: string
 *                         example: Matemáticas
 *                       curso:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                           grado:
 *                             type: string
 *                       descripcion:
 *                         type: string
 *                       profesor:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           surname:
 *                             type: string
 *                       estado:
 *                         type: boolean
 *                         example: true
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/", obtenerMateriasValidator, obtenerMaterias);

/**
 * @swagger
 * /api/materias/curso/{cursoId}:
 *   get:
 *     summary: Obtener materias por curso
 *     description: Retorna todas las materias asociadas a un curso específico
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del curso
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Materias del curso obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 materias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       profesor:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           surname:
 *                             type: string
 *                       curso:
 *                         type: object
 *                       estado:
 *                         type: boolean
 *       400:
 *         description: Error de validación - ID de curso inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "cursoId": debe ser un ID de MongoDB válido y existir en la BD
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/curso/:cursoId", obtenerMateriasPorCursoValidator, obtenerMateriasPorCurso);

/**
 * @swagger
 * /api/materias/profesor/{uid}:
 *   get:
 *     summary: Obtener materias por profesor
 *     description: Retorna todas las materias asignadas a un profesor específico
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del profesor
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Materias del profesor obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 materias:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       curso:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                           grado:
 *                             type: string
 *                       profesor:
 *                         type: object
 *                       estado:
 *                         type: boolean
 *       400:
 *         description: Error de validación - ID de profesor inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/profesor/:uid", obtenerMateriasPorProfesorValidator, obtenerMateriasPorProfesor);

/**
 * @swagger
 * /api/materias/{id}:
 *   get:
 *     summary: Obtener materia por ID
 *     description: Retorna los datos de una materia específica
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB de la materia
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Materia encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 materia:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439013
 *                     nombre:
 *                       type: string
 *                       example: Matemáticas
 *                     descripcion:
 *                       type: string
 *                     curso:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         nombre:
 *                           type: string
 *                         grado:
 *                           type: string
 *                     profesor:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         surname:
 *                           type: string
 *                     estado:
 *                       type: boolean
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Materia no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/:id", obtenerMateriaPorIdValidator, obtenerMateriaPorId);

/**
 * @swagger
 * /api/materias/{id}:
 *   put:
 *     summary: Actualizar materia
 *     description: Actualiza los datos de una materia existente
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB de la materia a actualizar
 *         example: 507f1f77bcf86cd799439013
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nuevo nombre de la materia
 *                 example: Matemáticas Aplicadas
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción
 *                 example: Curso actualizado de matemáticas
 *               curso:
 *                 type: string
 *                 description: Nuevo curso asignado (ID)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Materia actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Materia actualizada exitosamente
 *                 materia:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     curso:
 *                       type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Materia o curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *       - Campo "nombre": opcional, no puede estar vacío si se proporciona
 *       - Campo "descripcion": opcional, debe ser texto
 *       - Campo "curso": opcional, debe ser un ID de MongoDB válido y existir en la BD
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.put("/:id", actualizarMateriaValidator, actualizarMateria);

/**
 * @swagger
 * /api/materias/asignar-profesor/{id}:
 *   patch:
 *     summary: Asignar profesor a materia
 *     description: Asigna o reasigna un profesor a una materia específica
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB de la materia
 *         example: 507f1f77bcf86cd799439013
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profesor
 *             properties:
 *               profesor:
 *                 type: string
 *                 description: ID del profesor a asignar (debe tener rol PROFESOR_ROLE)
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Profesor asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Profesor asignado exitosamente
 *                 materia:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     profesor:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         surname:
 *                           type: string
 *                         role:
 *                           type: string
 *                           example: PROFESOR_ROLE
 *       400:
 *         description: Error de validación - ID inválido o usuario no es profesor
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
 *                         example: El profesor es requerido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Materia o profesor no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *       - Campo "profesor": requerido, debe ser un ID de MongoDB válido
 *       - El usuario asignado debe tener rol PROFESOR_ROLE
 *       - El profesor debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.patch("/asignar-profesor/:id", asignarProfesorValidator, asignarProfesor);

/**
 * @swagger
 * /api/materias/{id}:
 *   delete:
 *     summary: Eliminar materia (borrado lógico)
 *     description: Realiza un borrado lógico de la materia, cambiando su estado a inactivo
 *     tags: [Materias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB de la materia a eliminar
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Materia eliminada exitosamente (borrado lógico)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Materia eliminada exitosamente
 *                 materia:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     estado:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden eliminar materias
 *       404:
 *         description: Materia no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 *     x-nota: Este endpoint realiza un borrado lógico, no elimina físicamente el registro
 */
router.delete("/:id", eliminarMateriaValidator, eliminarMateria);

export default router;
