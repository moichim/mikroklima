"use client";

import { useApolloClient } from "@apollo/client";
import { Link as NextLink, LinkProps } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

export const Link: React.FC<LinkProps> = ({
    onClick,
    ...props
}) => {

    const client = useApolloClient();

    const router = useRouter();

    const newClick: MouseEventHandler<HTMLAnchorElement> = (event) => {

        event.preventDefault();

        client.stop();

        onClick && onClick(event);

        router.push( event.currentTarget.href );

    };

    return <NextLink {...props} onClick={newClick}>{props.children}</NextLink>

}