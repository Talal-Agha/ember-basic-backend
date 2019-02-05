var express = require('express');
var fs = require("fs");
var router = express.Router();
var url = "http://localhost:3000/";
var videos = [{
    id: "3sd1rd",
    title: "Video 1",
    thumbnail_url: "http://www.hellofrommars.com/test/images/barber-shop/generic/thumbnail.jpg",
    url: url+"ember/videos/file/file_1.mp4",
    uploaded_at: 1549228268264
}, {
    id: "31rdfd",
    title: "Video 2",
    thumbnail_url: "http://www.hellofrommars.com/test/images/barber-shop/generic/thumbnail.jpg",
    url: url + "ember/videos/file/file_1.mp4",
    uploaded_at: 1549228268264
}, {
    id: "3c1drd",
    title: "Video 3",
    thumbnail_url: "http://www.hellofrommars.com/test/images/barber-shop/generic/thumbnail.jpg",
    url: url + "ember/videos/file/file_1.mp4",
    uploaded_at: 1549228268264
}];
router.get('/videos', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(videos));
});
router.get('/videos/:video_id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(videos.find(video => {
        return video.id == req.params.video_id
    })));
});
router.get('/videos/file/:video_name', function (req, res, next) {

    const path = 'public/videos/' + req.params.video_name;
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ?
            parseInt(parts[1], 10) :
            fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, {
            start,
            end
        })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});
module.exports = router;