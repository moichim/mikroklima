"use client";

import { GoogleScope } from "@/graphql/google/google";
import { Button, Dropdown, DropdownTrigger, Link, cn } from "@nextui-org/react";
import React, { useMemo } from "react";
import { ScopeDropdownMenu } from "./scopeDropdownMenu";

const Divider: React.FC<React.PropsWithChildren> = props => <div>{props.children}</div>

export const ScopeHeading: React.FC<GoogleScope> = props => {

    const isData = false;
    //useMemo( () => window.location.pathname.includes("/info"), [] );

    return <header className="flex gap-1 items-center">
        <Divider>
            <Button
                isIconOnly
                color="default"
                variant="shadow"
                className="bg-foreground text-background bg-opacity-50"
                href="/"
                as={Link}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>

            </Button>
        </Divider>
        <Divider>
            <Dropdown>
                <DropdownTrigger>
                    <Button
                        color="default"
                        variant="shadow"
                        className="bg-foreground text-background"
                    >
                        {props.name} ({props.team})
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                    </Button>
                </DropdownTrigger>
                <ScopeDropdownMenu {...props} />
            </Dropdown>
        </Divider>
        <Divider>
            <Button
                color="default"
                variant="shadow"
                className={cn( 
                    "bg-foreground text-background bg-opacity-50" ,
                )}
                as={Link}
                href={`/${props.slug}`}
            >Naměřená data</Button>
        </Divider>
        <Divider>
            <Button
                color="default"
                variant="shadow"
                className={cn( 
                    "bg-foreground text-background bg-opacity-50" ,
                )}
                as={Link}
                href={`/${props.slug}/info`}
            >Informace</Button>
        </Divider>
        <Divider>
            <Button
                color="default"
                variant="shadow"
                className={cn( 
                    "bg-foreground text-background bg-opacity-50" ,
                )}
                as={Link}
                href={`/${props.slug}/thermo`}
            >Snímky</Button>
        </Divider>
    </header>

}