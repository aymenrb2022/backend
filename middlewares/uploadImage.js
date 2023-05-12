const multer = require ('multer');
const sharp = require('sharp');
const path = require ('path');

const multerstorage = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.join(__dirname,"../public/images/products"));
    },
    filename:function(req,file,cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null,file.fieldname + "-" + uniqueSuffix + ".jpg");
    },
});

const multerFilter = (req,file,cb) => {
    if (file.mimetype.startsWith('image')){
        cb(null,true)
    } else {
        cb({
            message : "Unsupported file format",
        },
        false
        );
    }
};

const uploadPhoto = multer ({
    storage :multerstorage,
    fileFilter: multerFilter,
    limits: {fieldSize: 2000000},
})

const productImgResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            const fileName = `product-${Date.now()}.jpg`;
            await sharp(file.path)
            .resize(200, 200)
            .toFormat("jpg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/products/${fileName}`);

        })
    );
    next();
};


module.exports = {uploadPhoto,productImgResize};