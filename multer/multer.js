const multer = require("multer");
const fs = require("fs");
const path = require("path");


const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "uploads");
        ensureDirectoryExists(uploadDir);
        cb(null, uploadDir);
    },



    filename: (req, file, cb) => {
        // Sanitize the original filename
        const sanitizedOriginalName = file.originalname.replace(
            /[^a-zA-Z0-9.]/g,
            "_"
        );
        cb(null, `${file.fieldname}_${Date.now()}_${sanitizedOriginalName}`);
    },
});




// Export multer setup using CommonJS
const upload = multer({ storage: storage });

module.exports = { upload };