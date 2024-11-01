import Providers from "@/components/ui/providers";

import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { UserNav } from "@/components/ui/user-nav";

let title = "Next.js + Postgres Auth Starter";
let description =
	"This is a Next.js starter kit that uses NextAuth.js for simple email + password login and a Postgres database to persist the data.";

export const metadata = {
	title,
	description,
	twitter: {
		card: "summary_large_image",
		title,
		description,
	},
	metadataBase: new URL("https://nextjs-postgres-auth.vercel.app"),
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={GeistSans.variable}>
				<Providers>
					<div className="border-b">
						<div className="flex h-16 items-center px-4">
							<div className="ml-auto flex items-center space-x-4">
								<UserNav />
							</div>
						</div>
					</div>
					{children}
				</Providers>
			</body>
		</html>
	);
}
