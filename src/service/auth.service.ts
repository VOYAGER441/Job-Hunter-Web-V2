import { account } from "./appwrite.service";
import axios from "axios";
import * as env from "@/env";
import { IJWTResponse } from "@/interface/response/auth.response";

export enum authProvider {
    GOOGLE = "google",
}

class AuthService {
    // ###############################################################
    // Public Methods
    // ###############################################################

    /**
     * Initiates the login process. For GOOGLE, it redirects the browser to the backend-provided login URL.
     */
    async login(provider: authProvider) {
        try {
            if (provider === authProvider.GOOGLE) {
                const origin = typeof window !== 'undefined' ? window.location.origin : '';
                if (!origin) throw new Error("Origin not available");

                // Send the correct callback URL (including /oauth/success)
                const callbackUri = `${origin}/oauth/success`;

                // 1. Get the login URL from backend
                const { url } = await this._getGoogleLoginURL(callbackUri);

                // 2. Redirect the user to the Google login page
                window.location.href = url;
            } else {
                throw new Error(`Unsupported provider: ${provider}`);
            }
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    }

    /**
     * Handles the OAuth callback. 
     * Expected URL format: http://.../?secret=...&userId=...
     */
    async handleOAuthCallback() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const secret = urlParams.get('secret');
            const userId = urlParams.get('userId');

            if (!secret || !userId) {
                throw new Error('Failed to parse secret or userId from callback URL');
            }

            // 3. Create the session in Appwrite (Client side)
            await this._createSession(userId, secret);

            // 4. Generate a JWT from Appwrite
            const jwt = await account.createJWT();

            // 5. Verify the Appwrite JWT with the backend to get the final Access/Refresh tokens
            const jwtFromBackend = await this._verifyJWTAndGetNewJWT(jwt.jwt);

            if (!jwtFromBackend) {
                throw new Error("Failed to get JWT from Backend");
            }

            // 6. Store tokens in localStorage
            this._storeTokens(jwtFromBackend);

            return jwtFromBackend;
        } catch (error) {
            console.error("OAuth Callback Error:", error);
            throw error;
        }
    }

    // ###############################################################
    // Private Methods
    // ###############################################################

    private async _getGoogleLoginURL(redirectUri: string): Promise<{ url: string }> {
        try {
            const url = `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/v2/auth/googleLogin`;
            const result = await axios.get(url, {
                params: { redirectUri }
            });
            return result.data;
        } catch (error) {
            console.error("Google Login URL Error:", error);
            throw error;
        }
    }

    private async _verifyJWTAndGetNewJWT(jwtFromAppwrite: string): Promise<IJWTResponse> {
        try {
            const encodedJWT = encodeURIComponent(jwtFromAppwrite);
            const url = `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/v2/auth/jwtVerify/${encodedJWT}`;
            const result = await axios.post(url);
            return result.data as IJWTResponse;
        } catch (error) {
            console.error("JWT Verify Error:", error);
            throw error;
        }
    }

    private async _createSession(userId: string, secret: string): Promise<void> {
        try {
            await account.createSession(userId, secret);
        } catch (error: any) {
            const message = error?.message || "";
            if (typeof message === "string" && message.includes("session is active")) {
                await account.deleteSession("current");
                await account.createSession(userId, secret);
            } else {
                throw error;
            }
        }
    }

    private _storeTokens(tokens: IJWTResponse) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    }

    async logout() {
        try {
            console.log("Logout initiated");
            
            await account.deleteSession("current");
        } catch (error) {
            console.warn("Appwrite session deletion failed (likely already invalid):", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
    }
}

const authService = new AuthService();
export default authService;
