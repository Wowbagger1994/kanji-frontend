import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axiosClient from "./lib/axiosClient";
import { JWT } from "next-auth/jwt";

async function refreshToken(token: JWT): Promise<JWT> {
	const res = await axiosClient.post("/auth/refresh", null, {
		headers: {
			Authorization: "refresh " + token.refreshToken,
		},
	});

	return {
		...token,
		accessToken: res.data.accessToken,
		refreshToken: res.data.refreshToken,
	};
}

export const { auth, handlers, signIn, signOut } = NextAuth({
	pages: {
		signIn: "/",
	},
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "text",
					placeholder: "jsmith",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}
				const { email, password } = credentials;

				const res = await axiosClient.post(
					"/auth/login",
					{
						email: email,
						password: password,
					},
					{
						withCredentials: true,
						headers: {
							"Content-Type": "application/json",
						},
					}
				);
				const user = res.data;
				if (res.status === 401) {
					return null;
				}
				return user;
			},
		}),
	],
	callbacks: {
		authorized: async ({ auth }) => {
			// Logged in users are authenticated, otherwise redirect to login page
			return !!auth;
		},
		async jwt({ token, user }) {
			if (user) return { ...token, ...user };

			if (new Date().getTime() < token.expiresIn) {
				return token;
			}
			return await refreshToken(token);
		},

		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.refreshToken = token.refreshToken;
			session.user = token.user;
			return session;
		},
	},
});
