import User from "../user/user.model.js";
import Curso from "../cursos/cursos.model.js";
import Materia from "../materia/materia.model.js";
import AsignacionEstudiante from "../asignacionEstudiante/asignacionEstudiante.model.js";
import Calificacion from "../calificacion/calificacion.model.js";

export const emailExists = async (email) => {
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
};

export const usernameExists = async (username) => {
    const existeUsername = await User.findOne({ username });
    if (existeUsername) {
        throw new Error(`El username ${username} ya está registrado`);
    }
};

export const userExists = async (uid) => {
    const existeUser = await User.findById(uid);
    if (!existeUser) {
        throw new Error(`El usuario con id ${uid} no existe`);
    }
};

// ==================== CURSOS ====================

export const cursoExists = async (id) => {
    const existeCurso = await Curso.findById(id);
    if (!existeCurso) {
        throw new Error(`El curso con id ${id} no existe`);
    }
};

export const validarCoordinador = async (uid) => {
    const user = await User.findById(uid);
    if (!user) {
        throw new Error(`El usuario con id ${uid} no existe`);
    }
    if (user.role !== "COORDINADOR_ROLE") {
        throw new Error(`El usuario ${user.name} no tiene rol de coordinador`);
    }
};

// ==================== MATERIAS ====================

export const materiaExists = async (id) => {
    const existeMateria = await Materia.findById(id);
    if (!existeMateria) {
        throw new Error(`La materia con id ${id} no existe`);
    }
};

export const validarProfesor = async (uid) => {
    const user = await User.findById(uid);
    if (!user) {
        throw new Error(`El usuario con id ${uid} no existe`);
    }
    if (user.role !== "PROFESOR_ROLE") {
        throw new Error(`El usuario ${user.name} no tiene rol de profesor`);
    }
};

// ==================== ASIGNACIÓN ESTUDIANTES ====================

export const asignacionExists = async (id) => {
    const existeAsignacion = await AsignacionEstudiante.findById(id);
    if (!existeAsignacion) {
        throw new Error(`La asignación con id ${id} no existe`);
    }
};

export const validarEstudiante = async (uid) => {
    const user = await User.findById(uid);
    if (!user) {
        throw new Error(`El usuario con id ${uid} no existe`);
    }
    if (user.role !== "ALUMNO_ROLE") {
        throw new Error(`El usuario ${user.name} no tiene rol de estudiante`);
    }
};

export const validarEncargado = async (uid) => {
    const user = await User.findById(uid);
    if (!user) {
        throw new Error(`El usuario con id ${uid} no existe`);
    }
    if (user.role !== "PADRE_ROLE") {
        throw new Error(`El usuario ${user.name} no tiene rol de padre/encargado`);
    }
};

// ==================== CALIFICACIONES ====================

export const calificacionExists = async (id) => {
    const existeCalificacion = await Calificacion.findById(id);
    if (!existeCalificacion) {
        throw new Error(`La calificación con id ${id} no existe`);
    }
};