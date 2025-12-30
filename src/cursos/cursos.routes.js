import { Router } from "express";
import {
    crearCurso,
    obtenerCursos,
    obtenerCursoPorId,
    obtenerCursosPorNivel,
    obtenerCursosPorGrado,
    obtenerCursosPorCiclo,
    obtenerCursosPorCoordinador,
    actualizarCurso,
    asignarCoordinador,
    eliminarCurso,
    obtenerCursosPorProfesor
} from "./cursos.controller.js";

import {
    crearCursoValidator,
    obtenerCursosValidator,
    obtenerCursoPorIdValidator,
    obtenerCursosPorNivelValidator,
    obtenerCursosPorGradoValidator,
    obtenerCursosPorCicloValidator,
    obtenerCursosPorCoordinadorValidator,
    actualizarCursoValidator,
    asignarCoordinadorValidator,
    eliminarCursoValidator
} from "../middlewares/cursos-validators.js";

const router = Router();

/**
 * @swagger
 * /cursos/crearCurso:
 *   post:
 *     summary: Crear nuevo curso
 *     description: Crea un nuevo curso en el sistema con todos sus datos académicos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nivel
 *               - grado
 *               - seccion
 *               - jornada
 *               - cicloEscolar
 *             properties:
 *               nivel:
 *                 type: string
 *                 enum: [PREPRIMARIA, PRIMARIA, BASICO]
 *                 description: Nivel educativo del curso
 *                 example: PRIMARIA
 *               grado:
 *                 type: string
 *                 enum: [PARVULOS_1, PARVULOS_2, PARVULOS_3, PREPARATORIA, PRIMERO_PRIMARIA, SEGUNDO_PRIMARIA, TERCERO_PRIMARIA, CUARTO_PRIMARIA, QUINTO_PRIMARIA, SEXTO_PRIMARIA, PRIMERO_BASICO, SEGUNDO_BASICO, TERCERO_BASICO]
 *                 description: Grado académico del curso
 *                 example: QUINTO_PRIMARIA
 *               seccion:
 *                 type: string
 *                 enum: [A, B, C]
 *                 description: Sección del curso
 *                 example: A
 *               jornada:
 *                 type: string
 *                 enum: [MATUTINA, VESPERTINA]
 *                 description: Jornada escolar
 *                 example: MATUTINA
 *               cicloEscolar:
 *                 type: string
 *                 description: Ciclo escolar del curso
 *                 example: 2024-2025
 *               capacidadMaxima:
 *                 type: integer
 *                 minimum: 1
 *                 description: Capacidad máxima de estudiantes (opcional)
 *                 example: 30
 *               coordinador:
 *                 type: string
 *                 description: ID del coordinador asignado (opcional)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Curso creado exitosamente
 *                 curso:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439015
 *                     nivel:
 *                       type: string
 *                       example: PRIMARIA
 *                     grado:
 *                       type: string
 *                       example: QUINTO_PRIMARIA
 *                     seccion:
 *                       type: string
 *                       example: A
 *                     jornada:
 *                       type: string
 *                       example: MATUTINA
 *                     cicloEscolar:
 *                       type: string
 *                       example: 2024-2025
 *                     capacidadMaxima:
 *                       type: integer
 *                       example: 30
 *                     nombre:
 *                       type: string
 *                       example: Quinto Primaria - Sección A
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
 *                         example: El nivel es requerido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden crear cursos
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Campo "nivel": requerido, valores permitidos [PREPRIMARIA, PRIMARIA, BASICO]
 *       - Campo "grado": requerido, debe coincidir con uno de los grados válidos
 *       - Campo "seccion": requerido, valores permitidos [A, B, C]
 *       - Campo "jornada": requerido, valores permitidos [MATUTINA, VESPERTINA]
 *       - Campo "cicloEscolar": requerido
 *       - Campo "capacidadMaxima": opcional, debe ser entero mayor a 0
 *       - Campo "coordinador": opcional, debe ser ID válido de MongoDB
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 */
router.post("/crearCurso", crearCursoValidator, crearCurso);

