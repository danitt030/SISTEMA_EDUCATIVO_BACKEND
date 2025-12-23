import Calificacion from "./calificacion.model.js";
import Materia from "../materia/materia.model.js";
import AsignacionEstudiante from "../asignacionEstudiante/asignacionEstudiante.model.js";
import User from "../user/user.model.js";
import PDFDocument from "pdfkit";

// ==================== 1. REGISTRAR CALIFICACIÓN ====================
export const registrarCalificacion = async (req, res) => {
    try {
        const { estudiante, materia, curso, bimestre, cicloEscolar, zona, examen, observaciones } = req.body;
        const registradoPor = req.usuario._id;

        // Verificar que el estudiante esté inscrito en ese curso
        // Buscar con cicloEscolar como número o string
        const inscripcion = await AsignacionEstudiante.findOne({
            estudiante,
            curso,
            $or: [
                { cicloEscolar: cicloEscolar },
                { cicloEscolar: cicloEscolar.toString() },
                { cicloEscolar: parseInt(cicloEscolar) }
            ],
            status: true
        });

        if (!inscripcion) {
            return res.status(400).json({
                success: false,
                message: "El estudiante no está inscrito en este curso para este ciclo escolar (o la inscripción está inactiva)"
            });
        }

        // Verificar que no exista ya una calificación para este bimestre
        const existeCalificacion = await Calificacion.findOne({
            estudiante,
            materia,
            bimestre,
            cicloEscolar,
            status: true
        });

        if (existeCalificacion) {
            return res.status(400).json({
                success: false,
                message: `Ya existe una calificación registrada para el bimestre ${bimestre}`
            });
        }

        const calificacion = new Calificacion({
            estudiante,
            materia,
            curso,
            bimestre,
            cicloEscolar,
            zona,
            examen,
            observaciones,
            registradoPor
        });

        await calificacion.save();

        await calificacion.populate([
            { path: "estudiante", select: "name surname code" },
            { path: "materia", select: "nombre" },
            { path: "curso", select: "nombre seccion" }
        ]);

        res.status(201).json({
            success: true,
            message: "Calificación registrada exitosamente",
            calificacion
        });

    } catch (error) {
        console.error("Error en registrarCalificacion:", error);
        res.status(500).json({
            success: false,
            message: "Error al registrar la calificación",
            error: error.message
        });
    }
};

// ==================== 2. OBTENER TODAS LAS CALIFICACIONES ====================
export const obtenerCalificaciones = async (req, res) => {
    try {
        const { limite = 50, desde = 0, cicloEscolar, bimestre } = req.query;
        const query = { status: true };

        if (cicloEscolar) query.cicloEscolar = parseInt(cicloEscolar);
        if (bimestre) query.bimestre = parseInt(bimestre);

        const [total, calificaciones] = await Promise.all([
            Calificacion.countDocuments(query),
            Calificacion.find(query)
                .populate("estudiante", "name surname code")
                .populate("materia", "nombre")
                .populate("curso", "nombre seccion")
                .populate("registradoPor", "name surname")
                .skip(parseInt(desde))
                .limit(parseInt(limite))
                .sort({ createdAt: -1 })
        ]);

        res.status(200).json({
            success: true,
            total,
            calificaciones
        });

    } catch (error) {
        console.error("Error en obtenerCalificaciones:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las calificaciones",
            error: error.message
        });
    }
};

// ==================== 3. OBTENER CALIFICACIÓN POR ID ====================
export const obtenerCalificacionPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const calificacion = await Calificacion.findById(id)
            .populate("estudiante", "name surname code")
            .populate("materia", "nombre")
            .populate("curso", "nombre seccion")
            .populate("registradoPor", "name surname");

        if (!calificacion) {
            return res.status(404).json({
                success: false,
                message: "Calificación no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            calificacion
        });

    } catch (error) {
        console.error("Error en obtenerCalificacionPorId:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener la calificación",
            error: error.message
        });
    }
};

