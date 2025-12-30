import { Router } from "express";
import {
    registrarCalificacion,
    obtenerCalificaciones,
    obtenerCalificacionPorId,
    obtenerCalificacionesPorEstudiante,
    obtenerCuadroNotas,
    editarCalificacion,
    eliminarCalificacion,
    generarBoletaPDF
} from "./calificacion.controller.js";

import {
    registrarCalificacionValidator,
    obtenerCalificacionesValidator,
    obtenerCalificacionPorIdValidator,
    obtenerCalificacionesPorEstudianteValidator,
    obtenerCuadroNotasValidator,
    editarCalificacionValidator,
    eliminarCalificacionValidator,
    generarBoletaPDFValidator
} from "../middlewares/calificacion-validators.js";

const router = Router();

/**
 * @swagger
 * /calificaciones/registrar:
 *   post:
 *     summary: Registrar calificación
 *     description: Registra una nueva calificación para un estudiante en una materia y bimestre específico
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estudiante
 *               - materia
 *               - curso
 *               - bimestre
 *               - cicloEscolar
 *               - zona
 *               - examen
 *             properties:
 *               estudiante:
 *                 type: string
 *                 description: ID del estudiante (debe tener rol ALUMNO_ROLE)
 *                 example: 507f1f77bcf86cd799439016
 *               materia:
 *                 type: string
 *                 description: ID de la materia
 *                 example: 507f1f77bcf86cd799439013
 *               curso:
 *                 type: string
 *                 description: ID del curso
 *                 example: 507f1f77bcf86cd799439015
 *               bimestre:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 4
 *                 description: Número de bimestre (1, 2, 3 o 4)
 *                 example: 1
 *               cicloEscolar:
 *                 type: integer
 *                 minimum: 2020
 *                 maximum: 2100
 *                 description: Año del ciclo escolar
 *                 example: 2024
 *               zona:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 60
 *                 description: Puntuación de zona (0-60 puntos)
 *                 example: 45.5
 *               examen:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 40
 *                 description: Puntuación de examen (0-40 puntos)
 *                 example: 35.0
 *               observaciones:
 *                 type: string
 *                 description: Observaciones adicionales (opcional)
 *                 example: Excelente desempeño en el bimestre
 *     responses:
 *       201:
 *         description: Calificación registrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Calificación registrada exitosamente
 *                 calificacion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439020
 *                     estudiante:
 *                       type: string
 *                     materia:
 *                       type: string
 *                     curso:
 *                       type: string
 *                     bimestre:
 *                       type: integer
 *                     cicloEscolar:
 *                       type: integer
 *                     zona:
 *                       type: number
 *                     examen:
 *                       type: number
 *                     total:
 *                       type: number
 *                       description: Suma de zona + examen
 *                       example: 80.5
 *                     observaciones:
 *                       type: string
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
 *                         example: La zona debe estar entre 0 y 60
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Estudiante, materia o curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Campo "estudiante": requerido, ID válido de MongoDB, debe tener rol ALUMNO_ROLE
 *       - Campo "materia": requerido, ID válido de MongoDB, debe existir
 *       - Campo "curso": requerido, ID válido de MongoDB, debe existir
 *       - Campo "bimestre": requerido, debe ser 1, 2, 3 o 4
 *       - Campo "cicloEscolar": requerido, entero entre 2020 y 2100
 *       - Campo "zona": requerido, decimal entre 0 y 60
 *       - Campo "examen": requerido, decimal entre 0 y 40
 *       - Campo "observaciones": opcional, debe ser texto
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, PROFESOR_ROLE
 */
router.post("/registrar", registrarCalificacionValidator, registrarCalificacion);

/**
 * @swagger
 * /calificaciones:
 *   get:
 *     summary: Obtener todas las calificaciones
 *     description: Retorna una lista con todas las calificaciones del sistema
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de calificaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calificaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       estudiante:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           surname:
 *                             type: string
 *                       materia:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                       curso:
 *                         type: object
 *                       bimestre:
 *                         type: integer
 *                       cicloEscolar:
 *                         type: integer
 *                       zona:
 *                         type: number
 *                       examen:
 *                         type: number
 *                       total:
 *                         type: number
 *                       observaciones:
 *                         type: string
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
router.get("/", obtenerCalificacionesValidator, obtenerCalificaciones);

/**
 * @swagger
 * /calificaciones/estudiante/{uid}/{ciclo}:
 *   get:
 *     summary: Obtener calificaciones por estudiante (Boleta)
 *     description: Retorna todas las calificaciones de un estudiante en un ciclo escolar específico
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *         example: 507f1f77bcf86cd799439016
 *       - in: path
 *         name: ciclo
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2100
 *         description: Año del ciclo escolar
 *         example: 2024
 *     responses:
 *       200:
 *         description: Calificaciones del estudiante obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estudiante:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     surname:
 *                       type: string
 *                 cicloEscolar:
 *                   type: integer
 *                 calificaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       materia:
 *                         type: object
 *                       bimestre:
 *                         type: integer
 *                       zona:
 *                         type: number
 *                       examen:
 *                         type: number
 *                       total:
 *                         type: number
 *                       observaciones:
 *                         type: string
 *       400:
 *         description: Error de validación - ID o ciclo inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Estudiante no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - Parámetro "ciclo": debe ser entero entre 2020 y 2100
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE, PADRE_ROLE, ALUMNO_ROLE
 */
router.get("/estudiante/:uid/:ciclo", obtenerCalificacionesPorEstudianteValidator, obtenerCalificacionesPorEstudiante);

