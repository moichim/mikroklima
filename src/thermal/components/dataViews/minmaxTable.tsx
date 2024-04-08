"use client";

import { ThermalMinmaxOrUndefined } from "@/thermal/registry/interfaces";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableProps, TableRow } from "@nextui-org/react";

type MinmaxTableProps = TableProps & {
    minmax: ThermalMinmaxOrUndefined,
    loading: boolean,
    decimals?: number
}

export const MinmaxTableRows: React.FC<MinmaxTableProps> = ({
    minmax,
    decimals = 3,
    ...props
}) => {

    return <>
        <TableRow key="min">
            <TableCell>Minimum</TableCell>
            <TableCell>
                {minmax !== undefined
                    ? <>{minmax.min.toFixed(decimals)} °C</>
                    : "načítám"
                }
            </TableCell>
        </TableRow>
        <TableRow key="max">
            <TableCell>Maximum</TableCell>
            <TableCell>
                {minmax !== undefined
                    ? <>{minmax.max.toFixed(decimals)} °C</>
                    : "načítám"
                }
            </TableCell>
        </TableRow>
    </>
}

export const MinmaxTable: React.FC<MinmaxTableProps> = ({
    minmax,
    loading,
    decimals = 3,
    ...props
}) => {


    return <Table
        aria-label="Tabulka minima a maxima"
        {...props}
    >
        <TableHeader>
            <TableColumn>Vlastnost</TableColumn>
            <TableColumn>Hodnota ve stupních Celsia</TableColumn>
        </TableHeader>

        <TableBody
            isLoading={loading || minmax === undefined}
        >
            <TableRow key="min">
            <TableCell>Minimum</TableCell>
            <TableCell>
                {minmax !== undefined
                    ? <>{minmax.min.toFixed(decimals)} °C</>
                    : "načítám"
                }
            </TableCell>
        </TableRow>
        <TableRow key="max">
            <TableCell>Maximum</TableCell>
            <TableCell>
                {minmax !== undefined
                    ? <>{minmax.max.toFixed(decimals)} °C</>
                    : "načítám"
                }
            </TableCell>
        </TableRow>
        </TableBody>

    </Table>
}