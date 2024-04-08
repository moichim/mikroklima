import { GraphDomain } from "@/state/graph/reducerInternals/storage";
import { useMemo } from "react";

type GraphDomainType = number | "auto";

export const useGraphViewDomain = (
    domain: GraphDomain,
    min: GraphDomainType = "auto",
    max: GraphDomainType = "auto"
): [GraphDomainType, GraphDomainType] => {



    return useMemo(() => {

        let result: [GraphDomainType, GraphDomainType] = ["auto", "auto"]

        if (
            domain === GraphDomain.DEFAULT
            || domain === GraphDomain.MANUAL
        ) {

            if (typeof min === "number" && typeof max === "number") {
                if (min < max) {
                    const tmp = max;
                    min = max;
                    max = tmp;
                }
            }

            result = [min, max];
        }

        return result;

    }, [domain, min, max]);

}