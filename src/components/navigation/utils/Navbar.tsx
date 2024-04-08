"use client";

import {
    NavbarBrand,
    NavbarContent,
    Navbar as NextuiNavbar,
    NavbarProps as NextuiNavbarProps,
    Tooltip,
    Link,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    cn
} from "@nextui-org/react";
import { NavbarLink, NavbarLinkDefinition } from "./NavbarLink";
import { NavbarDesktopLinks } from "./NnavbarDesktopLinks";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";
import { useState } from "react";

export type NavbarProps = React.PropsWithChildren & NextuiNavbarProps & {
    brandContent?: React.ReactNode,
    links?: NavbarLinkDefinition[],
    innerContent?: React.ReactNode,
    endContent?: React.ReactNode,
    closeLink?: string,
    closeLinkHint?: React.ReactNode
}

export const Navbar: React.FC<NavbarProps> = ({
    closeLink,
    closeLinkHint,
    innerContent: content,
    links,
    brandContent,
    endContent,
    children,
    ...props
}) => {

    const [open, setOpen] = useState<boolean>(false);

    return <NextuiNavbar
        {...props}
        maxWidth="full"
        isBordered={true}
        {...props}
        className={cn(
            props.className,
            "data-[menu-open=true]:z-50 group"
        )}
        classNames={{
            ...props.classNames,
            menu: cn(props.classNames?.menu, "group-data-[menu-open=true]:z-50", "z-50")
        }}
        isMenuOpen={open}
        onMenuOpenChange={setOpen}
    >

        {(links) && <NavbarContent
            justify="start"
            className="lg:hidden flex-grow-0"
            style={{
                width: "5rem !important",
                flexGrow: "0"
            }}
        >
            <NavbarMenuToggle
                aria-label={open ? "Zavřít menu" : "Rozbalit nabídku"}
                className="flex-grow-0"
            />
        </NavbarContent>}

        {brandContent && <>
            <NavbarBrand
                className="flex-grow-0 flex gap-8"
            >
                {brandContent}
                {(links || content) &&
                    <div className="text-gray-400 pr-4 hidden lg:block">
                        <ArrowRightIcon />
                    </div>
                }
            </NavbarBrand>
        </>}


        {links &&
            <NavbarMenu>

                {links.map((item, index) => {
                    return <NavbarMenuItem key={`item-${item.text?.toString().substring(0, 5)}_${index}`}>
                        <NavbarLink
                            {...item}
                            activeVariant={{
                                color: "primary"
                            }}
                            inactiveVariant={{
                                color: "foreground"
                            }}
                        ></NavbarLink>
                    </NavbarMenuItem>
                })}

            </NavbarMenu>
        }


        <NavbarContent
            justify="start"
            className="flex-grow"
        >

            {links && <NavbarDesktopLinks
                links={links}
            />}

            {content && content}

            {children}

        </NavbarContent>

        {(endContent || closeLink) && <NavbarContent
            justify="end"
            className="flex-grow-0"
            style={{flexGrow: 0}}
        >

            {endContent && endContent}

            {closeLink && <Tooltip
                isDisabled={closeLinkHint === undefined}
                content={closeLinkHint}
                size="sm"
                color="foreground"
                placement="left"
            >
                <Link href={closeLink} color="foreground" className="hover:text-primary transition-all duration-300 ease-in-out">
                    <CloseIcon />
                </Link>
            </Tooltip>}

        </NavbarContent>}

    </NextuiNavbar>

}