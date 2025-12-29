import { hash } from "argon2";
import Usuario from "../src/user/user.model.js";

/**
 * Crea un usuario administrador por defecto si no existe ningún admin en el sistema
 * Se ejecuta al iniciar el servidor
 * 
 * Credenciales por defecto:
 * - Email: admin@sistema.edu
 * - Username: admin
 * - Password: Admin123
 */
export const crearAdmin = async () => {
    try {
        const adminExistente = await Usuario.findOne({ role: "ADMIN_ROLE" });

        if (adminExistente) {
            return;
        }

        const datosAdmin = {
            name: "Administrador",
            surname: "Sistema",
            username: "admin",
            email: "admin@sistema.edu",
            password: await hash("Admin123"),
            phone: "+502 0000-0000",
            role: "ADMIN_ROLE",
            codigoEmpleado: "ADMIN-001",
            profilePicture: null,
            status: true
        };

        const nuevoAdmin = new Usuario(datosAdmin);
        await nuevoAdmin.save();

    } catch (err) {
        throw new Error(`Error al crear el administrador: ${err.message}`);
    }
};