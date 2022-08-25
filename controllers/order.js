const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler')

module.exports.getAll = async (req, res) =>{
    try {
        const query = {
            user: req.user.id
        }

        // проверяем дату(сортировка по дате)
        if(req.query.start){
            query.date = {
                $gte : req.query.start // больше или равно
            }
        }
        
        if(req.query.end){
            if(query.date){
                query.date = {}
            }
            query.date[`$lte`] = req.query.end
        }

        if(req.query.order) {
            query.order = +req.query.order
        }
        const orders = await Order
        .find(query)
        .sort({date : -1})
        .skip(+req.query.offset)
        .limit(+req.query.limit)

        res.status(200).json(orders)
    } catch (error) {
        errorHandler(res, error)
        console.log(error)
    }
}

module.exports.create = async (req, res) =>{
    try {
        const lastOrder = await Order.findOne({user : req.user.id}).sort({
            date : -1
        })
        const maxOrder = lastOrder ? lastOrder.order : 0
        const order = await new Order({
            list: req.body.list,
            user: req.user.id,
            order : maxOrder + 1
        }).save()
        res.status(201).json(order)
    } catch (error) {
        errorHandler(res, error)
        console.log(error)
    }
}
