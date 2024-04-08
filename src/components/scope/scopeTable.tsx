"use client";

import { GoogleScope } from "@/graphql/google/google";
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, cn, getKeyValue } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "../ui/icons";

type ScopeTableProps = {
    scopes: GoogleScope[]
}

export const ScopeTable: React.FC<ScopeTableProps> = props => {

    const router = useRouter();

    const columns = [
        { key: "school", label: "Tým" },
        // { key: "team", label: "Tým" },
        { key: "locality", label: "Lokalita" },
        { key: "description", label: "Popis" },
        { key: "link", label: "Akce" },
    ];

    const rows = props.scopes.map(item => ({
        slug: item.slug,
        school: <div className="flex w-full items-center gap-4 min-w-[250px]">
            <div className="group-hover:translate-x-1 text-gray-500 group-hover:text-primary-500 transform-all duration-200 ease-in-out group-hover:scale-[1.2]">
                <ArrowRightIcon />
            </div>
            <strong className="group-hover:text-primary-500">{item.name}</strong>
            <span>{item.team}</span>
        </div>,
        locality: item.locality,
        description: item.description,
        team: item.team,
        link: <div className="flex gap-2">
            <Button
                as={Link}
                href={`/project/${item.slug}/data`}
                size="sm"
            >Data</Button>
            <Button
                as={Link}
                href={`/project/${item.slug}/info`}
                size="sm"
            >Informace</Button>
            {item.count > 0
                && <Button
                    as={Link}
                    href={`/project/${item.slug}/thermo`}
                    size="sm"
                    color="primary"
                >Smínky</Button>
            }
        </div>
    }));

    return <Table
        isStriped
    >
        <TableHeader columns={columns}>
            {column => <TableColumn className={cn(
                ["team", "description", "locality"].includes(column.key.toString()) ? "hidden lg:table-cell" : "",
                ["locality"].includes(column.key.toString()) ? "hidden md:table-cell" : ""
            )}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
            {row => <TableRow
                key={row.slug}
                className="group hover:text-primary-500"
            >
                {(key) => <TableCell className={cn(
                    ["team", "description"].includes(key.toString()) ? "hidden lg:table-cell" : "",
                    ["locality"].includes(key.toString()) ? "hidden md:table-cell" : ""
                )}>
                    {getKeyValue(row, key)}
                </TableCell>}
            </TableRow>}
        </TableBody>
    </Table >

}