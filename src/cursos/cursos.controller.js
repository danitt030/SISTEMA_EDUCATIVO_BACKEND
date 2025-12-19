import Curso from "./cursos.model.js";

// Crear un nuevo curso
export const crearCurso = async (req, res) => {
    try {
        const data = req.body;
        const curso = await Curso.create(data);

        return res.status(201).json({
            success: true,
            message: "Curso creado exitosamente",
            curso: curso.toJSON()
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un curso con esa combinación de nivel, grado, sección, jornada y ciclo escolar"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al crear el curso",
            error: err.message
        });
    }
};

// Obtener todos los cursos
export const obtenerCursos = async (req, res) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
                .populate("coordinador", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ createdAt: -1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            cursos: cursos.map(curso => curso.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los cursos",
            error: err.message
        });
    }
};

// Obtener curso por ID
export const obtenerCursoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await Curso.findById(id)
            .populate("coordinador", "name surname email codigoEmpleado");

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            curso: curso.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el curso",
            error: err.message
        });
    }
};

// Obtener cursos por nivel
export const obtenerCursosPorNivel = async (req, res) => {
    try {
        const { nivel } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, nivel };

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
                .populate("coordinador", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ grado: 1, seccion: 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            cursos: cursos.map(curso => curso.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener cursos por nivel",
            error: err.message
        });
    }
};

// Obtener cursos por grado
export const obtenerCursosPorGrado = async (req, res) => {
    try {
        const { grado } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, grado };

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
                .populate("coordinador", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ seccion: 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            cursos: cursos.map(curso => curso.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener cursos por grado",
            error: err.message
        });
    }
};

// Obtener cursos por ciclo escolar
export const obtenerCursosPorCiclo = async (req, res) => {
    try {
        const { ciclo } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, cicloEscolar: ciclo };

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
                .populate("coordinador", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nivel: 1, grado: 1, seccion: 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            cursos: cursos.map(curso => curso.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener cursos por ciclo escolar",
            error: err.message
        });
    }
};

// Obtener cursos por coordinador
export const obtenerCursosPorCoordinador = async (req, res) => {
    try {
        const { uid } = req.params;
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true, coordinador: uid };

        const [total, cursos] = await Promise.all([
            Curso.countDocuments(query),
            Curso.find(query)
                .populate("coordinador", "name surname email codigoEmpleado")
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ nivel: 1, grado: 1, seccion: 1 })
        ]);

        return res.status(200).json({
            success: true,
            total,
            cursos: cursos.map(curso => curso.toJSON())
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener cursos del coordinador",
            error: err.message
        });
    }
};

// Actualizar curso
export const actualizarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, status, ...resto } = req.body;

        const cursoActualizado = await Curso.findByIdAndUpdate(id, resto, { new: true })
            .populate("coordinador", "name surname email codigoEmpleado");

        if (!cursoActualizado) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Curso actualizado correctamente",
            curso: cursoActualizado.toJSON()
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un curso con esa combinación de nivel, grado, sección, jornada y ciclo escolar"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el curso",
            error: err.message
        });
    }
};

// Asignar coordinador a un curso
export const asignarCoordinador = async (req, res) => {
    try {
        const { id } = req.params;
        const { coordinador } = req.body;

        const cursoActualizado = await Curso.findByIdAndUpdate(
            id,
            { coordinador },
            { new: true }
        ).populate("coordinador", "name surname email codigoEmpleado");

        if (!cursoActualizado) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Coordinador asignado correctamente",
            curso: cursoActualizado.toJSON()
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al asignar coordinador",
            error: err.message
        });
    }
};

// Eliminar curso (lógico)
export const eliminarCurso = async (req, res) => {
    try {
        const { id } = req.params;

        const curso = await Curso.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!curso) {
            return res.status(404).json({
                success: false,
                message: "Curso no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Curso eliminado correctamente"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al eliminar el curso",
            error: err.message
        });
    }
};
