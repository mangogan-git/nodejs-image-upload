const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const DEST = 'uploads/';

if (!fs.existsSync(DEST)) fs.mkdirSync(DEST);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, DEST);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
    }
})

const upload = multer({ storage: storage });


const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.post('/upload', upload.single('photo'), (req, res) => {
    if (req.file) {
        res.json(req.file);
    }
    else throw 'error';
});


app.get('/*', function (req, res) {
    const ROOT_DIR = __dirname;

    const filePath = path.join(ROOT_DIR, req.path);
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err)
            return notFound(req, res);
        res.sendFile(filePath);
    });
});



app.listen(PORT, () => {
    console.log('Listening at ' + PORT);
});

function notFound(req, res, next) {
    res.status(404).json({ error: 'endpoint/file not found' });
}