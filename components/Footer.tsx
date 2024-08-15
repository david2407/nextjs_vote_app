import React from "react";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { SiYoutube } from "react-icons/si";
import Link from "next/link";
export default function Footer() {
	return (
		<footer className=" border-t-[0.5px] py-10 flex items-center justify-center flex-col gap-5">
			
			<h1 className="text-sm">
				&copy; 2024 Valormas, <Link href="www.valormas.gov.co" target="_blank"> www.valormas.gov.co</Link> Todos los derechos reservados.
			</h1>
		</footer>
	);
}
