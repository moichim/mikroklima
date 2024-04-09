"use client";

import { Dropdown, DropdownTrigger, NavbarItem, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { NavbarLink, NavbarLinkDefinition } from "./NavbarLink";

type NavbarDesktopLinks = {
    links: NavbarLinkDefinition[]
}

const LinkWithDropdown: React.FC<NavbarLinkDefinition & { links: NavbarLinkDefinition[] }> = props => {

    return <Dropdown>
        <NavbarItem>
            <DropdownTrigger>
                <Button
                    // disableRipple
                    variant="light"
                >
                    {props.text}
                </Button>
            </DropdownTrigger>
        </NavbarItem>
        <DropdownMenu
            aria-label={`Nabídka položky ${props.text}`}
        >
            { props.links.map( item => {

                return <DropdownItem
                    key={ `${item.href.substring( 0,5 )}_${item.text?.toString().substring( 0,5 )}` }
                >
                    <NavbarLink 
                        {...item} 
                        activeVariant={ {
                            color: "primary"
                        } }
                        inactiveVariant={ {
                            color: "foreground"
                        }}
                    />
                </DropdownItem>
            } ) }
        </DropdownMenu>
    </Dropdown>

}

const LinkWithoutDropdown: React.FC<NavbarLinkDefinition> = props => {

    return <NavbarItem>
        <NavbarLink
            {...props}
            isBlock={true}
            size="sm"
            activeVariant={{
                color: "primary"
            }}
            inactiveVariant={ {
                color: "foreground",
            } }
        />
    </NavbarItem>

}

export const NavbarDesktopLinks: React.FC<NavbarDesktopLinks> = props => {

    return <div className="gap-4 items-center hidden lg:flex">
        {props.links.map( item => {

            if ( item.links === undefined )
                return <LinkWithoutDropdown {...item} key={`w_l_${item.href}`}/>
            else
                return <LinkWithDropdown {...item} links={item.links} key={`w_l_${item.href}`}/>
        } )}
    </div>

}