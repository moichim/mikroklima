import { GoogleColumnStats, GoogleScope } from "@/graphql/google/google";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useState } from "react";
import { MeteoRequestType } from "./processors/query";
import { GraphStatisticsDataType, StatisticsProcessing } from "./processors/statisticsProcessing";

/** Provides the apollo query for the statistics at the given time */
export const useGraphStatistics = (
  scope: GoogleScope
) => {

  const [data, setData] = useState<GraphStatisticsDataType>();

  // The query
  const [fetchInternal, query] = useLazyQuery<StatisticsResponse, MeteoRequestType>(QUERY, {

    variables: {
      scope: scope.slug,
      sheetId: scope.sheetId,
      sheetTab: scope.sheetTab,
      from: 0,
      to: 0,
      lat: scope.lat,
      lon: scope.lon,
      hasNtc: scope.hasNtc
    },

    ssr: false,
    // nextFetchPolicy: "no-cache",

    onCompleted: data => {
      setData(StatisticsProcessing.format(data));
    }

  });

  // The public fetch method
  const fetch = useCallback((
    from: number,
    to: number
  ) => {

    if (query.loading === true)
      return;

    // clear the data at first
    setData(undefined);

    // Fire a new request
    fetchInternal({
      variables: {
        scope: scope.slug,
        sheetId: scope.sheetId,
        sheetTab: scope.sheetTab,
        from,
        to,
        lat: scope.lat,
        lon: scope.lon,
        hasNtc: scope.hasNtc
      }
    });

  }, [scope, query.loading]);

  // The public method for clearing
  const clear = () => {
    setData(undefined);
  }


  return {
    loading: query.loading,
    data,
    fetch,
    clear
  }

}

export type StatisticsResponse = {
  statisticsGoogle: GoogleColumnStats[],
  statisticsMeteo: GoogleColumnStats[]
}


export const QUERY = gql`

query Scopes($lat: Float!, $lon: Float!, $sheetId: String!, $sheetTab: String!, $scope: String, $from: Float, $to: Float, $hasNtc: Boolean! ) {
  statisticsGoogle(lat: $lat, lon: $lon, sheetId: $sheetId, sheetTab: $sheetTab, scope: $scope, from: $from, to: $to) {
    name
    slug
    color
    in {
      type
      unit
      name
      field
      in
      color
      slug
      min
      max
    }
    description
    min
    max
    avg
    count
  }
  statisticsMeteo(lat: $lat, lon: $lon, hasNtc: $hasNtc, from: $from, to: $to, scope: $scope) {
    name
    slug
    color
    in {
      type
      unit
      name
      field
      in
      color
      slug
      min
      max
    }
    description
    min
    max
    avg
    count
  }
}

`;