// ==================== 4. OBTENER CALIFICACIONES POR ESTUDIANTE (BOLETA) ====================
export const obtenerCalificacionesPorEstudiante = async (req, res) => {
    try {
        const { uid, ciclo } = req.params;

        // Obtener inscripción del estudiante
        const inscripcion = await AsignacionEstudiante.findOne({
            estudiante: uid,
            $or: [
                { cicloEscolar: parseInt(ciclo) },
                { cicloEscolar: ciclo.toString() }
            ],
            status: true
        }).populate("curso", "grado seccion nivel jornada");

        if (!inscripcion) {
            return res.status(404).json({
                success: false,
                message: "El estudiante no tiene inscripción para este ciclo escolar"
            });
        }

        // Obtener todas las calificaciones del estudiante
        const calificaciones = await Calificacion.find({
            estudiante: uid,
            cicloEscolar: parseInt(ciclo),
            status: true
        })
            .populate("estudiante", "name surname codigoEstudiante")
            .populate("materia", "nombre")
            .populate("curso", "grado seccion nivel")
            .sort({ "materia.nombre": 1, bimestre: 1 });

        // Agrupar por materia para formato de boleta
        const materias = await Materia.find({ 
            curso: inscripcion.curso._id,
            status: true 
        }).select("nombre");

        const boleta = materias.map(materia => {
            const notasMateria = calificaciones.filter(
                c => c.materia._id.toString() === materia._id.toString()
            );

            const bimestres = {
                bimestre1: null,
                bimestre2: null,
                bimestre3: null,
                bimestre4: null
            };

            notasMateria.forEach(nota => {
                bimestres[`bimestre${nota.bimestre}`] = {
                    zona: nota.zona,
                    examen: nota.examen,
                    total: nota.total
                };
            });

            // Calcular promedio de bimestres con nota
            const totales = Object.values(bimestres)
                .filter(b => b !== null)
                .map(b => b.total);
            
            const promedio = totales.length > 0 
                ? Math.round((totales.reduce((a, b) => a + b, 0) / totales.length) * 100) / 100
                : null;

            // Determinar nota mínima para aprobar según nivel
            const notaMinima = inscripcion.curso.nivel === "DIVERSIFICADO" ? 70 : 60;

            return {
                materia: materia.nombre,
                ...bimestres,
                promedio,
                aprobado: promedio !== null ? promedio >= notaMinima : null
            };
        });

        // Calcular promedio general
        const promediosValidos = boleta.filter(m => m.promedio !== null).map(m => m.promedio);
        const promedioGeneral = promediosValidos.length > 0
            ? Math.round((promediosValidos.reduce((a, b) => a + b, 0) / promediosValidos.length) * 100) / 100
            : null;

        // Contar aprobadas y reprobadas
        const materiasAprobadas = boleta.filter(m => m.aprobado === true).length;
        const materiasReprobadas = boleta.filter(m => m.aprobado === false).length;

        res.status(200).json({
            success: true,
            estudiante: calificaciones[0]?.estudiante || null,
            curso: inscripcion.curso,
            cicloEscolar: parseInt(ciclo),
            calificaciones: boleta,
            resumen: {
                promedioGeneral,
                materiasAprobadas,
                materiasReprobadas,
                totalMaterias: materias.length
            }
        });

    } catch (error) {
        console.error("Error en obtenerCalificacionesPorEstudiante:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las calificaciones del estudiante",
            error: error.message
        });
    }
};

