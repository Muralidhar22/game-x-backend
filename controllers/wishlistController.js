const Wishlist = require('../model/Wishlist')
const Product = require('../model/Product')

const getWishlistProductDetails = async (productIds) => {
    try{
        const wishlistProductDetails = await Product.find().where('_id').in(productIds)
        return wishlistProductDetails;
    } catch(error) {
        return Promise.reject(error);
    }
}

const getAllWishlistItems = async (req,res) => {
    let data = await Wishlist.findOne({ userId: req.email })  
    if(!data) {
        return res.json({ message: 'Wishlist is empty', data })
    }
    try {
        data = await getWishlistProductDetails(data.items)
        res.json({ data })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error })
    }
}

const createWishlistItem = async (req, res) => {
    const data  = await Wishlist.findOne({ userId: req.email })
    const productId = req.body.productId
    
    if(!productId) return res.status(400).json({ message: 'productId parameter is required' })
    
    if(!data){
        try{     
            const result = await Wishlist.create ({
            "items" : [productId],
            "userId": `${req.email}`
        })
        const data = await getWishlistProductDetails(result.items)
        return res.status(201).json({ message: 'Item created successfully!', data: { addedItem: data[0] } })
        } catch (err) {
            return res.status(400).json({ message: 'Failed to update', error: err })
        }
    }
    data.items.push(productId)
    try{
        await data.save();
        const newProductDetails = await getWishlistProductDetails([productId])
        return res.status(200).json({ message: 'Item added successfully!',data: { addedItem: newProductDetails[0]} });
    } catch (err) {
        return res.status(400).json({ message: 'Failed to update', error: err })
    }
}

const removeWishlistItem = async (req,res) => {
    const data  = await Wishlist.findOne({ userId: req.email })
    const productId = req.body.productId
    const newWishlistItems = data.items.filter(id => id !== productId)
    data.items = [...newWishlistItems]
    try{
        await data.save();
        return res.json({ message: 'Item removed successfully!', data: { removedItem: productId } });
    } catch (err) {
        return res.status(400).json({ message: 'Failed to update', error: err })
    }
}
/*
const getWishlistCount = async (req, res) => {
    const data  = await Wishlist.findOne({ userId: req.email })
    if(!data){
        return res.json({ count: null })
    }
    return res.json({ count: data.items.length })
}*/

module.exports = { getAllWishlistItems, createWishlistItem, removeWishlistItem }