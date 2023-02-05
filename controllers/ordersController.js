const { ObjectId } = require('mongodb')
const Order = require('../model/Order')

const getAllOrders = async (req,res) => {
    const data = await Order.findOne({ userId: req.email }).exec()
    res.json({ message: 'Orders returned successfully!', data })
}

const createNewOrder = async (req,res) => {
    const data = await Order.findOne({ userId: req.email })

    if(!data){
        const _id = new ObjectId()
        try{     
            await Order.create ({
                userId: req.email,
                orders:[{
                            _id,
                            items : [...req.body.items],
                            amount: req.body.amount,
                            shippingAddress: {...req.body.shippingAddress},
                            billingAddress: {...req.body.billingAddress},
                            createdAt: {
                                timestamp: req.body.timestamp,
                            }
                        }]
        })
        return res.json({ message: 'Order created successfully!', data:  { addedItem: _id }})
        } catch (error) {
            return res.status(400).json({ message: 'Failed to update', error })
        }
    }
    {
        const _id = new ObjectId()
        data.orders.push({
            _id,
            items : [...req.body.items],
            amount: req.body.amount,
            shippingAddress: {...req.body.shippingAddress},
            billingAddress: {...req.body.billingAddress},
            createdAt: {
                timestamp: req.body.timestamp,
            }
        }) 
        try{
            await data.save();
            return res.json({ message: 'Order created successfully!', data:  { addedItem: _id }})
        } catch (error) {
            return res.status(400).json({ message: 'Failed to update', error })
        }
    }
}

const updateOrderStatus = async (req, res) => {
    const status = req.query.status
    if(!req.body.orderId) return res.status(400).json({ message: 'Order id required' })
    if(status === 'succeeded'){
        try{
            await Order.findOneAndUpdate({ userId: req.email,
                'orders._id': req.body.orderId },
                { $set: {
                    'orders.$.orderStatus': 'placed',
                    'orders.$.paymentStatus': status
                } })
            return res.json({ message: 'Order updated successfully!', data: { updatedItem: req.body.orderId } })
        } catch(error) {
            return res.status(400).json({ message: 'Failed to update', error })
        }  
    }
}

const getOrderDetails = async (req, res) => {
    const userId = req.email
    const orderId = req.params.orderId

    if(!userId) return res.status(401).json({ message: 'Unauthorized'})
    if(!orderId) return res.status(400).json({ message: 'Order id required' })
    
    try{
       const result = await Order.aggregate([{
        $match: {
            userId
                }
            },{
                $unwind: '$orders'
            },{
                $match: {
                    'orders._id': ObjectId(orderId)
                }
        },{ $limit: 1 }])
        return res.json({ message: 'Order returned successfully!', data: result[0] })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch', error })
    }
}

module.exports = { getAllOrders, createNewOrder, updateOrderStatus, getOrderDetails }