// ==================== 5. CUADRO DE NOTAS (TODOS LOS ALUMNOS DE UN CURSO) ====================
export const obtenerCuadroNotas = async (req, res) => {
    try {
        const { cursoId, materiaId, bimestre } = req.params;
        const { cicloEscolar } = req.query;

        if (!cicloEscolar) {
            return res.status(400).json({
                success: false,
                message: "El ciclo escolar es requerido"
            });
        }

        // Obtener todos los estudiantes inscritos en el curso
        const inscripciones = await AsignacionEstudiante.find({
            curso: cursoId,
            cicloEscolar: parseInt(cicloEscolar),
            status: true
        }).populate("estudiante", "name surname code");

        // Obtener las calificaciones existentes
        const calificaciones = await Calificacion.find({
            curso: cursoId,
            materia: materiaId,
            bimestre: parseInt(bimestre),
            cicloEscolar: parseInt(cicloEscolar),
            status: true
        }).populate("estudiante", "name surname code");

        // Combinar: todos los estudiantes con sus notas (o null si no tienen)
        const cuadro = inscripciones.map(insc => {
            const calificacion = calificaciones.find(
                c => c.estudiante._id.toString() === insc.estudiante._id.toString()
            );

            return {
                estudiante: insc.estudiante,
                calificacion: calificacion ? {
                    cid: calificacion._id,
                    zona: calificacion.zona,
                    examen: calificacion.examen,
                    total: calificacion.total,
                    observaciones: calificacion.observaciones
                } : null
            };
        });

        // Ordenar por nombre
        cuadro.sort((a, b) => a.estudiante.surname.localeCompare(b.estudiante.surname));

        // Estadísticas
        const conNota = cuadro.filter(c => c.calificacion !== null);
        const totales = conNota.map(c => c.calificacion.total);
        const promedioCurso = totales.length > 0
            ? Math.round((totales.reduce((a, b) => a + b, 0) / totales.length) * 100) / 100
            : null;

        res.status(200).json({
            success: true,
            bimestre: parseInt(bimestre),
            cicloEscolar: parseInt(cicloEscolar),
            totalEstudiantes: inscripciones.length,
            estudiantesConNota: conNota.length,
            estudiantesSinNota: inscripciones.length - conNota.length,
            promedioCurso,
            cuadro
        });

    } catch (error) {
        console.error("Error en obtenerCuadroNotas:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el cuadro de notas",
            error: error.message
        });
    }
};

// ==================== 6. EDITAR CALIFICACIÓN ====================
export const editarCalificacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { zona, examen, observaciones } = req.body;

        const calificacion = await Calificacion.findById(id);

        if (!calificacion) {
            return res.status(404).json({
                success: false,
                message: "Calificación no encontrada"
            });
        }

        if (!calificacion.status) {
            return res.status(400).json({
                success: false,
                message: "No se puede editar una calificación eliminada"
            });
        }

        // Actualizar campos
        if (zona !== undefined) calificacion.zona = zona;
        if (examen !== undefined) calificacion.examen = examen;
        if (observaciones !== undefined) calificacion.observaciones = observaciones;

        // Recalcular total
        calificacion.total = calificacion.zona + calificacion.examen;

        await calificacion.save();

        await calificacion.populate([
            { path: "estudiante", select: "name surname code" },
            { path: "materia", select: "nombre" },
            { path: "curso", select: "nombre seccion" }
        ]);

        res.status(200).json({
            success: true,
            message: "Calificación actualizada exitosamente",
            calificacion
        });

    } catch (error) {
        console.error("Error en editarCalificacion:", error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar la calificación",
            error: error.message
        });
    }
};

// ==================== 7. ELIMINAR CALIFICACIÓN ====================
export const eliminarCalificacion = async (req, res) => {
    try {
        const { id } = req.params;

        const calificacion = await Calificacion.findByIdAndUpdate(
            id,
            { status: false },
            { new: true }
        );

        if (!calificacion) {
            return res.status(404).json({
                success: false,
                message: "Calificación no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Calificación eliminada exitosamente",
            calificacion
        });

    } catch (error) {
        console.error("Error en eliminarCalificacion:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar la calificación",
            error: error.message
        });
    }
};

