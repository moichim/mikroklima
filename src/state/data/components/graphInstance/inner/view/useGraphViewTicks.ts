import { GraphInstanceProps } from "@/state/data/context/useDataContextInternal";
import { format } from "date-fns";
import { useMemo } from "react";

export const useGraphViewTicks = (props: GraphInstanceProps) => {

    return useMemo(() => {

        let durationInHours = props.graphData ? props.graphData.data.length : 0;

        let times = (durationInHours > 0 && props.graphData) ? Object.values(props.graphData.data)
            .map(entry => entry.time) : [];

        let formatter: ((value: any, index: number) => string) | undefined = name => {
            return format(new Date(name), "H");
        };

        if (durationInHours >= 26 && durationInHours < 24 * 10) {
            times = times.filter(timestamp => {
                const hour = timestamp / 1000 / 60 / 60 % 24;
                const minute = timestamp / 1000 / 60 % 60;
                const second = timestamp / 1000 % 60;
                const result = (hour === 23 || hour === 11) && minute === 0 && second === 0;
                return result;
            });
            formatter = name => {
                return format(new Date(name), "H:mm");
            };
        }

        if (durationInHours >= 24 * 10) {
            times = times.filter(timestamp => {
                const hour = timestamp / 1000 / 60 / 60 % 24;
                const minute = timestamp / 1000 / 60 % 60;
                const second = timestamp / 1000 % 60;
                const result = (hour === 23) && minute === 0 && second === 0;
                return result;
            });
            formatter = name => {
                return format(new Date(name), "d.M.");
            };
        }

        return {
            times,
            formatter
        }

    }, [props.graphData]);

}