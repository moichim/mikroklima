"use client";

import { AvailableWeatherProperties, WeatherProperty } from "@/graphql/weather/definitions/properties"
import { GraphInstancePropertySetter } from "@/state/data/context/useDataContextInternal"
import { Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Spinner } from "@nextui-org/react"

type GraphInstanceSelectorProps = {
    setter: GraphInstancePropertySetter,
    property: WeatherProperty,
    availableProperties: WeatherProperty[],
    loading: boolean
}

export const GraphinstanceSelector: React.FC<GraphInstanceSelectorProps> = props => {

    return <Dropdown
        backdrop="blur"
        isDisabled={props.loading}
    >
        <DropdownTrigger>
            <Button
                variant="bordered"
                className="bg-white hover:border-primary"
                isLoading={props.loading}
            >
                {props.property.name} <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={value => props.setter( value as AvailableWeatherProperties )}
            aria-label="Zvolte jinou veličinu"
        >
            {props.availableProperties.map(property => <DropdownItem
                key={property.slug}
            >
                {property.name}
            </DropdownItem>)}
        </DropdownMenu>
    </Dropdown>

}