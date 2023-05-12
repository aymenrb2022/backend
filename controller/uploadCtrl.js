const fs = require('fs');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../utils/cloudinary');

const uploadImages = async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newpath = await uploader(path);
      urls.push(newpath);
      fs.unlinkSync(path);
    }
   const  images= urls.map((file) => {
          return file;
        });
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to upload images" });
  }
};

const deleteImages = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await cloudinaryDeleteImg(id,'images');
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { uploadImages, deleteImages };
