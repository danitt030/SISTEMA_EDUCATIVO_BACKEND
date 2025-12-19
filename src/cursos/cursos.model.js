import mongoose from "mongoose";

const CursoSchema = new mongoose.Schema({
    nivel: {
        type: String,
        enum: ["PREPRIMARIA", "PRIMARIA", "BASICO"],
        required: [true, "El nivel es requerido"]
    },
    grado: {
        type: String,
        enum: [
            // Preprimaria
            "PARVULOS_1", "PARVULOS_2", "PARVULOS_3", "PREPARATORIA",
            // Primaria
            "PRIMERO_PRIMARIA", "SEGUNDO_PRIMARIA", "TERCERO_PRIMARIA",
            "CUARTO_PRIMARIA", "QUINTO_PRIMARIA", "SEXTO_PRIMARIA",
            // Básico
            "PRIMERO_BASICO", "SEGUNDO_BASICO", "TERCERO_BASICO"
        ],
        required: [true, "El grado es requerido"]
    },
    seccion: {
        type: String,
        enum: ["A", "B", "C"],
        required: [true, "La sección es requerida"]
    },
    jornada: {
        type: String,
        enum: ["MATUTINA", "VESPERTINA"],
        required: [true, "La jornada es requerida"]
    },
    cicloEscolar: {
        type: String,
        required: [true, "El ciclo escolar es requerido"]
    },
    capacidadMaxima: {
        type: Number,
        default: 30
    },
    coordinador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índice único para evitar cursos duplicados
CursoSchema.index(
    { nivel: 1, grado: 1, seccion: 1, jornada: 1, cicloEscolar: 1 },
    { unique: true }
);

// Método toJSON para limpiar la respuesta
CursoSchema.methods.toJSON = function() {
    const { _id, ...curso } = this.toObject();
    curso.cid = _id;
    return curso;
};

export default mongoose.model("Curso", CursoSchema);
