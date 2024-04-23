import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { GraphWithFixedTime } from "@/modules/graph/components/graphs/graphWithFixedTime";
import { GraphContextProvider } from "@/modules/graph/graphContext";
import { TimeController } from "@/modules/thermal/components/views/moment/timeController";
import { TimePeriod } from "@/modules/time/reducerInternals/actions";
import { TimeRound } from "@/utils/timeUtils/rounding";



// export const dynamicParams = true;


type MomentPageProps = {
    slug: string,
    timestamp: string
}

const MomentPage = async (
    { params }: { params: MomentPageProps },
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

export default MomentPage;