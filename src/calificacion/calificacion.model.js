import mongoose from "mongoose";

const CalificacionSchema = new mongoose.Schema({
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El estudiante es requerido"]
    },
    materia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Materia",
        required: [true, "La materia es requerida"]
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
        required: [true, "El curso es requerido"]
    },
    bimestre: {
        type: Number,
        required: [true, "El bimestre es requerido"],
        enum: [1, 2, 3, 4]
    },
    cicloEscolar: {
        type: Number,
        required: [true, "El ciclo escolar es requerido"]
    },
    zona: {
        type: Number,
        required: [true, "La zona es requerida"],
        min: [0, "La zona no puede ser menor a 0"],
        max: [60, "La zona no puede ser mayor a 60"]
    },
    examen: {
        type: Number,
        required: [true, "El examen es requerido"],
        min: [0, "El examen no puede ser menor a 0"],
        max: [40, "El examen no puede ser mayor a 40"]
    },
    total: {
        type: Number,
        default: 0
    },
    observaciones: {
        type: String,
        default: ""
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El profesor que registra es requerido"]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

// Índice único: no puede haber 2 notas del mismo estudiante + materia + bimestre + ciclo
CalificacionSchema.index(
    { estudiante: 1, materia: 1, bimestre: 1, cicloEscolar: 1 }, 
    { unique: true }
);

// Middleware pre-save: calcular total automáticamente
CalificacionSchema.pre("save", function(next) {
    this.total = this.zona + this.examen;
    next();
});

// Middleware pre-update: recalcular total si se actualiza zona o examen
CalificacionSchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();
    if (update.zona !== undefined || update.examen !== undefined) {
        // Necesitamos obtener los valores actuales si no vienen en el update
        this.model.findOne(this.getQuery()).then(doc => {
            const zona = update.zona !== undefined ? update.zona : doc.zona;
            const examen = update.examen !== undefined ? update.examen : doc.examen;
            update.total = zona + examen;
            next();
        });
    } else {
        next();
    }
});

// Método toJSON
CalificacionSchema.methods.toJSON = function() {
    const { _id, ...calificacion } = this.toObject();
    calificacion.cid = _id;
    return calificacion;
};

export default mongoose.model("Calificacion", CalificacionSchema);
