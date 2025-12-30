import { Router } from "express";
import {
    inscribirEstudiante,
    obtenerAsignaciones,
    obtenerAsignacionPorId,
    obtenerEstudiantesPorCurso,
    obtenerCursosDeEstudiante,
    obtenerEstudiantesPorEncargado,
    actualizarAsignacion,
    cambiarCurso,
    eliminarAsignacion
} from "./asignacionEstudiante.controller.js";

import {
    inscribirEstudianteValidator,
    obtenerAsignacionesValidator,
    obtenerAsignacionPorIdValidator,
    obtenerEstudiantesPorCursoValidator,
    obtenerCursosDeEstudianteValidator,
    obtenerEstudiantesPorEncargadoValidator,
    actualizarAsignacionValidator,
    cambiarCursoValidator,
    eliminarAsignacionValidator
} from "../middlewares/asignacion-validators.js";

const router = Router();

/**
 * @swagger
 * /asignaciones/inscribir:
 *   post:
 *     summary: Inscribir estudiante a un curso
 *     description: Crea una nueva asignación inscribiendo a un estudiante en un curso específico con su encargado
 *     tags: [Asignaciones]
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
 *               - curso
 *               - encargado
 *               - cicloEscolar
 *             properties:
 *               estudiante:
 *                 type: string
 *                 description: ID del estudiante a inscribir (debe tener rol ALUMNO_ROLE)
 *                 example: 507f1f77bcf86cd799439016
 *               curso:
 *                 type: string
 *                 description: ID del curso al que se inscribe
 *                 example: 507f1f77bcf86cd799439015
 *               encargado:
 *                 type: string
 *                 description: ID del encargado/padre del estudiante (debe tener rol PADRE_ROLE)
 *                 example: 507f1f77bcf86cd799439017
 *               cicloEscolar:
 *                 type: string
 *                 description: Ciclo escolar de la inscripción
 *                 example: 2024-2025
 *               becado:
 *                 type: boolean
 *                 description: Indica si el estudiante tiene beca (opcional)
 *                 example: false
 *               observaciones:
 *                 type: string
 *                 description: Observaciones adicionales sobre la inscripción (opcional)
 *                 example: Estudiante nuevo en el colegio
 *     responses:
 *       201:
 *         description: Estudiante inscrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Estudiante inscrito exitosamente
 *                 asignacion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439025
 *                     estudiante:
 *                       type: string
 *                     curso:
 *                       type: string
 *                     encargado:
 *                       type: string
 *                     cicloEscolar:
 *                       type: string
 *                     becado:
 *                       type: boolean
 *                     observaciones:
 *                       type: string
 *                     fechaInscripcion:
 *                       type: string
 *                       format: date-time
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
 *                         example: El estudiante es requerido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Estudiante, curso o encargado no encontrado
 *       409:
 *         description: Conflicto - El estudiante ya está inscrito en este curso
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Campo "estudiante": requerido, ID válido de MongoDB, debe tener rol ALUMNO_ROLE y existir
 *       - Campo "curso": requerido, ID válido de MongoDB, debe existir
 *       - Campo "encargado": requerido, ID válido de MongoDB, debe tener rol PADRE_ROLE y existir
 *       - Campo "cicloEscolar": requerido
 *       - Campo "becado": opcional, debe ser booleano
 *       - Campo "observaciones": opcional, debe ser texto
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.post("/inscribir", inscribirEstudianteValidator, inscribirEstudiante);

/**
 * @swagger
 * /asignaciones:
 *   get:
 *     summary: Obtener todas las asignaciones
 *     description: Retorna una lista con todas las asignaciones de estudiantes a cursos del sistema
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asignaciones:
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
 *                           email:
 *                             type: string
 *                       curso:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                           nivel:
 *                             type: string
 *                           grado:
 *                             type: string
 *                       encargado:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           surname:
 *                             type: string
 *                       cicloEscolar:
 *                         type: string
 *                       becado:
 *                         type: boolean
 *                       fechaInscripcion:
 *                         type: string
 *                         format: date-time
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
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.get("/", obtenerAsignacionesValidator, obtenerAsignaciones);

/**
 * @swagger
 * /asignaciones/curso/{cursoId}:
 *   get:
 *     summary: Obtener estudiantes por curso
 *     description: Retorna todos los estudiantes asignados a un curso específico
 *     tags: [Asignaciones]
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
 *     responses:
 *       200:
 *         description: Estudiantes del curso obtenidos exitosamente
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
 *                     nivel:
 *                       type: string
 *                     grado:
 *                       type: string
 *                 estudiantes:
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
 *                           email:
 *                             type: string
 *                       encargado:
 *                         type: object
 *                       cicloEscolar:
 *                         type: string
 *                       becado:
 *                         type: boolean
 *                       fechaInscripcion:
 *                         type: string
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
 *       - Parámetro "cursoId": debe ser un ID de MongoDB válido y existir
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE
 */
router.get("/curso/:cursoId", obtenerEstudiantesPorCursoValidator, obtenerEstudiantesPorCurso);

/**
 * @swagger
 * /asignaciones/estudiante/{uid}:
 *   get:
 *     summary: Obtener cursos de un estudiante
 *     description: Retorna todos los cursos en los que está inscrito un estudiante
 *     tags: [Asignaciones]
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
 *     responses:
 *       200:
 *         description: Cursos del estudiante obtenidos exitosamente
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
 *                 cursos:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       curso:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           nombre:
 *                             type: string
 *                           nivel:
 *                             type: string
 *                           grado:
 *                             type: string
 *                       cicloEscolar:
 *                         type: string
 *                       becado:
 *                         type: boolean
 *                       fechaInscripcion:
 *                         type: string
 *       400:
 *         description: Error de validación - ID inválido
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
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PADRE_ROLE, ALUMNO_ROLE
 */
