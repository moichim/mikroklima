import { GoogleScope } from "@/graphql/google/google";
import { Skeleton } from "@nextui-org/react";
import dynamic from "next/dynamic";

const Map = dynamic( () => import("../ui/map"), {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full rounded-lg"/>
} );

type ScopeMapProps = {
    scopes: GoogleScope[]
}

export const ScopeMap: React.FC<ScopeMapProps> = props => {

    return <Map scopes={props.scopes} height="500px" />


}