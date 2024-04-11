import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { GraphGrid } from "@/modules/meteo/components/GraphGrid";
import { GraphContextProvider } from "@/modules/graph/graphContext";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { Metadata, ResolvingMetadata } from "next";
import { ScopePageProps } from "../layout";
import { Graph } from "@/modules/graph/components/Graph";
import { scopeProvider } from "@/graphql/scope/ScopeProvider";

export const generateStaticParams = async () => {

    const scopes = await googleSheetsProvider.fetchAllScopesDefinitions();
    return scopes;

}

export async function generateMetadata(
    { params }: ScopePageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {


    const scope = await googleSheetsProvider.fetchScopeDefinition(params.slug);

    return {
        title: getMetadataTitle(scope.name + " 📈"),
        description: scope.description,
        publisher: getMetadataPublisher()
    }
}


const ScopePage = async (props: ScopePageProps) => {

    const scope = await scopeProvider.fetchScopeDefinition(props.params.slug);

    return <GraphContextProvider>
        {/* <GraphGrid scope={scope}/> */}
        <Graph 
            scope={scope} 
            from={1707567048 * 1000}
            to={1712753533 * 1000}
            defaultGraphs={["temperature", "humidity"]}
        /> 
    </GraphContextProvider>
}

export default ScopePage;