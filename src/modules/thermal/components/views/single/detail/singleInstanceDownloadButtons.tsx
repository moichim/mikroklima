"use client";

import { Button, ButtonGroup, ButtonProps } from "@nextui-org/react"
import Link from "next/link"

type SingleInstanceDownloadButtonsProps = ButtonProps & {
    thermalUrl: string,
    visibleUrl?: string,
    downloadAction?: () => void
}

export const SingleInstanceDownloadButtons: React.FC<SingleInstanceDownloadButtonsProps> = ({
    thermalUrl,
    visibleUrl = undefined,
    downloadAction,
    ...props
}) => {
    return <ButtonGroup>
        {downloadAction !== undefined &&
            <Button>
                Termogram
            </Button>
        }
        <Button
            {...props}
            as={Link}
            href={thermalUrl}
        >
            LRC
        </Button>
        {visibleUrl && <Button
            {...props}
            as={Link}
            target="_blank"
            href={visibleUrl}
        >Visible</Button>}
    </ButtonGroup>
}