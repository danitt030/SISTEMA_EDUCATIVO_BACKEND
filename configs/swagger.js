import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// URL base del servidor
const getServerUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return "https://sistema-educativo-backend.vercel.app/sistemaEducativo/v1";
    }
    return "http://127.0.0.1:3002/sistemaEducativo/v1";
};

const options = {
    definition: { 
        openapi: "3.0.0",
        info: {
            title: "Sistema Educativo API",
            version: "1.0.0",
            description: "API para un sistema educativo",
            contact: {
                name: "Daniel Tuy",
                email: "danieltuy100@gmail.com"
            }
        },
        servers: [
            {
                url: getServerUrl(),
                description: process.env.NODE_ENV === 'production' ? 'Servidor de Producción' : 'Servidor de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/cursos/cursos.routes.js",
        "./src/materia/materia.routes.js",
        "./src/asignacionEstudiante/asignacionEstudiante.routes.js",
        "./src/calificacion/calificacion.routes.js"
    ]
};

const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };