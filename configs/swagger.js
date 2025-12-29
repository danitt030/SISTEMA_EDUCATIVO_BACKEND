import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Detectar entorno para usar la URL correcta
const isProduction = process.env.NODE_ENV === "production";
const serverUrl = isProduction 
    ? process.env.API_URL || "https://sistema-educativo-backend.vercel.app/sistemaEducativo/v1"
    : `http://127.0.0.1:${process.env.PORT || 3002}/sistemaEducativo/v1`;

const options = {
    swaggerDefinition: {
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
                url: serverUrl,
                description: isProduction ? "Servidor de Producción" : "Servidor de Desarrollo"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Ingresa tu token JWT"
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