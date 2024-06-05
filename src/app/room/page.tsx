"use client";
import RoomSettings from "@/components/roomComponents/roomSettings";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PagePage = () => {

    const params = useSearchParams().get('name');

    useEffect(() => {
        // Push to Not Found
        // if (!params) {
        //     console.log("EMPTY !");
        //     return ;
        // }
        console.log(params);
    }, [params]);

    return (
        <>
            {params && <RoomSettings name={params} /> }
        </>
    );
}

export default PagePage;