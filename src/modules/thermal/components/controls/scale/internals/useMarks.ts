import { ThermalMinmaxOrUndefined } from "@/modules/thermal/registry/interfaces";
import { SliderStepMark } from "@nextui-org/react";

export const useMarks = (
    minmax: ThermalMinmaxOrUndefined,
    steps: number = 10
): SliderStepMark[] => {

    if ( minmax === undefined ) {
        return [];
    }

    const marks: SliderStepMark[] = [];

    const step = ( minmax.max - minmax.min ) / steps;

    marks.push({
        value: minmax.min,
        label: minmax.min.toFixed(1)
    });

    let i = 1;

    while ( i < steps ) {

        const value = minmax.min + ( step * i );

        marks.push( {
            value,
            label: value.toFixed(1)
        } );

        i++;

    }

    marks.push({
        value: minmax.max,
        label: minmax.max.toFixed(1)
    });

    return marks;

}