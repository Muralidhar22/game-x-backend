const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if(!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'registration failed due to incomplete data.' })
    
    const duplicate = await User.findOne({ _id: email }).exec();
    if(duplicate) return res.status(409).json({ message: `"${email}" is already in use.` });
    
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            "_id": email,
            "firstName": firstName,
            "lastName": lastName,
            "hashedPassword": hashedPassword
        })
         res.status(201).json({ message: `New user ${firstName} ${lastName} created`})
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { handleNewUser }