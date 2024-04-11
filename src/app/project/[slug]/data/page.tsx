import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { GraphContextProvider } from "@/modules/graph/graphContext";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { Metadata, ResolvingMetadata } from "next";
import { ScopePageProps } from "../layout";
import { GraphInternal } from "@/modules/graph/components/graphs/GraphInternal";
import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { GraphWithFixedTime } from "@/modules/graph/components/graphs/graphWithFixedTime";
import { GraphWithGlobalTime } from "@/modules/graph/components/graphs/graphWithGlobalTime";

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
        <GraphWithGlobalTime 
            defaultGraphs={["temperature", "radiance", "humidity"]}
            scope={scope}
            hasZoom
        />
    </GraphContextProvider>
}

export default ScopePage;