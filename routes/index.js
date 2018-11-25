var express = require('express');
var crypto = require('crypto');
var path = require('path')
var router = express.Router();

/* Multer */
var multer  = require('multer');

var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});
var multerConfig = multer({ dest: './uploads/', storage: storage}).single('file');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Express' });
});



router.post('/uploads', multerConfig , function(req,res){
	console.log(req.body); 
	console.log(req.file); 
	res.end("204).end(");
});

module.exports = router;
