const Position = require('../models/Position')
const errorHandler = require('../utils/errorHandler')

module.exports.getByCategoryId = async (req, res) =>{
    try {
        const {categoryId} = req.params
        const positions = await Position.find({
            category : categoryId,
            user : req.user.id
        })
        res.status(200).json(positions)
    } catch (error) {
        console.log(error)
        errorHandler(res,error)
    }
}

module.exports.create = async (req, res) =>{
    try {
        const {name, cost,category } = req.body
        const position = await new Position({
            name : name,
            cost : cost,
            category : category,
            user : req.user.id
        }).save()
        res.status(201).json(position)
    } catch (error) {
        console.log(error)
        errorHandler(res,error)
    }
}

module.exports.remove = async (req, res) =>{
    try {
        const {id} = req.params
        await Position.remove({_id : id})
        res.status(200).json({
            message : 'Позиция была удалена.'
        })
    } catch (error) {
        console.log(error)
        errorHandler(res,error)
    }
}

module.exports.update = async (req, res) =>{
    try {
        const {id} = req.params
        const position = await Position.findOneAndUpdate(
            {_id : id},
            {$set : req.body},
            {new : true}
        )
        res.status(200).json(position)
    } catch (error) {
        console.log(error)
        errorHandler(res,error)
    }
}