import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Sistema Educativo API",
            version: "1.0.0",
            description: "API para un sistema educativo",
            contact:{
                name: "Daniel Tuy",
                email: "danieltuy100@gmail.com"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3002/sistemaEducativo/v1"
            }
        ]
    },
    apis:[
        "./src/auth/auth.routes.js",
        "./src/user/user.routes.js",
        "./src/cursos/cursos.routes.js",
        "./src/materia/materia.routes.js",
        "./src/asignacionEstudiante/asignacionEstudiante.routes.js",
        "./src/calificacion/calificacion.routes.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}