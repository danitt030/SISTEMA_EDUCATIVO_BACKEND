import { hash, verify } from "argon2";
import User from "./user.model.js";

export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            user: user.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el usuario",
            error: err.message
        });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            users: users.map(user => user.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        });
    }
};

export const obtenerUsuariosPorRole = async (req, res) => {
    try {
        const { role } = req.params;
        const { limite = 10, desde = 0 } = req.query;

        const query = { status: true, role };

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            users: users.map(user => user.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener usuarios por rol",
            error: err.message
        });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { uid } = req.params;
        const { _id, password, role, ...resto } = req.body;

        const usuarioActualizado = await User.findByIdAndUpdate(uid, resto, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            user: usuarioActualizado.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: err.message
        });
    }
};

export const actualizarPassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newPassword } = req.body;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const matchOldAndNewPassword = await verify(user.password, newPassword);
        if (matchOldAndNewPassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            });
        }

        const encryptedPassword = await hash(newPassword);
        user.password = encryptedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar contraseña",
            error: err.message
        });
    }
};

export const actualizarRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { newRole } = req.body;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        if (user.role === newRole) {
            return res.status(400).json({
                success: false,
                message: "El nuevo rol no puede ser igual al actual"
            });
        }

        const validRoles = ["ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE", "PADRE_ROLE", "ALUMNO_ROLE"];
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({
                success: false,
                message: "Rol no válido"
            });
        }

        await User.findByIdAndUpdate(uid, { role: newRole }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Rol actualizado correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar rol",
            error: err.message
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { uid } = req.params;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        // Eliminación lógica (cambiar status a false)
         await User.findByIdAndDelete(uid);

        return res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: err.message
        });
    }
};

export const eliminarCuenta = async (req, res) => {
    try {
        const { uid } = req.params;
        const { password } = req.body;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        const isValidPassword = await verify(user.password, password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "La contraseña es incorrecta"
            });
        }

        // Eliminación física de la cuenta
        await User.findByIdAndDelete(uid);

        return res.status(200).json({
            success: true,
            message: "Cuenta eliminada correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la cuenta",
            error: err.message
        });
    }
};
