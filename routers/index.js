const express = require('express')
const router  = express.Router()
const fileUpload = require('express-fileupload');
const path = require('path')

router.use('/auth', require("./Auth/index"))
router.use('/profile', require("./Profile/index"))
router.use('/post', require("./post/index"))

router.use(fileUpload());

router.post('/upload', (req,res)=>{
    let sampleFile;
    let uploadPath;
  
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    sampleFile = req.files.image;
    let fileName = Date.now() + '-' + sampleFile.name;
    uploadPath = path.join(__dirname, '../public/images/' + fileName);
    console.log(uploadPath);
  
    
    sampleFile.mv(uploadPath, function(err) {
      if (err)
        return res.status(500).send(err);
  
      res.json({message : 'File uploaded!' , file : fileName});
    }); 
})

module.exports = router



