import { getAuth } from "@clerk/express"
import { sql } from '../config/db.js'

export const protect = async (req, res, next) => {
    const auth = getAuth(req);
    const userId = auth?.userId || req.auth?.userId;

    if (!userId) {
        return res.status(401).json({ error: "Not authorized, authentication required" });
    }

    const claims = auth?.sessionClaims || req.auth?.sessionClaims || {};
    const fallbackUserName = claims.full_name || claims.name || "User";
    const fallbackEmail = claims.email || `${userId}@clerk.local`;
    const fallbackImage = claims.image || "";

    await sql`
        INSERT INTO users (id, name, email, image, plan)
        VALUES (${userId}, ${fallbackUserName}, ${fallbackEmail}, ${fallbackImage}, 'free')
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = COALESCE(NULLIF(EXCLUDED.email, ''), users.email),
            image = EXCLUDED.image,
            updated_at = NOW()
    `;

    const userActivePlan = typeof auth?.has === "function" && auth.has({ plan: "premium" }) ? "premium" : "free";
    const users = await sql`SELECT name, plan FROM users WHERE id = ${userId}`;
    const user = users[0];

    if (!user) {
        return res.status(500).json({ error: "User profile could not be loaded." });
    }

    req.user = { id: userId };

    if (userActivePlan !== user.plan) {
        await sql`UPDATE users SET plan = ${userActivePlan} WHERE id = ${userId}`;
    }

    next();
}