router.get("/estudiante/:uid", obtenerCursosDeEstudianteValidator, obtenerCursosDeEstudiante);

/**
 * @swagger
 * /asignaciones/encargado/{uid}:
 *   get:
 *     summary: Obtener estudiantes por encargado (hijos)
 *     description: Retorna todos los estudiantes asignados a un encargado/padre específico
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del encargado/padre
 *         example: 507f1f77bcf86cd799439017
 *     responses:
 *       200:
 *         description: Estudiantes del encargado obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 encargado:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     surname:
 *                       type: string
 *                 estudiantes:
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
 *                       curso:
 *                         type: object
 *                       cicloEscolar:
 *                         type: string
 *                       becado:
 *                         type: boolean
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Encargado no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "uid": debe ser un ID de MongoDB válido
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE, PADRE_ROLE
 */
router.get("/encargado/:uid", obtenerEstudiantesPorEncargadoValidator, obtenerEstudiantesPorEncargado);

/**
 * @swagger
 * /asignaciones/{id}:
 *   get:
 *     summary: Obtener asignación por ID
 *     description: Retorna los datos completos de una asignación específica
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación
 *         example: 507f1f77bcf86cd799439025
 *     responses:
 *       200:
 *         description: Asignación encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 asignacion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     estudiante:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         surname:
 *                           type: string
 *                         email:
 *                           type: string
 *                     curso:
 *                       type: object
 *                     encargado:
 *                       type: object
 *                     cicloEscolar:
 *                       type: string
 *                     becado:
 *                       type: boolean
 *                     observaciones:
 *                       type: string
 *                     fechaInscripcion:
 *                       type: string
 *                       format: date-time
 *                     estado:
 *                       type: boolean
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.get("/:id", obtenerAsignacionPorIdValidator, obtenerAsignacionPorId);

/**
 * @swagger
 * /asignaciones/{id}:
 *   put:
 *     summary: Actualizar asignación
 *     description: Actualiza los datos de una asignación existente
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación a actualizar
 *         example: 507f1f77bcf86cd799439025
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               curso:
 *                 type: string
 *                 description: Nuevo ID del curso
 *                 example: 507f1f77bcf86cd799439015
 *               encargado:
 *                 type: string
 *                 description: Nuevo ID del encargado
 *                 example: 507f1f77bcf86cd799439017
 *               cicloEscolar:
 *                 type: string
 *                 description: Nuevo ciclo escolar
 *                 example: 2025-2026
 *               becado:
 *                 type: boolean
 *                 description: Actualizar estado de beca
 *                 example: true
 *               observaciones:
 *                 type: string
 *                 description: Nuevas observaciones
 *                 example: Estudiante con excelente rendimiento
 *     responses:
 *       200:
 *         description: Asignación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Asignación actualizada exitosamente
 *                 asignacion:
 *                   type: object
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Asignación, curso o encargado no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *       - Campo "curso": opcional, ID válido de MongoDB, debe existir
 *       - Campo "encargado": opcional, ID válido de MongoDB, debe tener rol PADRE_ROLE
 *       - Campo "cicloEscolar": opcional, no puede estar vacío si se proporciona
 *       - Campo "becado": opcional, debe ser booleano
 *       - Campo "observaciones": opcional, debe ser texto
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 */
router.put("/:id", actualizarAsignacionValidator, actualizarAsignacion);

/**
 * @swagger
 * /asignaciones/cambiar-curso/{id}:
 *   patch:
 *     summary: Cambiar curso (trasladar estudiante)
 *     description: Traslada a un estudiante de un curso a otro curso diferente
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación
 *         example: 507f1f77bcf86cd799439025
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - curso
 *             properties:
 *               curso:
 *                 type: string
 *                 description: ID del nuevo curso al que se traslada el estudiante
 *                 example: 507f1f77bcf86cd799439018
 *     responses:
 *       200:
 *         description: Estudiante trasladado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Estudiante trasladado exitosamente
 *                 asignacion:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     estudiante:
 *                       type: object
 *                     curso:
 *                       type: object
 *                       description: Curso actualizado
 *                     cicloEscolar:
 *                       type: string
 *       400:
 *         description: Error de validación - ID inválido o curso requerido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 *       404:
 *         description: Asignación o curso no encontrado
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *       - Campo "curso": requerido, ID válido de MongoDB, debe existir
 *       - El nuevo curso debe ser diferente al curso actual
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE, COORDINADOR_ROLE
 *     x-nota: Esta operación mantiene toda la información de la asignación excepto el curso
 */
router.patch("/cambiar-curso/:id", cambiarCursoValidator, cambiarCurso);

/**
 * @swagger
 * /asignaciones/{id}:
 *   delete:
 *     summary: Eliminar asignación (dar de baja)
 *     description: Elimina una asignación, dando de baja a un estudiante de un curso
 *     tags: [Asignaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la asignación a eliminar
 *         example: 507f1f77bcf86cd799439025
 *     responses:
 *       200:
 *         description: Asignación eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Asignación eliminada exitosamente
 *       400:
 *         description: Error de validación - ID inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido - Solo administradores pueden eliminar asignaciones
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error interno del servidor
 *     x-validaciones:
 *       - Parámetro "id": debe ser un ID de MongoDB válido y existir
 *     x-middleware:
 *       - validateJWT
 *       - hasRoles
 *     x-roles-permitidos: ADMIN_ROLE
 *     x-advertencia: Esta acción da de baja al estudiante del curso
 */
router.delete("/:id", eliminarAsignacionValidator, eliminarAsignacion);

export default router;
