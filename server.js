const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(fileUpload());
app.use(express.json());

// 프로젝트/그림 저장
app.post('/save', (req, res) => {
    const { filename, data } = req.body;
    if (!filename || !data) return res.status(400).send('Missing data');
    const filepath = path.join(__dirname, 'uploads', filename + '.json');
    fs.writeFileSync(filepath, JSON.stringify(data));
    res.send({ success: true });
});

// 프로젝트/그림 불러오기
app.get('/load/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'uploads', req.params.filename + '.json');
    if (!fs.existsSync(filepath)) return res.status(404).send('File not found');
    const data = JSON.parse(fs.readFileSync(filepath));
    res.send(data);
});

// 이미지 업로드
app.post('/upload', (req, res) => {
    if (!req.files || !req.files.image) return res.status(400).send('No image uploaded');
    const image = req.files.image;
    const uploadPath = path.join(__dirname, 'uploads', image.name);
    image.mv(uploadPath, (err) => {
        if (err) return res.status(500).send(err);
        res.send({ success: true, path: '/uploads/' + image.name });
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
