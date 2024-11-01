"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import axiosClient from "@/lib/axiosClient";
import axios from "axios";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isLogin, setIsLogin] = React.useState<boolean>(true);

	const credentialsAction = (formData: FormData) => {
		signIn("credentials", {
			email: formData.get("email"),
			password: formData.get("password"),
			redirectTo: "/kanji",
		})
			.then(() => {
				setIsLoading(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	async function registerAction(formData: FormData) {
		let name = formData.get("name") as string;
		let email = formData.get("email") as string;
		let password = formData.get("password") as string;
		let passwordConfirm = formData.get("passwordConfirm") as string;
		console.log(process.env.BACKEND_URL);
		await axios
			.post("http://localhost:8080/users ", {
				name: name,
				email: email,
				password: password,
				passwordConfirm: passwordConfirm,
			})
			.then(() => {
				setIsLoading(true);
			})
			.finally(() => {
				setIsLoading(false);
				setIsLogin(true);
			});
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
			{isLogin ? (
				<form action={credentialsAction}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="email"
								placeholder="name@example.com"
								type="email"
								name="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								required
								disabled={isLoading}
							/>
							<Label className="sr-only" htmlFor="password">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								name="password"
								placeholder="Password"
								autoCorrect="off"
								required
								disabled={isLoading}
							/>
						</div>
						<Button disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Sign In
						</Button>
					</div>
				</form>
			) : (
				<form action={registerAction}>
					<div className="grid gap-2">
						<div className="grid gap-1">
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="name"
								name="name"
								type="name"
								placeholder="Name"
								autoComplete="name"
								required
								disabled={isLoading}
							/>
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="email"
								placeholder="name@example.com"
								type="email"
								name="email"
								autoCapitalize="none"
								autoComplete="email"
								autoCorrect="off"
								required
								disabled={isLoading}
							/>
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Password"
								required
								disabled={isLoading}
							/>
							<Label className="sr-only" htmlFor="email">
								Email
							</Label>
							<Input
								id="passwordConfirm"
								name="passwordConfirm"
								type="password"
								placeholder="Confirm Password"
								required
								disabled={isLoading}
							/>
						</div>
						<Button disabled={isLoading}>
							{isLoading && (
								<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
							)}
							Register
						</Button>
					</div>
				</form>
			)}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<Button variant="outline" type="button" disabled={isLoading}>
				{isLoading ? (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.gitHub className="mr-2 h-4 w-4" />
				)}{" "}
				GitHub
			</Button>
			<Button
				variant="ghost"
				onClick={() => setIsLogin(!isLogin)}
				// className={cn("absolute  md:right-8 md:top-8")}
			>
				{isLogin
					? "Create an account"
					: "Already have an account? Sign In"}
			</Button>
		</div>
	);
}
