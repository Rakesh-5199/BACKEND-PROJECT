// const express = require('express');
// const router = express.Router();
// const uploadImage = require("../Shared/UploadImage");
// const Image  =require("../Moduls/image")
// const authMiddleware = require('../authMiddleware');

// router.post("/uploadImage",authMiddleware,async (req, res) => {
//     const namealreadyfound = await Image.findOne({name:req.body.Name})
//     console.log(namealreadyfound)
//     if(namealreadyfound){
//       return res.status(404).send ({error:"This file name already found"})
//     }
//     else{

//        uploadImage(req.body.image)
//         .then((url) => {
//           if (url) {
//             const requestbody = {
//               name: req.body.Name,
//               url: url,
//               size: req.body.size
//             };
//             console.log(requestbody, "requestbody");
//             try {
//               Image.create(requestbody);
//               console.log("done")
//             } catch (error) {
//               console.log(error,"error")
//             }
//           }
          
//           res.send(url)
//        })
//        .catch((err) => res.status(500).send(err));
//     }
     
//     });

//     router.get("/getmedia",authMiddleware,async (req, res) => {
//       try {
//         const users = await Image.find();
//         res.send(users);
//     } catch (err) {
//         res.status(500).send(err);
//     }
    
//     })
//     router.delete('/getmedia/:id',authMiddleware, async (req, res) => {
//       try {
//           const image = await Image.findOneAndDelete({_id:req.params.id});
//           if (!image) {
//               return res.status(404).send({ error: 'Media not found' });
//           }
//           res.send({ statuscode: 0, Msg: "Delted successfully"});
//       } catch (err) {
//           res.status(500).send(err);
//       }
//   });

// module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Image = require("../Moduls/image");
const authMiddleware = require('../authMiddleware');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the destination directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // specify the filename
  }
});

const upload = multer({ storage: storage });

router.post("/uploadMedia", upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send({ error: "No file uploaded" });
    }
    const { name } = req.body;

    const nameAlreadyFound = await Image.findOne({ name });
    if (nameAlreadyFound) {
      return res.status(400).send({ error: "This file name already found" });
    }

    const newFile = {
      name,
      url: file.path,
      size: file.size
    };
    await Image.create(newFile);
    res.send({ url: file.path });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/getmedia", authMiddleware, async (req, res) => {
  try {
    const files = await Image.find();
    res.send(files);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/getmedia/:id', authMiddleware, async (req, res) => {
  try {
    const file = await Image.findOneAndDelete({ _id: req.params.id });
    if (!file) {
      return res.status(404).send({ error: 'Media not found' });
    }
    res.send({ statuscode: 0, Msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
