const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200 //to support old browsers as they may choke on 204 default status
}

module.exports = corsOptions;