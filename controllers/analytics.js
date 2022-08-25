const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async (req, res) =>{
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date : 1});
        const ordersMap = getOrdersMap(allOrders)
        //Вчерашние заказы
        const yesterdayOrders = ordersMap[moment().add(-1,'d').format('DD.MM.YYYY')] || []
        const yesterdayOrdersNumbers = yesterdayOrders.length
        // Количество заказов
        const totalOrdersNumber = allOrders.length
        //Количество дней
        const daysNumbers = Object.keys(ordersMap).length
        //Заказов в день
        const ordersPerDay = (totalOrdersNumber/daysNumbers).toFixed(0)
        //Процент количества заказов
        const orderPercent =(((yesterdayOrdersNumbers/ordersPerDay) - 1) * 100).toFixed(2)
        //Общая выручка
        const totalGain = calculatePrice(allOrders)
        //Выручка в день
        const gainPerDay = totalGain/daysNumbers
        //Выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        //Процент выручки
        const gainPercent = (((yesterdayGain/gainPerDay) - 1) * 100).toFixed(2)
        //Сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        //Сравнение заказов
        const compareNumber = (yesterdayOrdersNumbers - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain : {
                percent : Math.abs(+gainPercent),
                compare : Math.abs(+compareGain),
                yesterday : +yesterdayGain,
                isHigher : +gainPercent > 0
            },
            orders : {
                percent : Math.abs(+orderPercent),
                compare : Math.abs(+compareNumber),
                yesterday : +yesterdayOrdersNumbers,
                isHigher : +orderPercent > 0
            }
        })
    } catch (error) {
        errorHandler(res, error)
    }
}

module.exports.analytics = async (req, res) =>{
    try {
        const allOrders = await Order.find({user : req.user.id}).sort({date : 1})
        const ordersMap = getOrdersMap(allOrders);
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);
        const chart = Object.keys(ordersMap).map(label =>{
            //label == 25.08.2022
            const gain = calculatePrice(ordersMap[label])
            const order = ordersMap[label]
            return {label, order, gain}
        })
        res.status(200).json({average, chart})
    } catch (error) {
        errorHandler(res,error);
        console.log(error)
    }
}

function getOrdersMap(orders = []){
    const dayOrders = {}
    orders.forEach(order =>{
        const date = moment(order.date).format('DD.MM.YYYY')
        if(date === moment().format('DD.MM.YYYY')){
            return
        }
        if(!dayOrders[date]){
            dayOrders[date] = []
        }

        dayOrders[date].push(order)
    })
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderCost = order.list.reduce((orderTotal, item) =>{
            return orderTotal += item.cost * item.quantity
        },0)
        return total += orderCost
    }, 0)
}