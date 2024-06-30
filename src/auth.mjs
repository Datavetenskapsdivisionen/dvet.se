import { jwtVerify, SignJWT } from "jose";

const signToken = async (content) => {
    return new SignJWT(content)
        .setIssuedAt()
        .setExpirationTime("30d")
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
};

const verifyCookieOrElse = async (req, res, ok, orElse) => {
    const cookies = req.headers.cookie;
    if (!cookies) return orElse(req, res);
    const match = cookies.match(new RegExp('(^| )dv-token=([^;]+)'));
    if (!match) return orElse(req, res);
    const token = "Bearer " + match[2];
    if (!token) return orElse(req, res);

    try {
        const encodedToken = new TextEncoder().encode(token.split(" ")[1]);
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const jwt = await jwtVerify(encodedToken, encodedSecret);
        //res.status(200).json(jwt);
        return ok(req, res);
    } catch (e) {
        console.log(`failed: ${e}`);
        return orElse(req, res);
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

export { verifyToken, signToken, verifyCookieOrElse };
