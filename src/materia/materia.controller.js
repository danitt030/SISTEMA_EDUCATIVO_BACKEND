import Materia from "./materia.model.js";

// Crear materia
export const crearMateria = async (req, res) => {
    try {
        const data = req.body;
        const materia = await Materia.create(data);

        const materiaPopulada = await Materia.findById(materia._id)
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("profesor", "name surname email codigoEmpleado");

        return res.status(201).json({
            success: true,
            message: "Materia creada exitosamente",
            materia: materiaPopulada.toJSON()
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe esta materia en el curso seleccionado"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al crear la materia",
            error: err.message
        });
    }
};

// Obtener todas las materias
export const obtenerMaterias = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = {};

        const [total, materias] = await Promise.all([
            Materia.countDocuments(query),
            Materia.find(query)
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("profesor", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            materias: materias.map(m => m.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener las materias",
            error: err.message
        });
    }
};

// Obtener materia por ID
export const obtenerMateriaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const materia = await Materia.findById(id)
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("profesor", "name surname email codigoEmpleado");

        if (!materia) {
            return res.status(404).json({
                success: false,
                message: "Materia no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            materia: materia.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener la materia",
            error: err.message
        });
    }
};

// Obtener materias por curso
export const obtenerMateriasPorCurso = async (req, res) => {
    try {
        const { cursoId } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, curso: cursoId };

        const [total, materias] = await Promise.all([
            Materia.countDocuments(query),
            Materia.find(query)
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("profesor", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            materias: materias.map(m => m.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener materias del curso",
            error: err.message
        });
    }
};

// Obtener materias por profesor
export const obtenerMateriasPorProfesor = async (req, res) => {
    try {
        const { uid } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, profesor: uid };

        const [total, materias] = await Promise.all([
            Materia.countDocuments(query),
            Materia.find(query)
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("profesor", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nombre: 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            materias: materias.map(m => m.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener materias del profesor",
            error: err.message
        });
    }
};

// Actualizar materia
export const actualizarMateria = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...dataToUpdate } = req.body;

        const materiaActualizada = await Materia.findByIdAndUpdate(id, dataToUpdate, { new: true })
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("profesor", "name surname email codigoEmpleado");

        if (!materiaActualizada) {
            return res.status(404).json({
                success: false,
                message: "Materia no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Materia actualizada correctamente",
            materia: materiaActualizada.toJSON()
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe esta materia en el curso seleccionado"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la materia",
            error: err.message
        });
    }
};

// Asignar profesor a materia
export const asignarProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { profesor } = req.body;

        const materiaActualizada = await Materia.findByIdAndUpdate(
            id,
            { profesor },
            { new: true }
        )
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("profesor", "name surname email codigoEmpleado");

        if (!materiaActualizada) {
            return res.status(404).json({
                success: false,
                message: "Materia no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profesor asignado correctamente",
            materia: materiaActualizada.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al asignar profesor",
            error: err.message
        });
    }
};

// Eliminar materia (lógico)
export const eliminarMateria = async (req, res) => {
    try {
        const { id } = req.params;

        const materia = await Materia.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!materia) {
            return res.status(404).json({
                success: false,
                message: "Materia no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Materia eliminada correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la materia",
            error: err.message
        });
    }
};


