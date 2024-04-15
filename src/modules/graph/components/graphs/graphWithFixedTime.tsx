"use client";

import { useGraphTimeFixed } from "../../hooks/useGraphTime";
import { GraphCommonProps, GraphInternal } from "./GraphInternal";

type GraphWithGlobalTimeProps = GraphCommonProps & {
    from: number,
    to: number
}

export const GraphWithFixedTime: React.FC<GraphWithGlobalTimeProps> = ({
    from,
    to,
    ...props
}) => {

    const context = useGraphTimeFixed( to, from );

    console.log( from - to );

    return <GraphInternal 
        {...props}
        state={context.state}
        dispatch={context.dispatch}
    />

}