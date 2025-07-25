import jwt from 'jsonwebtoken'
export const generateToken = (userId) =>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn : "15m"
    })
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn : "1d"
    })
    return {accessToken, refreshToken}
}

export const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        maxAge : 15 * 60 *1000,
        httpOnly : true,
        secure : true,
        sameSite : "None"
    })
    res.cookie("refreshToken", refreshToken, {
        maxAge : 1 * 24 * 60 * 60*1000,
        httpOnly : true,
        secure : true,
        sameSite : "None"
    })
}