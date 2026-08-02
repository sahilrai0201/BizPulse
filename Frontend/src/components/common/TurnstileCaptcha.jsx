import React, { useEffect, useRef } from "react";

/**
 * TurnstileCaptcha - A lightweight, zero-dependency Cloudflare Turnstile wrapper.
 * 
 * @param {Object} props
 * @param {function(string): void} props.onVerify - Callback fired when captcha solves successfully (receives token).
 * @param {function(): void} [props.onExpire] - Callback fired when captcha token expires.
 * @param {function(): void} [props.onError] - Callback fired when captcha encounters an error.
 */
const TurnstileCaptcha = ({ onVerify, onExpire, onError }) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);
    
    // Store latest callbacks in a ref to avoid dependency loops in useEffect
    const callbacksRef = useRef({ onVerify, onExpire, onError });
    
    useEffect(() => {
        callbacksRef.current = { onVerify, onExpire, onError };
    }, [onVerify, onExpire, onError]);

    useEffect(() => {
        let active = true;

        const initializeTurnstile = () => {
            if (!active) return;
            if (window.turnstile && containerRef.current) {
                try {
                    // Clean up existing widget if any
                    if (widgetIdRef.current) {
                        window.turnstile.remove(widgetIdRef.current);
                    }

                    // Render Turnstile widget
                    const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";
                    
                    widgetIdRef.current = window.turnstile.render(containerRef.current, {
                        sitekey: sitekey,
                        callback: (token) => {
                            if (active && callbacksRef.current.onVerify) {
                                callbacksRef.current.onVerify(token);
                            }
                        },
                        "expired-callback": () => {
                            if (active && callbacksRef.current.onExpire) {
                                callbacksRef.current.onExpire();
                            }
                        },
                        "error-callback": () => {
                            if (active && callbacksRef.current.onError) {
                                callbacksRef.current.onError();
                            }
                        },
                        theme: "dark",
                    });
                } catch (err) {
                    console.error("Failed to render Turnstile widget:", err);
                }
            }
        };

        if (window.turnstile) {
            initializeTurnstile();
        } else {
            // Check if script is already present
            let script = document.getElementById("cloudflare-turnstile-script");
            if (!script) {
                script = document.createElement("script");
                script.id = "cloudflare-turnstile-script";
                script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
                script.async = true;
                script.defer = true;
                document.body.appendChild(script);
            }

            // Poll until script loaded and window.turnstile is available
            const interval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(interval);
                    initializeTurnstile();
                }
            }, 100);

            return () => {
                clearInterval(interval);
                active = false;
                if (widgetIdRef.current && window.turnstile) {
                    try {
                        window.turnstile.remove(widgetIdRef.current);
                    } catch (e) {
                        // Ignore
                    }
                }
            };
        }

        return () => {
            active = false;
            if (widgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(widgetIdRef.current);
                } catch (e) {
                    // Ignore
                }
            }
        };
    }, []);

    return (
        <div className="flex justify-center my-4">
            <div ref={containerRef} />
        </div>
    );
};

export default TurnstileCaptcha;
