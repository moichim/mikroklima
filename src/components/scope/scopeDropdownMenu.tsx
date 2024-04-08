"use client";

import { GoogleScope } from "@/graphql/google/google";
import { DropdownItem, DropdownMenu } from "@nextui-org/react";
import { useMemo } from "react";
import { useScopeContext } from "../../state/scope/scopeContext";

export const ScopeDropdownMenu: React.FC<GoogleScope> = props => {

    const { availableScopes } = useScopeContext();

    const items = useMemo( () => availableScopes.map( scope => ({
        key: scope.slug,
        label: scope.name + " (" + scope.team + ")"
    }) ), [availableScopes] );

    return <DropdownMenu items={items}>
        {item => <DropdownItem href={`/project/${item.key}/data`} key={item.key}>{item.label}</DropdownItem>}
    </DropdownMenu>

}