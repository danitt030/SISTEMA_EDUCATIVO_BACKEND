import mongoose from "mongoose";

const AsignacionEstudianteSchema = new mongoose.Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El estudiante es requerido"]
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
        required: [true, "El curso es requerido"]
    },
    encargado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El encargado es requerido"]
    },
    cicloEscolar: {
        type: String,
        required: [true, "El ciclo escolar es requerido"]
    },
    fechaInscripcion: {
        type: Date,
        default: Date.now
    },
    becado: {
        type: Boolean,
        default: false
    },
    observaciones: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índice único: un estudiante no puede estar inscrito 2 veces en el mismo curso y ciclo
AsignacionEstudianteSchema.index(
    { estudiante: 1, curso: 1, cicloEscolar: 1 },
    { unique: true }
);

// Método toJSON
AsignacionEstudianteSchema.methods.toJSON = function() {
    const { _id, ...asignacion } = this.toObject();
    asignacion.aid = _id;
    return asignacion;
};

export default mongoose.model("AsignacionEstudiante", AsignacionEstudianteSchema);
