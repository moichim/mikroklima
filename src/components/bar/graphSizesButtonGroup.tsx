"use client";

import { useGraphContext } from "@/state/graph/graphContext";
import { StackActions } from "@/state/graph/reducerInternals/actions";
import { GraphInstanceScales, graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { Button, ButtonGroup, Tooltip } from "@nextui-org/react";

type GraphSize = {
    key: GraphInstanceScales,
    name: string,
    label: string,
    height: number
}

export const graphInstanceSizes: GraphSize[] = [
    {
        key: "sm",
        name: "S",
        label: "Malé grafy",
        height: graphInstanceHeights["sm"]
    },
    {
        key: "md",
        name: "M",
        label: "Střední grafy",
        height: graphInstanceHeights["md"]
    },
    {
        key: "lg",
        name: "L",
        label: "Velké grafy",
        height: graphInstanceHeights["lg"]
    },
    {
        key: "xl",
        name: "XL",
        label: "Extra velké grafy",
        height: graphInstanceHeights["xl"]
    },
    {
        key: "2xl",
        name: "XXL",
        label: "Obří grafy",
        height: graphInstanceHeights["2xl"]
    },
]

export const GraphSizesButtonGroup: React.FC = () => {

    const { graphState: state, graphDispatch: dispatch } = useGraphContext();

    const activeScale = state.sharedScale;

    return <ButtonGroup id="filterSizes">

        {graphInstanceSizes.map(size => {

            return <Tooltip
                content={size.label}
                showArrow
                color="foreground"
                key={size.key}
            >

                <Button
                    isIconOnly
                    variant="solid"
                    className={size.key === activeScale ? "bg-background bg-opacity-90" : "bg-background bg-opacity-50"}
                    onClick={() => dispatch(StackActions.setSharedScale(size.key))}
                >
                    {size.name}
                </Button>

            </Tooltip>

        })}

    </ButtonGroup>
}