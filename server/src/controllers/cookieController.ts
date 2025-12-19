import { Request, Response, NextFunction } from 'express';

  

export const setSSIDCookie = (req: Request, res: Response, next: NextFunction) => {

    const ssid = res.locals.ssid;

    if (!ssid) return next({ log: 'No SSID to set in cookie', status: 500 });

    // Set the cookie (add { httpOnly: true, secure: true } in production for security)

    //Fixes cookie security when in production:
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('ssid', ssid, { 
        maxAge: 86400000, //Expires in 1 Day
        httpOnly: true,   // Recommended for security
        path: '/',        // CRITICAL: Makes cookie accessible on all routes
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
    }); 

return next();

};