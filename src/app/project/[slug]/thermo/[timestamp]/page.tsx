import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { GraphGrid } from "@/state/data/components/GraphGrid";
import { GraphContextProvider } from "@/state/graph/graphContext";
import { TimeController } from "@/thermal/components/controllers/timeController";
import { filesProvider } from "@/thermal/graphql/filesProvider";
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

    const from = subDays(parseInt(params.timestamp), 1).getTime();
    const to = addHours(parseInt(params.timestamp), 1).getTime();

    return <div>
        <TimeController scopeId={params.slug} from={from} to={to} />
        <GraphContextProvider>
            <GraphGrid scope={scope} fixedTime={{from, to}} hasZoom={false}/>
        </GraphContextProvider>
    </div>
}

export default DetailPage;