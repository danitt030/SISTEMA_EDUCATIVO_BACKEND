import { Router } from "express";
import { register, login } from "./auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/user-validators.js";
import { uploadProfilePicture } from "../middlewares/multer-uploads.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de nuevo usuario
 *     description: Registra un nuevo usuario en el sistema. Acepta una imagen de perfil opcional.
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - username
 *               - email
 *               - password
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del usuario
 *                 example: Juan
 *               surname:
 *                 type: string
 *                 description: Apellido del usuario
 *                 example: Pérez
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 example: jperez
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario (debe ser único)
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Contraseña del usuario (mínimo 6 caracteres)
 *                 example: password123
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del usuario
 *                 example: "+34600123456"
 *               role:
 *                 type: string
 *                 enum: [ADMIN_ROLE, COORDINADOR_ROLE, PROFESOR_ROLE, PADRE_ROLE, ALUMNO_ROLE]
 *                 description: Rol del usuario (opcional, por defecto se asignará uno)
 *                 example: ALUMNO_ROLE
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario (opcional)
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 user:
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
 *                     profilePicture:
 *                       type: string
 *                       example: /uploads/profile-pictures/1234567890.jpg
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Error de validación - Datos inválidos o incompletos
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
 *                         example: El email es requerido
 *                       param:
 *                         type: string
 *                         example: email
 *                       location:
 *                         type: string
 *                         example: body
 *       409:
 *         description: Conflicto - El email o username ya existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: El email ya está registrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Error interno del servidor
 *     security: []
 *     x-validaciones:
 *       - Campo "name": requerido
 *       - Campo "surname": requerido
 *       - Campo "username": requerido y único en la base de datos
 *       - Campo "email": requerido, formato email válido y único en la base de datos
 *       - Campo "password": requerido, mínimo 6 caracteres
 *       - Campo "phone": requerido
 *       - Campo "role": opcional, debe ser uno de los roles válidos
 *       - Campo "profilePicture": opcional, archivo de imagen
 *     x-middleware:
 *       - uploadProfilePicture (Multer para subida de imagen)
 *       - registerValidator (Validación de campos)
 *     x-roles-permitidos: Público (no requiere autenticación)
 */
router.post("/register", uploadProfilePicture.single("profilePicture"), registerValidator, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario mediante email/username y contraseña, retornando un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del usuario (requerido si no se proporciona username)
 *                 example: juan.perez@example.com
 *               username:
 *                 type: string
 *                 description: Nombre de usuario (requerido si no se proporciona email)
 *                 example: jperez
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *                 example: password123
 *           examples:
 *             loginConEmail:
 *               summary: Login con email
 *               value:
 *                 email: juan.perez@example.com
 *                 password: password123
 *             loginConUsername:
 *               summary: Login con username
 *               value:
 *                 username: jperez
 *                 password: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Login exitoso
 *                 user:
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
 *                     profilePicture:
 *                       type: string
 *                       example: /uploads/profile-pictures/1234567890.jpg
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación en futuras peticiones
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Error de validación - Datos inválidos o incompletos
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
 *                       param:
 *                         type: string
 *                         example: password
 *                       location:
 *                         type: string
 *                         example: body
 *       401:
 *         description: No autorizado - Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario o contraseña incorrectos
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Error interno del servidor
 *     security: []
 *     x-validaciones:
 *       - Campo "email": opcional, pero si se proporciona debe tener formato email válido
 *       - Campo "username": opcional, pero debe proporcionarse email o username
 *       - Campo "password": requerido
 *       - Nota: Se debe proporcionar al menos "email" o "username" para identificar al usuario
 *     x-middleware:
 *       - loginValidator (Validación de campos)
 *     x-roles-permitidos: Público (no requiere autenticación)
 */
router.post("/login", loginValidator, login);

export default router;