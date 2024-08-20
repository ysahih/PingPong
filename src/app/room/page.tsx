"use client";
import RoomSettings from "@/components/roomComponents/roomSettings";
import { useRouter, useSearchParams } from "next/navigation";

const PagePage = () => {

    const params = useSearchParams().get('id');
    const router = useRouter();

    if (!params)
        router.replace('/404');

    return (
        <>
            {params && <RoomSettings id={params} /> }
        </>
    );
}

export default PagePage;