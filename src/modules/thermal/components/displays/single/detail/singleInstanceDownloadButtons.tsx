"use client";

import { Button, ButtonProps } from "@nextui-org/react"
import Link from "next/link"

type SingleInstanceDownloadButtonsProps = ButtonProps & {
    thermalUrl: string,
    visibleUrl?: string
}

export const SingleInstanceDownloadButtons: React.FC<SingleInstanceDownloadButtonsProps> = ({
    thermalUrl,
    visibleUrl = undefined,
    ...props
}) => {
    return <>
        <Button
            {...props}
            as={Link}
            href={thermalUrl}
        >
            Stáhnout LRC
        </Button>
        { visibleUrl && <Button
            {...props}
            as={Link}
            target="_blank"
            href={visibleUrl}
        >Stáhnout visible</Button> }
    </>
}