/**
 * @swagger
 * /cursos:
 *   get:
 *     summary: Obtener todos los cursos
 *     description: Retorna una lista con todos los cursos del sistema
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cursos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nivel:
 *                         type: string
 *                       grado:
 *                         type: string
 *                       seccion:
 *                         type: string
 *                       jornada:
 *                         type: string
 *                       cicloEscolar:
 *                         type: string
 *                       capacidadMaxima:
 *                         type: integer
 *                       nombre:
 *                         type: string
 *                       coordinador:
 *                         type: object
 *                       estado:
 *                         type: boolean
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
router.get("/", obtenerCursosValidator, obtenerCursos);

/**
 * @swagger
 * /cursos/nivel/{nivel}:
 *   get:
 *     summary: Obtener cursos por nivel educativo
 *     description: Retorna todos los cursos de un nivel educativo específico
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nivel
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PREPRIMARIA, PRIMARIA, BASICO]
 *         description: Nivel educativo a filtrar
 *         example: PRIMARIA
 *     responses:
 *       200:
 *         description: Cursos del nivel obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nivel:
 *                         type: string
 *                       grado:
 *                         type: string
 *                       seccion:
 *                         type: string
 *                       jornada:
 *                         type: string
 *                       cicloEscolar:
 *                         type: string
 *                       nombre:
 *                         type: string
 *       400:
 *         description: Error de validación - Nivel inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "nivel": debe ser uno de [PREPRIMARIA, PRIMARIA, BASICO]
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/nivel/:nivel", obtenerCursosPorNivelValidator, obtenerCursosPorNivel);

/**
 * @swagger
 * /cursos/grado/{grado}:
 *   get:
 *     summary: Obtener cursos por grado
 *     description: Retorna todos los cursos de un grado específico
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: grado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [PARVULOS_1, PARVULOS_2, PARVULOS_3, PREPARATORIA, PRIMERO_PRIMARIA, SEGUNDO_PRIMARIA, TERCERO_PRIMARIA, CUARTO_PRIMARIA, QUINTO_PRIMARIA, SEXTO_PRIMARIA, PRIMERO_BASICO, SEGUNDO_BASICO, TERCERO_BASICO]
 *         description: Grado académico a filtrar
 *         example: QUINTO_PRIMARIA
 *     responses:
 *       200:
 *         description: Cursos del grado obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Error de validación - Grado inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "grado": debe ser uno de los grados válidos del sistema
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/grado/:grado", obtenerCursosPorGradoValidator, obtenerCursosPorGrado);

/**
 * @swagger
 * /cursos/ciclo/{ciclo}:
 *   get:
 *     summary: Obtener cursos por ciclo escolar
 *     description: Retorna todos los cursos de un ciclo escolar específico
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ciclo
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciclo escolar a filtrar
 *         example: 2024-2025
 *     responses:
 *       200:
 *         description: Cursos del ciclo escolar obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nivel:
 *                         type: string
 *                       grado:
 *                         type: string
 *                       seccion:
 *                         type: string
 *                       cicloEscolar:
 *                         type: string
 *                       nombre:
 *                         type: string
 *       400:
 *         description: Error de validación - Ciclo escolar requerido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "ciclo": requerido, no puede estar vacío
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/ciclo/:ciclo", obtenerCursosPorCicloValidator, obtenerCursosPorCiclo);

/**
 * @swagger
 * /cursos/profesor/{uid}:
 *   get:
 *     summary: Obtener cursos por profesor
 *     description: Retorna todos los cursos donde el profesor tiene materias asignadas
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del profesor
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Cursos del profesor obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nivel:
 *                         type: string
 *                       grado:
 *                         type: string
 *                       seccion:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       materias:
 *                         type: array
 *                         description: Materias que imparte el profesor en este curso
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *     x-middleware:
 *       - validateJWT (se asume, aunque no tiene validator específico)
 *     x-roles-permitidos: Cualquier usuario autenticado
 */
router.get("/profesor/:uid", obtenerCursosPorProfesor);

