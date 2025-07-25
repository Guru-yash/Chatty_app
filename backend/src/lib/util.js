import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => 
{
    //creates a secure token
    const token = jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )

    //sends a cookie to the client’s browser with name jwt and token as value
    res.cookie("jwt",token,{
        maxAge : 7*24*60*60*1000, // converted to ms
        httpOnly: true,
        sameSite : "strict",
        secure : process.env.NODE_ENV !== "development"
    });
    
    return token;
};