import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
        maxLength: [50, "El nombre no puede exceder 50 caracteres"]
    },
    surname: {
        type: String,
        required: [true, "El apellido es requerido"],
        maxLength: [50, "El apellido no puede exceder 50 caracteres"]
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "El email es requerido"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"]
    },
    phone: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "COORDINADOR_ROLE", "PROFESOR_ROLE", "PADRE_ROLE", "ALUMNO_ROLE"],
        default: "ALUMNO_ROLE"
    },
    codigoEstudiante: {
        type: String,
        unique: true,
        sparse: true
    },
    codigoEmpleado: {
        type: String,
        unique: true,
        sparse: true
    },
    codigoPadre: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
});

userSchema.methods.toJSON = function() {
    const { password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model("User", userSchema);