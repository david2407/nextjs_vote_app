"use client";
import { RocketIcon } from "@radix-ui/react-icons";
import React from "react";
import Link from "next/link";
import Profile from "./Profile";
import LoginForm from "./LoginForm";
import { useUser } from "@/lib/hook";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Navbar() {
  const searchParams = useSearchParams()
  const admin = searchParams.get('admin') === "true";

  return (
    <nav className="flex items-center justify-between ">
      <Link href="/" className="flex items-center gap-2">
        
          <h1 className="text-3xl font-bold text-green-600">
            Votaciones Seduca{" "}
          </h1>
         
       
        {/* <RocketIcon className="w-5 h-5  animate-lanuch transition-all transform text-green-600" /> */}
      </Link>
      <Image
            src="/escudo-antioquia.svg"
            alt={"profile"}
            width={300}
            height={300}
            className=""
          />
      <RenderProfile isAdmin={admin} />
    </nav>
  );
}

const RenderProfile = ( {isAdmin}: {isAdmin: boolean}) => {
  const { data, isFetching } = useUser();

  if (isFetching) {
    return <></>;
  }

  if (data?.user?.id) {
    return <Profile user={data?.user} />;
  } else {
    return <LoginForm isAdmin={isAdmin} />;
  }
};
