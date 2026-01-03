import jwt from 'jsonwebtoken';


export const generateToken = (userId,res)=>{
    // console.log("rs",res);
    
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    }); 
    res.cookie("jwt",token,{
        maxAge:24*60*60*1000,
        httpOnly:true,
        secure:process.env.NODE_ENV !== 'development',
        sameSite:'strict',
    })
    return token;
}