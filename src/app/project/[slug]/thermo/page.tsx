import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ScopePageProps } from "../layout";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { ResolvingMetadata, Metadata } from "next";
import { ProjectController } from "@/thermal/components/controllers/projectController";

export const generateStaticParams = async () => {

  const scopes = await googleSheetsProvider.fetchAllScopesDefinitions();
  return scopes.filter( scope => scope.count > 0 );

}

export async function generateMetadata(
  { params }: ScopePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {


  const scope = await googleSheetsProvider.fetchScopeDefinition(params.slug);

  return {
      title: getMetadataTitle( scope.name + " 👀"),
      description: scope.description,
      publisher: getMetadataPublisher()
  }
}

const InfoPage = async ( props: ScopePageProps ) => {

  return <div className="">
    <ProjectController scopeId={props.params.slug} />
  </div>;

}

export default InfoPage;
