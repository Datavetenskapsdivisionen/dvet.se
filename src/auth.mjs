import { jwtVerify, SignJWT } from "jose";

const signToken = async (content) => {
    return new SignJWT(content)
        .setIssuedAt()
        .setExpirationTime("30d")
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
};

const verifyCookie = async (cookies) => {
    const err = { error: "invalid token" };
    if (!cookies) return err;
    const match = cookies.match(new RegExp('(^| )dv-token=([^;]+)'));
    if (!match) return err;
    const token = "Bearer " + match[2];
    if (!token) return err;

    try {
        const encodedToken = new TextEncoder().encode(token.split(" ")[1]);
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const jwt = await jwtVerify(encodedToken, encodedSecret);
        //res.status(200).json(jwt);
        return jwt;
    } catch (e) {
        return err;
    }
};

const verifyCookieOrElse = async (req, res, ok, orElse) => {
    let r = await verifyCookie(req.headers.cookie);

    if (r.error) {
        return orElse(req, res);
    } else {
        return ok(req, res);
    }
};

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ msg: "No token provided" });
        return;
    }

    try {
        const encodedToken = new TextEncoder().encode(token.split(" ")[1]);
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const jwt = await jwtVerify(encodedToken, encodedSecret);
        //res.status(200).json(jwt);
        next();
    } catch (e) {
        console.log(e);
        res.status(401).json({ msg: "Invalid token" });
    }
};

export { verifyToken, signToken, verifyCookieOrElse, verifyCookie };
