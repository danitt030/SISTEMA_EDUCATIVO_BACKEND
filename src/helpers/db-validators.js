import User from "../user/user.model.js";
import Curso from "../cursos/cursos.model.js";
import Materia from "../materia/materia.model.js";

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