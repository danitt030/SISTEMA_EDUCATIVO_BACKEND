import User from "../user/user.model.js";

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