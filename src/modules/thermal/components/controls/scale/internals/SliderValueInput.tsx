"use client";

import { Input, Tooltip } from "@nextui-org/react"
import { ChangeEvent, DOMAttributes, useState } from "react"

type SliderValueInput = DOMAttributes<HTMLOutputElement> & {
    startContent?: React.ReactNode,
    tooltipContent: React.ReactNode,
    value: number,
    onChange: ( e: ChangeEvent<HTMLInputElement> ) => void,
    label?: React.ReactNode,
}

export const SliuderValueInput: React.FC<SliderValueInput> = ({
    children,
    tooltipContent,
    value,
    onChange,
    label,
    startContent,
    ...props
}) => {

    const [ internal, setInternal ] = useState<number>( value );


    return <output {...props}>
    <Tooltip content={tooltipContent}>
        <Input

            className="text-right w-min"
            type="text"
            variant="bordered"
            color="primary"
            size="sm"
            classNames={{
                input: "text-right w-16",

            }}

            label={label}

            // labelPlacement="outside"

            startContent={startContent}
            endContent="°C"

            aria-label="Temperature value"

            value={value.toString()}
            onChange={onChange}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !isNaN(Number(value))) {
                    // setFinal(value);
                }
            }}
        />
    </Tooltip>
</output>

}