const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });
    const refreshToken = cookies.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err) return res.status(403).json({ message:'Forbidden' })
            
            const foundUser = await User.findOne({ _id: decoded.email })
            if(!foundUser) return res.status(401).json({ message: 'Unauthorized' })
            
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30m' }      
            )
            
            res.json({ data: { accessToken }})
        }
    )
}

module.exports = { handleRefreshToken }