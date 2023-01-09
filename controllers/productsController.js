const Product = require('../model/Product');


const getAllProducts = async (req, res) => {
    try {
        const data =  await Product.find({}).exec()
        return res.send({ data })
    } catch (error) {
        return res.status(400).json({ message: 'Failed to fetch', error })
    }
}

const getProduct = async (req, res) => {
    try{
        const data = await Product.findById(req.params.productId)
        return res.json({ data });
    } catch (error) {
        return res.status(400).json({ message: 'Failed to fetch', error })
    }
}

module.exports = { getAllProducts, getProduct }