// ==================== 8. GENERAR BOLETA PDF ====================
export const generarBoletaPDF = async (req, res) => {
    try {
        const { uid, ciclo } = req.params;

        // Obtener datos del estudiante
        const estudiante = await User.findById(uid).select("name surname codigoEstudiante");
        if (!estudiante) {
            return res.status(404).json({
                success: false,
                message: "Estudiante no encontrado"
            });
        }

        // Obtener inscripción del estudiante
        const inscripcion = await AsignacionEstudiante.findOne({
            estudiante: uid,
            $or: [
                { cicloEscolar: parseInt(ciclo) },
                { cicloEscolar: ciclo.toString() }
            ],
            status: true
        }).populate("curso", "grado seccion nivel jornada");

        if (!inscripcion) {
            return res.status(404).json({
                success: false,
                message: "El estudiante no tiene inscripción para este ciclo escolar"
            });
        }

        // Obtener todas las calificaciones del estudiante
        const calificaciones = await Calificacion.find({
            estudiante: uid,
            cicloEscolar: parseInt(ciclo),
            status: true
        })
            .populate("materia", "nombre")
            .sort({ "materia.nombre": 1, bimestre: 1 });

        // Obtener materias del curso
        const materias = await Materia.find({ 
            curso: inscripcion.curso._id,
            status: true 
        }).select("nombre").sort({ nombre: 1 });

        // Agrupar por materia - CADA BIMESTRE VALE 25 PUNTOS (100/4)
        const PUNTOS_POR_BIMESTRE = 25;
        
        const boleta = materias.map(materia => {
            const notasMateria = calificaciones.filter(
                c => c.materia._id.toString() === materia._id.toString()
            );

            // Guardar notas ORIGINALES (0-100)
            const bimestres = { b1: "-", b2: "-", b3: "-", b4: "-" };

            notasMateria.forEach(nota => {
                bimestres[`b${nota.bimestre}`] = nota.total; // Nota original 0-100
            });

            // Calcular ACUMULADO: suma de (nota/100 * 25) por cada bimestre
            const notasValidas = Object.values(bimestres).filter(b => b !== "-");
            let acumulado = "-";
            
            if (notasValidas.length > 0) {
                // Suma de puntos: cada bimestre aporta (nota/100) * 25
                const puntosAcumulados = notasValidas.reduce((sum, nota) => {
                    return sum + (parseFloat(nota) / 100) * PUNTOS_POR_BIMESTRE;
                }, 0);
                acumulado = Math.round(puntosAcumulados * 100) / 100;
            }

            return {
                materia: materia.nombre,
                ...bimestres,  // Notas originales 0-100
                acumulado      // Puntos acumulados (máx 100 si tiene los 4 bimestres)
            };
        });

        // Calcular acumulado general (promedio de acumulados)
        const acumuladosValidos = boleta.filter(m => m.acumulado !== "-").map(m => m.acumulado);
        const acumuladoGeneral = acumuladosValidos.length > 0
            ? Math.round((acumuladosValidos.reduce((a, b) => a + b, 0) / acumuladosValidos.length) * 100) / 100
            : 0;

        // Nota mínima para aprobar
        const notaMinima = inscripcion.curso.nivel === "DIVERSIFICADO" ? 70 : 60;

        // ==================== CREAR PDF ====================
        const doc = new PDFDocument({ margin: 50, size: "LETTER" });

        // Configurar headers para descarga
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition", 
            `attachment; filename=boleta_${estudiante.codigoEstudiante || estudiante._id}_${ciclo}.pdf`
        );

        doc.pipe(res);

        // ===== ENCABEZADO =====
        doc.fontSize(20).font("Helvetica-Bold").text("MI CASITA", { align: "center" });
        doc.fontSize(10).font("Helvetica").text("Centro Educativo", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(16).font("Helvetica-Bold").text("BOLETA DE CALIFICACIONES", { align: "center" });
        doc.moveDown();

        // ===== DATOS DEL ESTUDIANTE =====
        // Formatear el grado para que sea más legible
        const gradoFormateado = inscripcion.curso.grado
            ? inscripcion.curso.grado.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
            : "Sin grado";
        
        doc.fontSize(11).font("Helvetica-Bold");
        doc.text(`Nombre: `, { continued: true }).font("Helvetica").text(`${estudiante.name} ${estudiante.surname}`);
        doc.font("Helvetica-Bold").text(`Código: `, { continued: true }).font("Helvetica").text(`${estudiante.codigoEstudiante || "N/A"}`);
        doc.font("Helvetica-Bold").text(`Grado: `, { continued: true }).font("Helvetica").text(`${gradoFormateado} "${inscripcion.curso.seccion || "A"}"`);
        doc.font("Helvetica-Bold").text(`Jornada: `, { continued: true }).font("Helvetica").text(`${inscripcion.curso.jornada || "MATUTINA"}`);
        doc.font("Helvetica-Bold").text(`Ciclo Escolar: `, { continued: true }).font("Helvetica").text(`${ciclo}`);
        doc.moveDown();

        // ===== TABLA DE CALIFICACIONES =====
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidths = [180, 55, 55, 55, 55, 70]; // Materia, B1, B2, B3, B4, Promedio
        const rowHeight = 25;

        // Función para dibujar celda
        const drawCell = (x, y, width, height, text, isHeader = false, align = "center") => {
            doc.rect(x, y, width, height).stroke();
            doc.fontSize(isHeader ? 10 : 9);
            doc.font(isHeader ? "Helvetica-Bold" : "Helvetica");
            
            const textY = y + (height - 10) / 2;
            if (align === "left") {
                doc.text(text, x + 5, textY, { width: width - 10, align: "left" });
            } else {
                doc.text(text, x, textY, { width: width, align: "center" });
            }
        };

        // Encabezados de la tabla
        let currentX = tableLeft;
        const headers = ["MATERIA", "B1", "B2", "B3", "B4", "ACUMULADO"];
        headers.forEach((header, i) => {
            drawCell(currentX, tableTop, colWidths[i], rowHeight, header, true);
            currentX += colWidths[i];
        });

        // Filas de datos
        let currentY = tableTop + rowHeight;
        boleta.forEach(row => {
            currentX = tableLeft;
            
            drawCell(currentX, currentY, colWidths[0], rowHeight, row.materia, false, "left");
            currentX += colWidths[0];
            
            drawCell(currentX, currentY, colWidths[1], rowHeight, row.b1.toString());
            currentX += colWidths[1];
            
            drawCell(currentX, currentY, colWidths[2], rowHeight, row.b2.toString());
            currentX += colWidths[2];
            
            drawCell(currentX, currentY, colWidths[3], rowHeight, row.b3.toString());
            currentX += colWidths[3];
            
            drawCell(currentX, currentY, colWidths[4], rowHeight, row.b4.toString());
            currentX += colWidths[4];
            
            // Acumulado
            const acumuladoText = row.acumulado !== "-" ? row.acumulado.toString() : "-";
            drawCell(currentX, currentY, colWidths[5], rowHeight, acumuladoText);
            
            currentY += rowHeight;
        });

        // ===== CALCULAR PROMEDIOS Y PERDIDAS POR BIMESTRE =====
        // Promedio = promedio de las notas ORIGINALES (0-100) de todas las materias
        const calcularPromedioBimestre = (bimestre) => {
            const notas = boleta.map(m => m[bimestre]).filter(n => n !== "-");
            if (notas.length === 0) return "-";
            const suma = notas.reduce((a, b) => a + parseFloat(b), 0);
            return Math.round(suma / notas.length); // Nota promedio 0-100
        };

        const calcularPerdidasBimestre = (bimestre) => {
            // Una materia está perdida si la nota es menor a 60 (básico) o 70 (diversificado)
            const notas = boleta.map(m => m[bimestre]).filter(n => n !== "-");
            return notas.filter(n => parseFloat(n) < notaMinima).length;
        };

        const promedioB1 = calcularPromedioBimestre("b1");
        const promedioB2 = calcularPromedioBimestre("b2");
        const promedioB3 = calcularPromedioBimestre("b3");
        const promedioB4 = calcularPromedioBimestre("b4");

        const perdidasB1 = calcularPerdidasBimestre("b1");
        const perdidasB2 = calcularPerdidasBimestre("b2");
        const perdidasB3 = calcularPerdidasBimestre("b3");
        const perdidasB4 = calcularPerdidasBimestre("b4");

        // Calcular perdidas en acumulado (materias con menos de 60 o 70 puntos acumulados)
        const perdidasAcumulado = boleta.filter(m => m.acumulado !== "-" && parseFloat(m.acumulado) < notaMinima).length;

        // ===== FILA DE PROMEDIOS =====
        currentX = tableLeft;
        drawCell(currentX, currentY, colWidths[0], rowHeight, "PROMEDIOS", true, "left");
        currentX += colWidths[0];
        drawCell(currentX, currentY, colWidths[1], rowHeight, promedioB1.toString(), true);
        currentX += colWidths[1];
        drawCell(currentX, currentY, colWidths[2], rowHeight, promedioB2.toString(), true);
        currentX += colWidths[2];
        drawCell(currentX, currentY, colWidths[3], rowHeight, promedioB3.toString(), true);
        currentX += colWidths[3];
        drawCell(currentX, currentY, colWidths[4], rowHeight, promedioB4.toString(), true);
        currentX += colWidths[4];
        drawCell(currentX, currentY, colWidths[5], rowHeight, `${acumuladoGeneral}`, true);
        currentY += rowHeight;

        // ===== FILA DE PERDIDAS =====
        currentX = tableLeft;
        drawCell(currentX, currentY, colWidths[0], rowHeight, "PERDIDAS", true, "left");
        currentX += colWidths[0];
        drawCell(currentX, currentY, colWidths[1], rowHeight, perdidasB1.toString(), true);
        currentX += colWidths[1];
        drawCell(currentX, currentY, colWidths[2], rowHeight, perdidasB2.toString(), true);
        currentX += colWidths[2];
        drawCell(currentX, currentY, colWidths[3], rowHeight, perdidasB3.toString(), true);
        currentX += colWidths[3];
        drawCell(currentX, currentY, colWidths[4], rowHeight, perdidasB4.toString(), true);
        currentX += colWidths[4];
        // Celda vacía en acumulado para PERDIDAS
        drawCell(currentX, currentY, colWidths[5], rowHeight, "", true);

        // ===== LEYENDA =====
        doc.moveDown(3);
        doc.fontSize(9).font("Helvetica");
        doc.text(`Nota mínima de aprobación: ${notaMinima} puntos`, tableLeft);
        doc.text(`ACUMULADO = Suma de puntos por bimestre (cada uno vale 25 pts, máx 100)`, tableLeft);
        doc.text(`B1, B2, B3, B4 = Bimestres 1, 2, 3 y 4`, tableLeft);

        // ===== FIRMAS =====
        const firmaY = doc.page.height - 120;
        doc.moveTo(100, firmaY).lineTo(250, firmaY).stroke();
        doc.moveTo(350, firmaY).lineTo(500, firmaY).stroke();
        
        doc.fontSize(10);
        doc.text("Coordinación", 100, firmaY + 5, { width: 150, align: "center" });
        doc.text("Director(a)", 350, firmaY + 5, { width: 150, align: "center" });

        // ===== PIE DE PÁGINA =====
        doc.fontSize(8).text(
            `Generado el: ${new Date().toLocaleDateString("es-GT")} - Sistema Educativo Mi Casita`,
            50,
            doc.page.height - 50,
            { align: "center" }
        );

        doc.end();

    } catch (error) {
        console.error("Error en generarBoletaPDF:", error);
        res.status(500).json({
            success: false,
            message: "Error al generar la boleta PDF",
            error: error.message
        });
    }
};
