import User from "../user/user.model.js";

export const generarCodigoEstudiante = async () => {
    try{
        const ultimoEstudiante = await User.findOne({
            codigoEstudiante: {$exists: true}
        }).sort({ codigoEstudiante: -1});

        const numeroSiguiente = ultimoEstudiante
        ? parseInt(ultimoEstudiante.codigoEstudiante.split('-')[1]) +1
        : 1;

        return `EST-${numeroSiguiente.toString().padStart(4, '0')}`;
    }catch(err){
        throw new Error('Error al generar el codigo de Estudiante');
    }
}

export const generarCodigoEmpleado = async () => {
    try {
        const ultimoEmpleado = await User.findOne({
            codigoEmpleado: {$exists: true}
        }).sort({ codigoEmpleado: -1});

        const numeroSiguiente = ultimoEmpleado
        ? parseInt(ultimoEmpleado.codigoEmpleado.split('-')[1]) +1
        : 1;

        return `EMP-${numeroSiguiente.toString().padStart(4, '0')}`;
    }catch (error) {
        throw new Error('Error al generar el codigo de Empleado');
    }
}

export const generarCodigoPadre = async () => {
    try{
        const ultimoPadre = await User.findOne({
            codigoPadre: {$exists: true}
        }).sort({ codigoPadre: -1});

        const numeroSiguiente = ultimoPadre
        ? parseInt(ultimoPadre.codigoPadre.split('-')[1]) +1
        : 1;

        return `PAD-${numeroSiguiente.toString().padStart(4, '0')}`;
    }catch (error) {
        throw new Error('Error al generar el codigo de Padre');
    }   
}

export const asignarCodigoPorRole = async (role) => {
    switch(role){
        case "ALUMNO_ROLE":
        return{
            codigoEstudiante: await generarCodigoEstudiante()
        }
        case "PROFESOR_ROLE":
        case "COORDINADOR_ROLE":
        return{
            codigoEmpleado: await generarCodigoEmpleado()
        }
        case "PADRE_ROLE":
        return{
            codigoPadre: await generarCodigoPadre()
        }
        default:
            return {}; 
    }
}