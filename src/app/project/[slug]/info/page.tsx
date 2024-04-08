import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { ScopePageProps } from "../layout";

const Map = dynamic(() => import("../../../../components/ui/map"), { ssr: false });

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
        title: getMetadataTitle( scope.name + " ℹ️"),
        description: scope.description,
        publisher: getMetadataPublisher()
    }
}

type RowProps = React.PropsWithChildren & {
    label: React.ReactNode
}

const Row: React.FC<RowProps> = props => {
    return <div className="mb-4">
        <h2 className="text-small text-gray-500">{props.label}</h2>
        <div>{props.children}</div>
    </div>
}

const Section: React.FC<React.PropsWithChildren> = props => {
    return <section
        className="w-full md:w-1/2 lg:w-1/4 px-10 py-4"
    >{props.children}</section>
}


const InfoPage = async ( props: ScopePageProps ) => {

    const scope = await googleSheetsProvider.fetchScopeDefinition(props.params.slug);

    return <article className="w-full overflow-hidden py-8">

        <header className="w-full hidden">

            <h1 className="text-xl font-bold pb-4">{scope.name}</h1>

        </header>

        <main className="flex flex-wrap -mx-10 -my-4">

            <Section>
                <Row label="Škola">{scope.name}</Row>
                <Row label="Tým">{scope.team}</Row>
                <Row label="Lokalita">{scope.locality}</Row>
                <Row label="Popis">{scope.description}</Row>
            </Section>

            <Section>
                <Map scope={scope} height="400px" />
            </Section>

            <Section>

            </Section>

            <Section>


            </Section>

        </main>

    </article>
}

export default InfoPage;