import jwt from "jsonwebtoken";

export const auth = (req,res, next) =>{

    try {
        // 1. Get token from headers
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        // 2. Format: "Bearer <token>"
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user info to request
        req.userId = decoded.userId;
        req.email = decoded.email;
        
        next();

    }catch(err){
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}