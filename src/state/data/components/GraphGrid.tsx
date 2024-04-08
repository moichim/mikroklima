"use client";

import { Toolbar } from "@/components/toolbar/toolbar";
import { GoogleScope } from "@/graphql/google/google";
import { useDataContextInternal } from "../context/useDataContextInternal";
import { GraphInstance } from "./graphInstance/graphInstance";
import { SelectionBar } from "@/state/time/components/selectionBar";

type GraphGridProps = {
    scope: GoogleScope,
    fixedTime?: { from: number, to: number },
    hasZoom?: boolean
}

export const GraphGrid: React.FC<GraphGridProps> = ({
    hasZoom = true,
    ...props
}) => {

    const context = useDataContextInternal(props.scope, props.fixedTime);

    return <div className="relative">
        
        <div className="pl-4 pt-4 fixed bottom-4" style={{ width: "4rem" }}>
            <Toolbar hasZoom={hasZoom}/>
        </div>

        <div className=" top-0 w-full pt-4">
            {
                context.instances.map(instance => {
                    return <GraphInstance
                        {...instance}
                        key={instance.state.property.slug}
                    />
                })}
        </div>

        <SelectionBar hasZoom={hasZoom}/>

    </div>
}