/**
 * @swagger
 * /calificaciones/boleta/{uid}/{ciclo}:
 *   get:
 *     summary: Generar boleta en PDF
 *     description: Genera y descarga la boleta de calificaciones de un estudiante en formato PDF
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *         example: 507f1f77bcf86cd799439016
 *       - in: path
 *         name: ciclo
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2100
 *         description: Año del ciclo escolar
 *         example: 2024
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Error de validación - ID o ciclo inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Estudiante no encontrado o sin calificaciones
 *       500:
 *         description: Error al generar el PDF
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *       - Parámetro "ciclo": debe ser entero entre 2020 y 2100
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE, PADRE_ROLE, ALUMNO_ROLE
 *     x-nota: Este endpoint devuelve un archivo PDF, no JSON
 */
router.get("/boleta/:uid/:ciclo", generarBoletaPDFValidator, generarBoletaPDF);

/**
 * @swagger
 * /calificaciones/cuadro/{cursoId}/{materiaId}/{bimestre}:
 *   get:
 *     summary: Obtener cuadro de notas
 *     description: Retorna las calificaciones de todos los estudiantes de un curso en una materia y bimestre específico
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *         example: 507f1f77bcf86cd799439015
 *       - in: path
 *         name: materiaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la materia
 *         example: 507f1f77bcf86cd799439013
 *       - in: path
 *         name: bimestre
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *         description: Número de bimestre (1, 2, 3 o 4)
 *         example: 1
 *       - in: query
 *         name: cicloEscolar
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 2020
 *           maximum: 2100
 *         description: Año del ciclo escolar
 *         example: 2024
 *     responses:
 *       200:
 *         description: Cuadro de notas obtenido exitosamente
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
 *                     nombre:
 *                       type: string
 *                 materia:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                 bimestre:
 *                   type: integer
 *                 cicloEscolar:
 *                   type: integer
 *                 calificaciones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       estudiante:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           surname:
 *                             type: string
 *                       zona:
 *                         type: number
 *                       examen:
 *                         type: number
 *                       total:
 *                         type: number
 *                       observaciones:
 *                         type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Curso o materia no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "cursoId": debe ser un ID de MongoDB válido y existir
 *       - Parámetro "materiaId": debe ser un ID de MongoDB válido y existir
 *       - Parámetro "bimestre": debe ser 1, 2, 3 o 4
 *       - Query "cicloEscolar": requerido, entero entre 2020 y 2100
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/cuadro/:cursoId/:materiaId/:bimestre", obtenerCuadroNotasValidator, obtenerCuadroNotas);

/**
 * @swagger
 * /calificaciones/{id}:
 *   get:
 *     summary: Obtener calificación por ID
 *     description: Retorna los datos de una calificación específica
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la calificación
 *         example: 507f1f77bcf86cd799439020
 *     responses:
 *       200:
 *         description: Calificación encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 calificacion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     estudiante:
 *                       type: object
 *                     materia:
 *                       type: object
 *                     curso:
 *                       type: object
 *                     bimestre:
 *                       type: integer
 *                     cicloEscolar:
 *                       type: integer
 *                     zona:
 *                       type: number
 *                     examen:
 *                       type: number
 *                     total:
 *                       type: number
 *                     observaciones:
 *                       type: string
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Calificación no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *     x-middleware:
 *       - validateJWT
 *     x-roles-permitidos: Cualquier usuario autenticado
 */
router.get("/:id", obtenerCalificacionPorIdValidator, obtenerCalificacionPorId);

/**
 * @swagger
 * /calificaciones/{id}:
 *   put:
 *     summary: Editar calificación
 *     description: Actualiza los datos de una calificación existente
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la calificación a editar
 *         example: 507f1f77bcf86cd799439020
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               zona:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 60
 *                 description: Nueva puntuación de zona (0-60 puntos)
 *                 example: 50.0
 *               examen:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 maximum: 40
 *                 description: Nueva puntuación de examen (0-40 puntos)
 *                 example: 38.0
 *               observaciones:
 *                 type: string
 *                 description: Nuevas observaciones
 *                 example: Mejoró significativamente
 *     responses:
 *       200:
 *         description: Calificación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Calificación actualizada exitosamente
 *                 calificacion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     zona:
 *                       type: number
 *                     examen:
 *                       type: number
 *                     total:
 *                       type: number
 *                       description: Recalculado automáticamente
 *                     observaciones:
 *                       type: string
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Calificación no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *       - Campo "zona": opcional, decimal entre 0 y 60
 *       - Campo "examen": opcional, decimal entre 0 y 40
 *       - Campo "observaciones": opcional, debe ser texto
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, PROFESOR_ROLE
 *     x-nota: El campo "total" se recalcula automáticamente como zona + examen
 */
router.put("/:id", editarCalificacionValidator, editarCalificacion);

/**
 * @swagger
 * /calificaciones/{id}:
 *   delete:
 *     summary: Eliminar calificación
 *     description: Elimina permanentemente una calificación del sistema
 *     tags: [Calificaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la calificación a eliminar
 *         example: 507f1f77bcf86cd799439020
 *     responses:
 *       200:
 *         description: Calificación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Calificación eliminada exitosamente
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden eliminar calificaciones
 *       404:
 *         description: Calificación no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 *     x-advertencia: Esta acción es irreversible
 */
router.delete("/:id", eliminarCalificacionValidator, eliminarCalificacion);

export default router;
