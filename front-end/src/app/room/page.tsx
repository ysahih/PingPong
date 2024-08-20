"use client";
import RoomSettings from "@/components/roomComponents/roomSettings";
import { useRouter, useSearchParams } from "next/navigation";

const PagePage = () => {

    const router = useRouter();
    const params = useSearchParams().get('id');
    if (!params)
        router.replace('/404');

    return (
        <>
            {params && <RoomSettings id={params} /> }
        </>
    );
}

export default PagePage;