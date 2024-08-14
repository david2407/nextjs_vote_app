"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { createSupabaseBrower } from "@/lib/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { listVoters } from "@/lib/actions/vote";
export default function LoginForm() {
  const supabase = createSupabaseBrower();

  const [email, setEmail] = useState("");
  const [document, setDocument] = useState(0);

  const handleLoginWithGihub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo:
          location.origin + "/auth/callback?next=" + location.pathname,
      },
    });
  };

  const signInWithEmail = async () => {
    const { data: voters } = await listVoters();

    if (voters?.find((voter) => voter.email === email && voter.cc === document)) {
      console.log(voters?.find((voter) => voter.email === email));
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // set this to false if you do not want the user to be automatically signed up
          shouldCreateUser: true,
          emailRedirectTo: location.origin,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(
          "El link para ingresar fue enviado a su correo electronico"
        );
      }
    } else {
      toast.error(
        "El usuario no esta autorizado para votar, por favor verifique los datos ingresados"
      );
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        className="flex items-center gap-2 border p-2 rounded-md border-zinc-400 hover:border-green-500 transition-all px-8 animate-fade"
        onClick={handleLoginWithGihub}
      >
        <GitHubLogoIcon /> Login admin
      </Button>

      {/* <Button
			variant="outline"
			className="flex items-center gap-2 border p-2 rounded-md border-zinc-400 hover:border-green-500 transition-all px-8 animate-fade"
			onClick={signInWithEmail}
		>
			Login Magic link
		</Button> */}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 border p-2 rounded-md border-zinc-400 hover:border-green-500 transition-all px-8 animate-fade"
          >
            Ingresar
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="gap-2 border p-2 rounded-md border-zinc-400 hover:border-green-500 transition-all px-8 animate-fade">
          <AlertDialogHeader>
            <AlertDialogTitle>Ingrese sus datos:</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col">
                <span>Correo electronico:</span>
                <input
                  className="px-2 bg-slate-200"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span>Número de documento</span>
                <input
                className="px-2 bg-slate-200"
                  type="number"
                  onChange={(e) => setDocument(Number(e.target.value))}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-200 rounded-md p-2 m-1">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-green-600 rounded-md p-2 m-1" onClick={signInWithEmail}>
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
