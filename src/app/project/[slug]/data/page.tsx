import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { GraphGrid } from "@/state/data/components/GraphGrid";
import { GraphContextProvider } from "@/state/graph/graphContext";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { Metadata, ResolvingMetadata } from "next";
import { ScopePageProps } from "../layout";

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

    const scope = await googleSheetsProvider.fetchScopeDefinition(props.params.slug);

    return <GraphContextProvider>
        <GraphGrid scope={scope}/>
    </GraphContextProvider>
}

export default ScopePage;