//@ts-nocheck

import jwt from 'jsonwebtoken';
import { TUser } from '../../model/types/user/user';



// Usually I keep the token between 5 minutes - 15 minutes
function generateAccessToken(user: TUser) {
    return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET);
}

// I choosed 8h because i prefer to make the user login again each day.
// But keep him logged in if he is using the app.
// You can change this value depending on your app logic.
// I would go for a maximum of 7 days, and make him login again after 7 days of inactivity.
function generateRefreshToken(user: TUser, jti: string) {
    return jwt.sign({
        userId: user.id,
        jti
    }, process.env.JWT_REFRESH_SECRET);
}

function generateTokens(user: TUser, jti: string): { accessToken: string, refreshToken: string }{
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
}

export  {
    generateAccessToken,
    generateRefreshToken,
    generateTokens
};



