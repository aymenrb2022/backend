const Category = require ('../models/categorieModel');
const validateMongoDBId = require('../utils/validateMongodbId');

const createCategory = (async (req,res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategory = (async (req,res) => {
    const {id}= req.params;
    validateMongoDBId(id);
    try {
        const updatecategory = await Category.findByIdAndUpdate(id ,req.body ,{
            new:true,
        });
        res.json(updatecategory);
    } catch (error) {
        throw new Error(error);
    }
});
const deleteCategory = (async (req,res) => {
    const {id}= req.params;
    validateMongoDBId(id);
    try {
        const deletecategory = await Category.findByIdAndDelete(id);
        res.json(deletecategory);
    } catch (error) {
        throw new Error(error);
    }
});
const getCategory = (async (req,res) => {
    const {id}= req.params;
    validateMongoDBId(id);
    try {
        const getcategory = await Category.findById(id);
        res.json(getcategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getallCategory = (async (req,res) => {
    try {
        const getallcategory = await Category.find();
        res.json(getallcategory);
    } catch (error) {
        throw new Error(error);
    }
});



module.exports = {createCategory,updateCategory,deleteCategory,getCategory,getallCategory};