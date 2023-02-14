const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });
    const { hashedPassword, _id } = await User.findOne({ _id: email },'hashedPassword _id')
    if (!_id) return res.status(401).json({ 'message': 'User not found' });
    const match = await bcrypt.compare(password, hashedPassword);
    if(match){
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": _id
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { "email": _id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        res.cookie(`jwt`, refreshToken, { 
        httpOnly: true, // access only by webServer
        sameSite: 'None', //cross-site cookie
        secure: true, //https
        maxAge: 24 * 60 * 60 * 1000 })
        res.json({ message: 'Successfully logged In',
                   data: { accessToken }
                });
    } else {
        res.status(401).json({ message: 'Password entered is incorrect' })
    }
    
}

const handleLogout = (req, res) => {
        const cookies = req.cookies
        if (!cookies?.jwt) return res.sendStatus(204) //No content
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false })
        res.json({ message: 'Logged out successfully!' })
}

const getUserInfo = async (req,res) => {
    const email = req.email
    try{
        const { firstName, lastName, address } = await User.findOne({ _id: email },'firstName lastName address').exec()
        return res.json({ data: { userInfo: { firstName, lastName, address } }})
    } catch (error) {
        console.error(error)
        return res.sendStatus(500)
    }
}

const addNewAddress = async (req, res) => {
    const data = await User.findOne({ _id: req.email })
    if(!data) return res.status(401).json({ message: 'Unauthorized' })
    if(!req.body) {
        return res.status(400).json({ message: 'Address details required' })
    }
    data.address.push(req.body)
    try {
        const result = await data.save()
        return res.json({ message: 'Address added successfully!', data: { address: result.address } })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add', error })
    }
}

const updateAddress = async (req, res) => {
    const data = await User.findOne({ _id: req.email })

    if(!data) return res.status(401).json({ message: 'Unauthorized' })
    if(!req.body) {
        return res.status(400).json({ message: 'Address details required' })
    }

    if(req.query.delivery){
        const addressId = req.query.delivery
        try {
            (await User.find({ userId: req.email})).forEach((doc) => {
                doc.address.forEach(async function updateEachAddress (option) {
                    const isDeliveryAddress = String(option._id) === addressId
                    await User.findOneAndUpdate({ userId: req.email,
                        'address._id': option._id },
                        {
                            $set: {
                                'address.$.isDeliveryAddress': isDeliveryAddress
                            }
                        })
                })
            })
            return res.json({ message: 'Address updated successfully!', data: { updatedItem: addressId } })
        } catch (error) {
            return res.status(400).json({ message: 'Failed to update', error })
        }
    }
    
    try {
        await User.findOneAndUpdate({ userId: req.email,
        'address._id': req.body._id },
        {
            $set: {
                'address.$': req.body
            }
        })
        return res.json({ message: 'Address updated successfully!', data: { updatedItem: req.body._id } })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update', error })
    }
}

const deleteAddress = async (req, res) => {
    const data = await User.findOne({ _id: req.email })

    if(!data) return res.status(401).json({ message: 'Unauthorized' })
    if(!req.body.addressId) {
        return res.status(400).json({ message: 'Address id required' })
    }
    try {
        await User.updateOne(
            { userId: req.email },
            { $pull: { address: { _id: req.body.addressId } } });
        return res.json({ message: 'Address removed successfully!', data: { removedItem: req.body.addressId } })
    } catch (error) {
        return res.status(500).json({ message: 'Failed to remove', error })
    }
}

module.exports = { 
    handleLogin,
    handleLogout, 
    getUserInfo, 
    addNewAddress, 
    updateAddress, 
    deleteAddress };