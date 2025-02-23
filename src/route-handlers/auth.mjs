import { jwtVerify, SignJWT } from "jose";
import Cookies from "js-cookie";

const signToken = async (content) => {
    return new SignJWT(content)
        .setIssuedAt()
        .setExpirationTime("30d")
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
};

const verifyCookieOrElse = async (req, res, ok, orElse) => {
    const token = Cookies.get('dv-token');
    if (!token || !token.startsWith('Bearer ')) return orElse(req, res);

    try {
        const encodedToken = new TextEncoder().encode(token.split(" ")[1]);
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const jwt = await jwtVerify(encodedToken, encodedSecret);
        //res.status(200).json(jwt);
        return ok(req, res);
    } catch (e) {
        return orElse(req, res);
    }
};

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ msg: "No token provided" });
        return;
    }

    if (await checkToken(token)) {
        next();
    } else {
        console.log(e);
        res.status(401).json({ msg: "Invalid token" });
    }
};

async function checkToken(token) {
    try {
        const encodedToken = new TextEncoder().encode(token.split(" ")[1]);
        const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
        const jwt = await jwtVerify(encodedToken, encodedSecret);
        return jwt.payload;
    } catch (e) {
        return false;
    }
}

const belongsToGroups = (groups) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ msg: "No token provided" });
            return;
        }

        const payload = await checkToken(token);
        console.log(payload);
        if (payload) {
            console.log("Groups allowed", groups);
            console.log("the check", payload.userGroups.some(group => groups.includes(group.email.split("@")[0])));
            console.log("email split", groups.map(group => group.split("@")[0]));
            if (payload.userGroups.some(group => groups.includes(group.email.split("@")[0]))) {
                next();
            } else {
                res.status(403).json({ msg: `This page is only accessible by the following groups: ${groups.join(", ")}` });
            }
        }
    };
};

export { verifyToken, signToken, verifyCookieOrElse, belongsToGroups };
