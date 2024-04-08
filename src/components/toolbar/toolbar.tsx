"use client";

import { useGraphContext } from "@/state/graph/graphContext"
import { StackActions } from "@/state/graph/reducerInternals/actions"
import { GraphToolType, graphTools } from "@/state/graph/data/tools"
import { Button, Tooltip, cn } from "@nextui-org/react"
import React, { useCallback, useMemo } from "react"


const Tool: React.FC<GraphToolType> = props => {

    const graph = useGraphContext();

    const isActive = useMemo(() => props.slug === graph.graphState.activeTool, [props.slug, graph.graphState.activeTool]);

    const dispatch = graph.graphDispatch;

    const Icon = useMemo(() => props.icon, [props.icon]);

    const onClick = useCallback(() => {

        dispatch(StackActions.selectTool(props.slug));

        if (isActive) {
            props.onActivate && props.onActivate(graph);
        } else {
            props.onDeactivate && props.onDeactivate(graph);
        }

    }, [dispatch, isActive, props, graph]);

    return <Tooltip
        showArrow={true}
        content={props.tooltip}
        placement="right"
        color="foreground"
    >
        <Button
            id={`${props.slug}Tool`}
            variant={"solid"}
            isIconOnly
            onClick={onClick}
            size="lg"
            color={ isActive ? "primary" : "default" }
            className={ "dark" }
        >
            <Icon />
        </Button>
    </Tooltip>
}

type ToolbarProps = {
    hasZoom?: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
    hasZoom = true,
    ...props
}) => {

    const objects = useMemo( () => {

        if ( hasZoom === true ) {
            return graphTools;
        }

        return {
            inspect: graphTools.inspect,
            select: graphTools.select
        }

    }, [ hasZoom ] );

    return <div className="flex flex-col gap-1">
        {Object.values(objects).map(tool => <Tool
            key={tool.name}
            {...tool}
        />)}
    </div>

}