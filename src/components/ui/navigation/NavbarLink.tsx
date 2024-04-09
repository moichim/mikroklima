"use client";

import { Link } from "@/utils/link";
import { LinkProps, ThemeColors, LinkVariantProps } from "@nextui-org/react"
import { usePathname } from "next/navigation";


export type NavbarLinkDefinition = LinkProps & {
    href: string,
    
    text: React.ReactNode,
    icon?: React.ReactNode,
    description?: React.ReactNode,

    links?: NavbarLinkDefinition[],
}

type NavbarLinkProps = NavbarLinkDefinition & {
    activeVariant?: LinkVariantProps,
    inactiveVariant?: LinkVariantProps
}

export const NavbarLink: React.FC< NavbarLinkProps > = ({
    activeVariant,
    inactiveVariant,
    text,
    links,
    description,
    icon,
    href,
    ...props
}) => {

    const pathname = usePathname();

    const isCurrent = href === pathname;

    const variant = isCurrent
        ? activeVariant ?? {}
        : inactiveVariant ?? {}

    return <Link
        {...props}
        href={ href }
        {...variant}
    >
        {icon && icon}
        {text}
        {description && <label className="text-sm">{description}</label>}
    </Link>
}