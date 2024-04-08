import { Button, Tooltip, cn } from "@nextui-org/react"
import { ForwardedRef, forwardRef } from "react"

type GraphSettingButtonProps = React.PropsWithChildren & {
    tooltip?: React.ReactNode,
    active: boolean,
    onClick: () => void,
    ref?: ForwardedRef<HTMLButtonElement>,
    id: string
}

const GraphSettingButtonWithTooltip: React.FC<GraphSettingButtonProps> = (props) => {

    return <Tooltip
        showArrow
        content={props.tooltip}
        color="foreground"
    >
        <GraphSettingButtonCore {...props} />
    </Tooltip>
}

const GraphSettingButtonCore: React.FC<GraphSettingButtonProps> = (props) => {

    const className = props.active ? "bg-gray-100" : "bg-transparent hover:bg-white text-gray-500 hover:text-black";

    return <Button
        id={props.id}
        isIconOnly
        variant="bordered"
        className={cn([
            className,
            "ease-in-out duration-300 transition-all"
        ])}
        onClick={props.onClick}
    >
        {props.children}
    </Button>
}

export const GraphSettingButton: React.FC<GraphSettingButtonProps> = ({
    tooltip = undefined,
    ...props
}) => {

    // if (tooltip !== undefined)
    // return <GraphSettingButtonWithTooltip {...props} tooltip={tooltip} />

    return <GraphSettingButtonCore {...props} />

}