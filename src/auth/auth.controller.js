import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
    try {
        const data = req.body;
        let profilePicture = req.file ? req.file.filename : null;
        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;
        data.profilePicture = profilePicture;

        const user = await User.create(data);

        return res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
            user: {
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al registrar usuario",
            error: err.message
        });
    }
};

export const login = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Credenciales inválidas",
                error: "Usuario o email no encontrado"
            });
        }

        if (!user.status) {
            return res.status(400).json({
                success: false,
                message: "Usuario desactivado"
            });
        }

        const validPassword = await verify(user.password, password);

        if (!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Credenciales inválidas",
                error: "Contraseña incorrecta"
            });
        }

        const token = await generateJWT(user.id);
        const userJson = user.toJSON();

        return res.status(200).json({
            success: true,
            message: "Login exitoso",
            userDetails: {
                uid: userJson.uid,
                name: userJson.name,
                surname: userJson.surname,
                username: userJson.username,
                email: userJson.email,
                phone: userJson.phone,
                role: userJson.role,
                profilePicture: user.profilePicture,
                token: token
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error en el login",
            error: err.message
        });
    }
};