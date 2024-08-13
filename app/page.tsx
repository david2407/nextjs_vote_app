import ListVote from "@/components/ListVote";
import ListVoteLoading from "@/components/ListVoteLoading";
import { listActiveVotes, listExpiredVotes } from "@/lib/actions/vote";
import React, { Suspense } from "react";

export default async function Page() {
	return (
		<div className=" space-y-10">
			<h1 className="text-2xl font-bold text-green-600">
				Votaciones Activas 
			</h1>
			<Suspense fallback={<ListVoteLoading />}>
				<ActiveVote />
			</Suspense>
			<h1 className="text-2xl font-bold text-green-600">Votaciones Cerradas </h1>
			<Suspense fallback={<ListVoteLoading />}>
				<ExpiredVote />
			</Suspense>
		</div>
	);
}

const ActiveVote = async () => {
	const { data: votes } = await listActiveVotes();
	if (!votes?.length) {
		return <h1 className="text-black">No existen votaciones 😅</h1>;
	}
	return <ListVote votes={votes} />;
};

const ExpiredVote = async () => {
	const { data: votes } = await listExpiredVotes();

	if (!votes?.length) {
		return <h1 className="text-black">No existen votaciones 😅</h1>;
	}
	return <ListVote votes={votes} isExpire={true} />;
};
