"use client";

import { Toolbar } from "@/modules/graph/components/toolbar/toolbar";
import { GoogleScope } from "@/graphql/google/google";
import { useDataContextInternal } from "../context/useDataContextInternal";
import { GraphInstance } from "./instance/graphInstance";
import { TimeSelectionBar } from "@/modules/time/components/timeSelectionBar";
import { useTimeContext } from "@/modules/time/timeContext";

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

    const {timeState, timeDispatch} = useTimeContext();

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

        <TimeSelectionBar hasZoom={hasZoom} state={timeState} dispatch={timeDispatch}/>

    </div>
}