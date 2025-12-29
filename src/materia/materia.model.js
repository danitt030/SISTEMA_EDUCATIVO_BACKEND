import mongoose from "mongoose";

const MateriaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre de la materia es requerido"]
    },
    descripcion: {
        type: String,
        default: ""
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
        required: [true, "El curso es requerido"]
    },
    profesor: {
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

// Índice único: no puede haber la misma materia en el mismo curso
MateriaSchema.index({ nombre: 1, curso: 1 }, { unique: true });

// Método toJSON
MateriaSchema.methods.toJSON = function() {
    const { _id, ...materia } = this.toObject();
    materia.mid = _id;
    return materia;
};

export default mongoose.model("Materia", MateriaSchema);
