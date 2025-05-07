const jwt = require("jsonwebtoken")
exports.verifyToken = async(req, res, next) => {
    let token;
    let authheader = req.headers.Authorization ||req.headers.authorization
    if (authheader && authheader.startsWith("Bearer")) {
        token = authheader.split(" ")[1]
        if (!token) {
            return res.status(401).json({ error: "no token" })
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded
            next()
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" })
        }
    }
    else {
        return res.status(401).json({ error: "no token" })
    }
}