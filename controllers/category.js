const Category = require('../models/Category');
const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async (req, res) =>{
   try {
    const categories = await Category.find({user : req.user.id})
    res.status(200).json(categories)
   } catch (error) {
    errorHandler(res, error)
    console.log(error)
   }
}

module.exports.getById = async (req, res) =>{
    try {
        const {id} = req.params
        const category = await Category.findById({_id : id})
        res.status(200).json(category)
    } catch (error) {
     errorHandler(res, error)
     console.log(error)
    }
}

module.exports.remove = async (req, res) =>{
    try {
        const {id} = req.params
        await Category.remove({_id : id});
        await Position.remove({category : id});
        res.status(200).json({
            message : "Категория была удалена."
        });
    } catch (error) {
     errorHandler(res, error);
     console.log(error);
    }
}

module.exports.create = async (req, res) =>{
    try {
        console.log(req.file)
        const {name} = req.body;
        const category = await new Category({
            name : name,
            user : req.user.id,
            imgSrc : req.file ? req.file.path : ''
        })
        await category.save()
        res.status(201).json(category)
    } catch (error) {
     errorHandler(res, error)
     console.log(error)
    }
}

module.exports.update = async (req, res) =>{
    try {
        const {id} = req.params
        const updated = {
            name : req.body.name
        }
        if(req.file) {
            updated.imgSrc = req.file.path
        }
        const category = await Category.findOneAndUpdate(
            {_id : id },
            {$set : updated},
            {new : true}
        );
        res.status(200).json(category)
    } catch (error) {
     errorHandler(res, error)
     console.log(error)
    }
}