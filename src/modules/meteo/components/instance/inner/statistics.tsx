"use client";

import { CloseIcon, InfoIcon } from "@/components/ui/icons";
import { GoogleColumnStats } from "@/graphql/google/google"
import { Button, Progress, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, cn } from "@nextui-org/react";

type StatisticsProps = {
    data?: GoogleColumnStats[],
    label: React.ReactNode,
    loading: boolean,
    onClose?: () => void,
    haderColor?: string
}

export const Statistics: React.FC<StatisticsProps> = props => {

    if (props.data === undefined || props.loading === true) {
        return <div className="border-2 border-dashed border-gray-400 rounded-xl w-full min-h-40 flex items-center justify-center">
            <Progress
                size="sm"
                isIndeterminate
                aria-label="Loading..."
                className="max-w-md"
            />
        </div>
    } else return <Table
        isCompact
        shadow="none"
        aria-label={props.label?.toString()}
        removeWrapper
    >
        <TableHeader>
            <TableColumn>
                <span className="flex items-center gap-2">
                    {props.onClose !== undefined && <Tooltip
                    content={"Zrušit tento časový výběr"}>
                        <Button
                            isIconOnly
                            size="sm"
                            onClick={props.onClose}
                        >
                            <CloseIcon />
                        </Button>
                    </Tooltip>}
                    {props.label}
                </span>
            </TableColumn>
            <TableColumn>AVG</TableColumn>
            <TableColumn>MIN</TableColumn>
            <TableColumn>MAX</TableColumn>
        </TableHeader>
        <TableBody>
            {props.data.map(row =>
                <TableRow
                    style={{ color: row.color }}
                    key={row.name}
                >
                    <TableCell>
                        <Tooltip
                            content={row.description}
                            placement="left"
                            color="foreground"
                            showArrow
                            className="max-w-40"
                            isDisabled={row.description === null}
                        >
                            <span className={cn(
                                "flex gap-2",
                                row.description !== null && "cursor-help"
                            )}>
                                {row.name}
                                {row.description !== null && <InfoIcon />}
                            </span>
                        </Tooltip>
                    </TableCell>
                    <TableCell>{row.avg?.toFixed(2)}</TableCell>
                    <TableCell>{row.min?.toFixed(2)}</TableCell>
                    <TableCell>{row.max?.toFixed(2)}</TableCell>
                </TableRow>
            )}

        </TableBody>
    </Table>

}