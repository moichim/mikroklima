"use client";

import { cn } from "@nextui-org/react"
import { useMemo } from "react";

type ContentContainerProps = React.PropsWithChildren & {
    className?: string,
    element?: "section"|"div"|"footer"|"main",
    id: string
}

export const ContentContainer: React.FC<ContentContainerProps> = ( {
    className,
    element = "section",
    ...props
}) => {

    const Element = element;

    const classes = useMemo(() => cn(
        "relative isolate px-6 pt-14 lg:px-8",
        className
    ), [className] );

    return <div className={classes} id={props.id}>
        <Element className="mx-auto max-w-screen-xl">
            {props.children}
        </Element>
    </div>
}