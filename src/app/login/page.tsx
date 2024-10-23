import Link from "next/link";
import { Form } from "./form";
import { SubmitButton } from "src/app/submit-button";
import { redirect } from "next/navigation";
import axios from "axios";

export default function Login() {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-gray-50">
			<div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
				<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
					<h3 className="text-xl font-semibold text-gray-500">
						Sign In
					</h3>
					<p className="text-sm text-gray-500">
						Use your email and password to sign in
					</p>
				</div>
				<Form
					action={async (formData: FormData) => {
						"use server";
						let res: any;
						try {
							let formdata = new FormData();

							formdata.append(
								"email",
								formData.get("email") as string
							);
							formdata.append(
								"password",
								formData.get("password") as string
							);
							res = await axios.post(
								process.env.FRONTEND_PROXY + "/api/login",
								formdata
							);
						} catch (e) {
							console.error(e);
						}
						if (res.data.success) redirect("/kanji");
						else {
							redirect("/login");
						}
					}}
				>
					<SubmitButton>Sign in</SubmitButton>
					<p className="text-center text-sm text-gray-600">
						{"Don't have an account? "}
						<Link
							href="/register"
							className="font-semibold text-gray-800"
						>
							Sign up
						</Link>
						{" for free."}
					</p>
				</Form>
			</div>
		</div>
	);
}
