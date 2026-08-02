/**
 * Verifies a Cloudflare Turnstile captcha token.
 * 
 * @param {string} token - The token received from the frontend widget.
 * @param {string} [ip] - The client's IP address (optional).
 * @returns {Promise<boolean>} True if the token is valid, false otherwise.
 */
export const verifyTurnstile = async (token, ip) => {
    if (!token) {
        return false;
    }

    // Default to Cloudflare's "Always passes" testing secret key if none is set in env
    const secretKey = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

    try {
        const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: token,
                remoteip: ip || "",
            }).toString(),
        });

        const data = await response.json();
        return !!data.success;
    } catch (error) {
        console.error("Turnstile verification error:", error);
        return false;
    }
};
