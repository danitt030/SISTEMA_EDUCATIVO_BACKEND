import AsignacionEstudiante from "./asignacionEstudiante.model.js";

// Inscribir estudiante a un curso
export const inscribirEstudiante = async (req, res) => {
    try {
        const data = req.body;
        const asignacion = await AsignacionEstudiante.create(data);

        const asignacionPopulada = await AsignacionEstudiante.findById(asignacion._id)
            .populate("estudiante", "name surname email codigoEstudiante")
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("encargado", "name surname email codigoPadre phone");

        return res.status(201).json({
            success: true,
            message: "Estudiante inscrito exitosamente",
            asignacion: asignacionPopulada.toJSON()
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "El estudiante ya está inscrito en este curso para el ciclo escolar indicado"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al inscribir estudiante",
            error: err.message
        });
    }
};

// Obtener todas las asignaciones
export const obtenerAsignaciones = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, asignaciones] = await Promise.all([
            AsignacionEstudiante.countDocuments(query),
            AsignacionEstudiante.find(query)
                .populate("estudiante", "name surname email codigoEstudiante")
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("encargado", "name surname email codigoPadre phone")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            asignaciones: asignaciones.map(a => a.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener las asignaciones",
            error: err.message
        });
    }
};

// Obtener asignación por ID
export const obtenerAsignacionPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const asignacion = await AsignacionEstudiante.findById(id)
            .populate("estudiante", "name surname email codigoEstudiante")
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("encargado", "name surname email codigoPadre phone");

        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: "Asignación no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            asignacion: asignacion.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener la asignación",
            error: err.message
        });
    }
};

// Obtener estudiantes por curso
export const obtenerEstudiantesPorCurso = async (req, res) => {
    try {
        const { cursoId } = req.params;
        const { limite = 50, desde = 0 } = req.query;
        const query = { status: true, curso: cursoId };

        const [total, asignaciones] = await Promise.all([
            AsignacionEstudiante.countDocuments(query),
            AsignacionEstudiante.find(query)
                .populate("estudiante", "name surname email codigoEstudiante profilePicture")
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("encargado", "name surname email codigoPadre phone")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ "estudiante.surname": 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            estudiantes: asignaciones.map(a => a.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener estudiantes del curso",
            error: err.message
        });
    }
};

// Obtener cursos de un estudiante
export const obtenerCursosDeEstudiante = async (req, res) => {
    try {
        const { uid } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, estudiante: uid };

        const [total, asignaciones] = await Promise.all([
            AsignacionEstudiante.countDocuments(query),
            AsignacionEstudiante.find(query)
                .populate("estudiante", "name surname email codigoEstudiante")
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("encargado", "name surname email codigoPadre phone")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ cicloEscolar: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            asignaciones: asignaciones.map(a => a.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener cursos del estudiante",
            error: err.message
        });
    }
};

// Obtener estudiantes por encargado (hijos)
export const obtenerEstudiantesPorEncargado = async (req, res) => {
    try {
        const { uid } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, encargado: uid };

        const [total, asignaciones] = await Promise.all([
            AsignacionEstudiante.countDocuments(query),
            AsignacionEstudiante.find(query)
                .populate("estudiante", "name surname email codigoEstudiante profilePicture")
                .populate("curso", "nivel grado seccion jornada cicloEscolar")
                .populate("encargado", "name surname email codigoPadre phone")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            hijos: asignaciones.map(a => a.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener estudiantes del encargado",
            error: err.message
        });
    }
};

// Actualizar asignación
export const actualizarAsignacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, status, estudiante, ...resto } = req.body;

        const asignacionActualizada = await AsignacionEstudiante.findByIdAndUpdate(id, resto, { new: true })
            .populate("estudiante", "name surname email codigoEstudiante")
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("encargado", "name surname email codigoPadre phone");

        if (!asignacionActualizada) {
            return res.status(404).json({
                success: false,
                message: "Asignación no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Asignación actualizada correctamente",
            asignacion: asignacionActualizada.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la asignación",
            error: err.message
        });
    }
};

// Cambiar curso (trasladar estudiante)
export const cambiarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { curso } = req.body;

        const asignacionActualizada = await AsignacionEstudiante.findByIdAndUpdate(
            id,
            { curso },
            { new: true }
        )
            .populate("estudiante", "name surname email codigoEstudiante")
            .populate("curso", "nivel grado seccion jornada cicloEscolar")
            .populate("encargado", "name surname email codigoPadre phone");

        if (!asignacionActualizada) {
            return res.status(404).json({
                success: false,
                message: "Asignación no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Estudiante trasladado correctamente",
            asignacion: asignacionActualizada.toJSON()
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "El estudiante ya está inscrito en ese curso"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al cambiar curso",
            error: err.message
        });
    }
};

// Eliminar asignación (dar de baja)
export const eliminarAsignacion = async (req, res) => {
    try {
        const { id } = req.params;

        const asignacion = await AsignacionEstudiante.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: "Asignación no encontrada"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Estudiante dado de baja correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al dar de baja al estudiante",
            error: err.message
        });
    }
};
