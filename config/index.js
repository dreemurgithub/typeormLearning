const express = require("express");
const configFunction = express()
const cookieParser = require("cookie-parser");
const cors = require("cors");
const useSession = require('./userSession') // session store

configFunction.use(cors({}));
configFunction.use(cookieParser());
configFunction.use(express.json());
configFunction.use(useSession)

module.exports = configFunction
