import { GoogleColumnStats } from "@/graphql/google/google";
import { StatisticsResponse } from "@/state/data/useGraphStatitics";

export type GraphStatisticsDataType = {
    lines: {
        [index: string]: GoogleColumnStats
    },
    dots: {
        [index: string]: GoogleColumnStats
    }
}

/** 
 * Format statistics from API response 
 * @see useGraphStatistics
 */
export class StatisticsProcessing {

    public static format(
        response: StatisticsResponse
    ) {
        const googleStatistics = Object.fromEntries( response.statisticsGoogle.map( column => {
            return [ column.slug, column ];
        } ) );

        const weatherStatistics = Object.fromEntries( response.statisticsMeteo.map( column => [ column.slug, column ] ) );

        return {
            dots: googleStatistics,
            lines: weatherStatistics
        }
    }

}