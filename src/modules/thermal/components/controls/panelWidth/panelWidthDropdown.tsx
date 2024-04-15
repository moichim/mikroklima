import { Dropdown, DropdownProps, DropdownTrigger, Button, DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react"

type PanelWidthDropdownProps = {
    current: number,
    onUpdate: (value: number) => any
}

export const PanelWidthDropdown: React.FC<PanelWidthDropdownProps> = props => {

    return <Dropdown
            aria-label="Volba šířky mřížky termogramů"
        >
            <DropdownTrigger>
                <Button>

                    <div className="flex items-center gap-2 justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                            <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v2A1.5 1.5 0 0 0 3.5 7h2A1.5 1.5 0 0 0 7 5.5v-2A1.5 1.5 0 0 0 5.5 2h-2ZM3.5 9A1.5 1.5 0 0 0 2 10.5v2A1.5 1.5 0 0 0 3.5 14h2A1.5 1.5 0 0 0 7 12.5v-2A1.5 1.5 0 0 0 5.5 9h-2ZM9 3.5A1.5 1.5 0 0 1 10.5 2h2A1.5 1.5 0 0 1 14 3.5v2A1.5 1.5 0 0 1 12.5 7h-2A1.5 1.5 0 0 1 9 5.5v-2ZM10.5 9A1.5 1.5 0 0 0 9 10.5v2a1.5 1.5 0 0 0 1.5 1.5h2a1.5 1.5 0 0 0 1.5-1.5v-2A1.5 1.5 0 0 0 12.5 9h-2Z" />
                        </svg>


                        <span>{props.current}</span>
                    </div>
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                onAction={value => props.onUpdate(parseInt(value.toString()))}
            >
                {[1, 2, 3, 4].map(num => <DropdownItem
                    key={num}
                >{num} {num === 1 ? "sloupec" : "sloupce"}</DropdownItem>)}
            </DropdownMenu>
        </Dropdown>


}