/**
 * @swagger
 * /cursos/coordinador/{uid}:
 *   get:
 *     summary: Obtener cursos por coordinador
 *     description: Retorna todos los cursos asignados a un coordinador específico
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del coordinador
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Cursos del coordinador obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       nivel:
 *                         type: string
 *                       grado:
 *                         type: string
 *                       seccion:
 *                         type: string
 *                       cicloEscolar:
 *                         type: string
 *                       nombre:
 *                         type: string
 *                       coordinador:
 *                         type: object
 *       400:
 *         description: Error de validación - ID de coordinador inválido
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
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.get("/coordinador/:uid", obtenerCursosPorCoordinadorValidator, obtenerCursosPorCoordinador);

/**
 * @swagger
 * /cursos/{id}:
 *   get:
 *     summary: Obtener curso por ID
 *     description: Retorna los datos completos de un curso específico
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del curso
 *         example: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Curso encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 curso:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nivel:
 *                       type: string
 *                     grado:
 *                       type: string
 *                     seccion:
 *                       type: string
 *                     jornada:
 *                       type: string
 *                     cicloEscolar:
 *                       type: string
 *                     capacidadMaxima:
 *                       type: integer
 *                     nombre:
 *                       type: string
 *                     coordinador:
 *                       type: object
 *                     estado:
 *                       type: boolean
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/:id", obtenerCursoPorIdValidator, obtenerCursoPorId);

/**
 * @swagger
 * /cursos/{id}:
 *   put:
 *     summary: Actualizar curso
 *     description: Actualiza los datos de un curso existente
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del curso a actualizar
 *         example: 507f1f77bcf86cd799439015
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nivel:
 *                 type: string
 *                 enum: [PREPRIMARIA, PRIMARIA, BASICO]
 *                 example: PRIMARIA
 *               grado:
 *                 type: string
 *                 enum: [PARVULOS_1, PARVULOS_2, PARVULOS_3, PREPARATORIA, PRIMERO_PRIMARIA, SEGUNDO_PRIMARIA, TERCERO_PRIMARIA, CUARTO_PRIMARIA, QUINTO_PRIMARIA, SEXTO_PRIMARIA, PRIMERO_BASICO, SEGUNDO_BASICO, TERCERO_BASICO]
 *                 example: SEXTO_PRIMARIA
 *               seccion:
 *                 type: string
 *                 enum: [A, B, C]
 *                 example: B
 *               jornada:
 *                 type: string
 *                 enum: [MATUTINA, VESPERTINA]
 *                 example: VESPERTINA
 *               cicloEscolar:
 *                 type: string
 *                 example: 2025-2026
 *               capacidadMaxima:
 *                 type: integer
 *                 minimum: 1
 *                 example: 35
 *     responses:
 *       200:
 *         description: Curso actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Curso actualizado exitosamente
 *                 curso:
 *                   type: object
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *       - Campos opcionales deben cumplir con los valores permitidos
 *       - Campo "capacidadMaxima": debe ser entero mayor a 0
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.put("/:id", actualizarCursoValidator, actualizarCurso);

/**
 * @swagger
 * /cursos/asignar-coordinador/{id}:
 *   patch:
 *     summary: Asignar coordinador a un curso
 *     description: Asigna o reasigna un coordinador a un curso específico
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del curso
 *         example: 507f1f77bcf86cd799439015
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coordinador
 *             properties:
 *               coordinador:
 *                 type: string
 *                 description: ID del coordinador a asignar (debe tener rol COORDINADOR_ROLE)
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Coordinador asignado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Coordinador asignado exitosamente
 *                 curso:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     coordinador:
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
 *                           example: COORDINADOR_ROLE
 *       400:
 *         description: Error de validación - ID inválido o usuario no es coordinador
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden asignar coordinadores
 *       404:
 *         description: Curso o coordinador no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir en la BD
 *       - Campo "coordinador": requerido, debe ser un ID de MongoDB válido
 *       - El usuario asignado debe tener rol COORDINADOR_ROLE
 *       - El coordinador debe existir en la base de datos
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 */
router.patch("/asignar-coordinador/:id", asignarCoordinadorValidator, asignarCoordinador);

/**
 * @swagger
 * /cursos/{id}:
 *   delete:
 *     summary: Eliminar curso (borrado lógico)
 *     description: Realiza un borrado lógico del curso, cambiando su estado a inactivo
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de MongoDB del curso a eliminar
 *         example: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Curso eliminado exitosamente (borrado lógico)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Curso eliminado exitosamente
 *                 curso:
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
 *         description: Prohibido - Solo administradores pueden eliminar cursos
 *       404:
 *         description: Curso no encontrado
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
router.delete("/:id", eliminarCursoValidator, eliminarCurso);

export default router;
