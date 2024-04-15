import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { GraphWithFixedTime } from "@/modules/graph/components/graphs/graphWithFixedTime";
import { GraphContextProvider } from "@/modules/graph/graphContext";
import { TimeController } from "@/modules/thermal/components/views/time/timeController";
import { TimePeriod } from "@/modules/time/reducerInternals/actions";
import { TimeFormat } from "@/utils/timeUtils/formatting";
import { TimeRound } from "@/utils/timeUtils/rounding";
import { addHours, subDays } from "date-fns";



// export const dynamicParams = true;


type DetailPageProps = {
    slug: string,
    timestamp: string
}

const DetailPage = async (
    { params }: { params: DetailPageProps },
) => {

    const scope = await scopeProvider.fetchScopeDefinition(params.slug);

    const imagesFrom = TimeRound.down(parseInt(params.timestamp), TimePeriod.DAY).getTime();

    const imagesTo = TimeRound.up(parseInt(params.timestamp), TimePeriod.DAY).getTime();


    return <div>
        <TimeController
            scopeId={params.slug}
            from={imagesFrom}
            to={imagesTo}
        />
        <GraphContextProvider>
            <GraphWithFixedTime
                defaultGraphs={["temperature", "radiance", "humidity"]}
                scope={scope}
                hasZoom={false}
                from={imagesTo}
                to={imagesFrom}
            />
        </GraphContextProvider>
    </div>
}

export default DetailPage;