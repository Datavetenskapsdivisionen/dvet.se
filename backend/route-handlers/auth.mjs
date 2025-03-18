import { jwtVerify, SignJWT } from "jose";
import { fetchUserGroups } from "./googleApi.mjs";
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
    if (!process.env.JWT_SECRET_KEY) {
        return res.status(423).json({ msg: "Google login is disabled.", disabled: true });
    }

    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
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

/**
 * A cache to store user groups information.
 * @type {Map<string, {groups: string[], last_updated: number}>}
 */
const USER_GROUPS_CACHE = new Map();

const belongsToGroups = (groups) => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ msg: "No token provided" });
            return;
        }

        const payload = await checkToken(token);
        if (payload) {
            const cache = USER_GROUPS_CACHE[payload.email];
            if (!cache || (Date.now() - cache.last_updated > 1000*60*30)) {
                USER_GROUPS_CACHE[payload.email] = { groups: await fetchUserGroups(payload.email), last_updated: Date.now() };
                const newToken = await signToken({ ...payload, userGroups: USER_GROUPS_CACHE[payload.email].groups });
                Cookies.set('dv-token', `Bearer ${newToken}`, { expires: 30 });
            }

            const userGroups = USER_GROUPS_CACHE[payload.email].groups;
            if (userGroups.some(group => groups.includes(group.email.split("@")[0]))) {
                next();
            } else {
                res.status(403).json({ msg: `This resource is only accessible by the following groups: ${groups.join(", ")}` });
            }
        } else {
            res.status(401).json({ msg: "Invalid token" });
        }
    };
};

export { verifyToken, signToken, verifyCookieOrElse, belongsToGroups };
