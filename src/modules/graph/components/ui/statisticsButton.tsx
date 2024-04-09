"use client";
import { Button, cn } from "@nextui-org/react";
import React, { PropsWithChildren, useMemo } from "react";

type StatisticsButtonType = PropsWithChildren & {
    slug: string,
    activeTab: string,
    onClick: () => void
}

export const StatisticsButton:  React.FC<StatisticsButtonType> = props => {

    const isActive = useMemo( () => props.slug === props.activeTab, [props.slug, props.activeTab] );

    return <div
        role="button"
        className={cn( 
            "",
            isActive ? "" : "opacity-70"
         )}
        onClick={ props.onClick }
    >{props.children}</div>

}