"use client";

import { graphInstanceSizes } from "@/modules/graph/components/bar/graphSizesButtonGroup"
import { GraphInstanceHeightSetter } from "@/modules/meteo/context/useDataContextInternal"
import { GraphInstanceScales } from "@/modules/graph/reducerInternals/storage"
import { Button, ButtonGroup, Tooltip } from "@nextui-org/react"

type GraphInstanceSizesProps = {
    setter: GraphInstanceHeightSetter,
    height: GraphInstanceScales,
    loading: boolean
}

export const GraphInstanceSizes: React.FC<GraphInstanceSizesProps> = props => {

    return <ButtonGroup
        variant="bordered"
        isDisabled={props.loading}
    >
        {graphInstanceSizes.map(size => {

            return <Tooltip
                content={size.label}
                placement="bottom"
                closeDelay={100}
                key={size.key}
            >
                <Button
                    isIconOnly
                    onClick={() => {
                        props.setter(size.key)
                    }}
                    variant={ size.key === props.height ? "solid" : "bordered" }
                    size="sm"
                    className={size.key === props.height ? "" : "hover:bg-white"}
                >{size.name}</Button>
            </Tooltip>

        })}
    </ButtonGroup>

}