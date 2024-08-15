"use client";
import { createSupabaseBrower } from "@/lib/supabase/client";
import { cn, getHightValueObjectKey } from "@/lib/utils";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { useGetVote } from "@/lib/hook";
import VoteLoading from "./VoteLoading";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import MyImage from "./MyImage";

export default function ClasicVote({ id }: { id: string }) {
  const supabase = createSupabaseBrower();
  const queryClient = useQueryClient();
  const { data, isFetching } = useGetVote(id);
  const router = useRouter()

  useEffect(() => {
    const channel = supabase
      .channel("vote" + id)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "vote_options",
          filter: "vote_id=eq." + id,
        },
        (payload) => {
          queryClient.setQueryData(["vote-" + id], (currentVote: any) => ({
            ...currentVote,
            voteOptions: payload.new.options,
          }));
        }
      )
      .subscribe();
    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  const totalVote = useMemo(() => {
    if (data?.voteOptions) {
      return Object.values(data.voteOptions).reduce(
        (acc, value) => acc + value,
        0
      );
    }
  }, [data?.voteOptions]);
  const highestKey = useMemo(() => {
    if (data?.voteOptions) {
      return getHightValueObjectKey(data?.voteOptions);
    }
  }, [data?.voteOptions]);

  if (isFetching && !data) {
    return <VoteLoading />;
  }

  if (!data) {
    return redirect("/");
  }

  const { voteLog, voteOptions, isExpired } = data;

  const rpcUpdateVote = async (option: string) => {
    let { error } = await supabase.rpc("update_vote", {
      update_id: id,
      option,
    });
    if (error) {
      throw "Fail to update vote";
    } else {
      queryClient.invalidateQueries({ queryKey: ["vote-" + id] });
    }
  };

  const castVote = async (option: string) => {
    if (voteLog) {
      return null;
    }
    if (isExpired) {
      return toast.error("La votacion esta terminada");
    } else {
      toast.promise(rpcUpdateVote(option), {
        loading: "Votando por " + option,
        success: "Voto exitoso por " + option.split(",")[1],
        error: "Error el votar por " + option,
      });
	  router.push("/")
    }
  };

  return (
    <div className="space-y-10">
      <div>
        {Object.keys(voteOptions).sort( (a,b) => Number(a.split(",")[0]) - Number(b.split(",")[0])).map((key, index) => {
          const percentage = Math.round(
            (voteOptions[key as keyof typeof voteOptions] * 100) / totalVote!
          );
          const array = key.split(",");
		  const num = array[0];
          const name = array[1];
          const cargo = array[2];
          const institution = array[3];
          const municipio = array[4];

		  console.log("/candidatos/" + num + " - " + name?.toUpperCase() + ".png")

          return (
            <div
              key={index}
              className="flex items-center w-full group cursor-pointer py-1"
              onClick={() => castVote(key)}
            >
				<MyImage src={"/candidatos/" + num + " -" + name?.toUpperCase() + ".png"} alt="profile" width={90} height={90} />
            {/*   <Image
                src={"/candidatos/" + key.split(" ").join("-") + ".png" || "/default.jpeg"}
                alt={"profile"}
                width={90}
                height={90}
                className={cn(" rounded-full ring-2")}
              /> */}

              <div className="py-2">
			  <h1 className=" w-100 line-clamp-2 px-4   text-lg break-words select-none ">
                  {/* {highestKey === key ? key + "🎉" : key} */}
				  <span className="font-bold">N° </span> {num}
                </h1>
                <h1 className=" w-100 line-clamp-2 px-4   text-lg break-words select-none ">
                  {/* {highestKey === key ? key + "🎉" : key} */}
				  <span className="font-bold">Nombre:</span> {name}
                </h1>
				<h1 className=" w-100 line-clamp-2 px-4   text-lg break-words select-none ">
                  {/* {highestKey === key ? key + "🎉" : key} */}
				  <span className="font-bold">Cargo:</span> {cargo}
                </h1>
				<h1 className=" w-100 line-clamp-2 px-4   text-lg break-words select-none ">
                  {/* {highestKey === key ? key + "🎉" : key} */}
				  <span className="font-bold">Institución educativa:</span> {institution}
                </h1>
				<h1 className=" w-100 line-clamp-2 px-4   text-lg break-words select-none ">
                  {/* {highestKey === key ? key + "🎉" : key} */}
				  <span className="font-bold">Municipio:</span> {municipio}
                </h1>
              </div>

              <div className="flex-1 flex items-center gap-2">
                <div className="py-3 pr-5 border-l border-zinc-400 flex-1 ">
                  <div
                    className={cn(
                      "h-16 border-y border-r rounded-e-xl relative transition-all group-hover:border-zinc-400",
                      {
                        "bg-green-600": voteLog?.option === key,
                      }
                    )}
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {voteLog && (
        <div className="flex items-center gap-2 text-gray-400">
          <InfoCircledIcon />
          <h1 className="text-lg ">
            Tu voto fue para{" "}
            <span className="text-green-600 font-bold">{voteLog?.option.split(",")[1]}</span>{" "}
            on {new Date(voteLog?.created_at!).toDateString()}{" "}
            {new Date(voteLog?.created_at!).toLocaleTimeString()}
          </h1>
        </div>
      )}
    </div>
  );
}
