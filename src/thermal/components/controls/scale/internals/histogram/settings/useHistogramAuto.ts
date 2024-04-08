import { ThermalStatistics } from "@/thermal/registry/ThermalRegistry";
import { ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "@/thermal/registry/interfaces";
import { useMemo } from "react";

/** Calculates the automatic range based on the current values */
export const useHistogramAutoValue = (
    histogram: ThermalStatistics[],
    minmax: ThermalMinmaxOrUndefined,
    minHeight: number = 3
) => {

    const value: ThermalRangeOrUndefined = useMemo(() => {

        if (histogram.length === 0 || minmax === undefined)
            return undefined;

        const { min, max } = histogram.reduce((state, current) => {

            if (current.height > minHeight) {

                const newState = {...state};

                if (state.min > current.height) {
                    newState.min = current.from;
                }

                if (state.max < current.height) {
                    newState.max = current.to;
                }

                return newState;

            }

            return state;
        }, { min: minmax.max, max: minmax.min });

        return { from: min, to: max };

    }, [histogram, minmax, minHeight]);

    return value;

}