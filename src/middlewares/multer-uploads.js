import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
const MAX_SIZE = 100000000; // 100MB

const createMulterConfig = (destinationFolder) => {
    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const fullPath = join(CURRENT_DIR, destinationFolder);
                req.filePath = fullPath;
                cb(null, fullPath);
            },
            filename: (req, file, cb) => {
                const fileExtension = extname(file.originalname);
                const fileName = file.originalname.split(fileExtension)[0];
                cb(null, `${fileName}-${Date.now()}${fileExtension}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (MIMETYPES.includes(file.mimetype)) cb(null, true);
            else cb(new Error(`Solamente se aceptan archivos de los siguientes tipos: ${MIMETYPES.join(" ")}`));
        },
        limits: {
            fileSize: MAX_SIZE
        }
    });
};

// Configuraciones específicas para sistema educativo
export const uploadProfilePicture = createMulterConfig("../../public/uploads/profile-pictures");
export const uploadStudentPhoto = createMulterConfig("../../public/uploads/student-photos");
export const uploadDocuments = createMulterConfig("../../public/uploads/documents");
export const uploadEventPhotos = createMulterConfig("../../public/uploads/events");
