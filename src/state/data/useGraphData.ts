import { GoogleScope, GoogleScopeData } from "@/graphql/google/google";
import { WeatherResponse } from "@/graphql/weather/weather";
import { MeteoResponseProcessor } from "@/state/data/processors/responseProcessing";
import { MeteoRequestType } from "@/state/data/processors/query";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useCallback, useMemo } from "react";

/** Provides the apollo query for the data of the given scope */
export const useGraphData = (
  scope: GoogleScope
) => {

  // The query
  const [fetchInternal, query] = useLazyQuery<DataQueryResponseType, MeteoRequestType>(QUERY, {

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

    onError: console.error

  });

  // The public fetch method
  const fetch = useCallback((
    from: number,
    to: number
  ) => {

    if (query.loading === true)
      return;

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


  // The resulting data
  const data = useMemo(() => {

    if (query.data === undefined)
      return undefined;
    else {
      const processed = MeteoResponseProcessor.process(query.data);
      return processed;
    }

  }, [query.data]);


  return {
    loading: query.loading,
    data,
    fetch
  }

}


export type DataQueryResponseType = {
  rangeGoogle: GoogleScopeData,
  rangeMeteo: WeatherResponse
}


const QUERY = gql`
query Source($lat: Float!, $lon: Float!, $hasNtc: Boolean!, $from: Float, $to: Float, $scope: String, $sheetId: String!, $sheetTab: String!) {
  rangeMeteo(lat: $lat, lon: $lon, hasNtc: $hasNtc, from: $from, to: $to, scope: $scope) {
    data {
      source {
        name
        color
        stroke
        slug
        props
        description
      }
      entries {
        time
        temperature
        wind_dir
        wind_speed
        bar
        rain
        clouds
        humidity
        uv
        radiance
        evapotranspiration
        snow_depth
      }
      statistics {
        temperature {
          min
          max
          avg
          count
        }
        wind_dir {
          min
          max
          avg
          count
        }
        wind_speed {
          min
          max
          avg
          count
        }
        bar {
          min
          max
          avg
          count
        }
        rain {
          min
          max
          avg
          count
        }
        clouds {
          min
          max
          avg
          count
        }
        humidity {
          min
          max
          avg
          count
        }
        uv {
          min
          max
          avg
          count
        }
        radiance {
          min
          max
          avg
          count
        }
        evapotranspiration {
          min
          max
          avg
          count
        }
        snow_depth {
          min
          max
          avg
          count
        }
      }
    }
    request {
      scope
      lat
      lon
      from
      to
    }
  }
  rangeGoogle(lat: $lat, lon: $lon, sheetId: $sheetId, sheetTab: $sheetTab, from: $from, to: $to, scope: $scope) {
    data {
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
      values {
        time
        value
        note
      }
      min
      max
      avg
      count
      description
    }
  }
}
`;