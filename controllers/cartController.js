const { ObjectId } = require('mongodb');
const Cart = require('../model/Cart');
const Product = require('../model/Product');

const getPopulatedCartItemDetails = async (userId, productId ) => {
    const result = await Cart.aggregate([{
        $match: {
            userId
        }
    },{
        $unwind: '$items'
    },{
        $match: {
            'items.product': ObjectId(productId)
        }
    },{ $limit: 1 }])
    await Product.populate(result,{ path: 'items.product' })
    return result;
}

const getCartItems = async (req,res) => {
    const data = await Cart.findOne({ userId: req.email }).populate('items.product')
    if(!data) {
        return res.json({ message: 'Cart is Empty', data })
    }
    res.json({ data });
}

const addCartItem = async (req,res) => {
    const data = await Cart.findOne({ userId: req.email })
    const productId = req.body.productId
    if(!productId) return res.status(400).json({ message: 'productId parameter is required' })
    
    if(!data){
        try{     
            await Cart.create ({
            "items" : [{product: productId, count: 1}],
            "userId": `${req.email}`
        })
        const result = await getPopulatedCartItemDetails(req.email, productId)
        return res.status(201).json({ message: 'Item created successfully!', data: { addedItem: result[0].items } })
    } catch (err) {
        return res.status(400).json({ message: 'Failed to update', error: err })
    }
}
data.items.push({product: productId, count: 1})
try{
        await data.save();
        const result = await getPopulatedCartItemDetails(req.email, productId)
        return res.status(200).json({ message: 'Item added successfully!', data: { addedItem: result[0].items } });
    } catch (err) {
        return res.status(400).json({ message: 'Failed to update', error: err })
    }
}

const updateCartItem = async (req,res) => {
    const data = await Cart.findOne({ userId: req.email })
    const cartItemId = req.body._id
    const count = req.body.count
    if(!cartItemId) return res.status(400).json({ 'message': 'cartItemId parameter is required' })

    try{
        if(data){
         await Cart.findOneAndUpdate({ userId: req.email,
        'items._id': cartItemId },
        { $set: {
            'items.$.count': count
        } })
        }
        return res.status(200).json({ message: 'Item updated successfully!', data: { updatedItem: cartItemId } });
    } catch (err) {
        return res.status(400).json({ message: 'Failed to update', error: err })
    }
}

const deleteCartItem = async (req,res) => {
    const data = await Cart.findOne({ userId: req.email },{})
    const cartItemId = req.body.cartItemId
    if(!cartItemId) return res.status(400).json({ message: 'cartItemId parameter is required' })
    if(data){
        try{
            await Cart.updateOne(
                { userId: req.email },
                { $pull: { items: { _id: cartItemId } } });
            return res.status(200).json({ message: 'Item removed successfully!', data: { removedItem: cartItemId } });
        } catch (err) {
            return res.status(400).json({ message: 'Failed to update', error: err })
        }
    }
}

const deleteCartList = async (req, res) => {
    const userId = req.email
    if(!userId) return res.status(401).json({ message: 'Unauthorized' })
    try{
        const result = await Cart.findOneAndDelete({ userId })
        return res.json({ message: 'Item deleted successfully', data: result[0] })
    } catch(error) {
        return res.status(500).json({ message: 'Operation failed', error })
    }
}

module.exports = { getCartItems, updateCartItem, deleteCartItem, addCartItem, deleteCartList }