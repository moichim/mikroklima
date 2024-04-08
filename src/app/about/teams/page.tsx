import { ContentContainer } from '@/components/content/ui/contentContainer';
import { ScopeMap } from '@/components/scope/scopeMap';
import { ScopeSelectScreen } from '@/components/scope/scopeSelectScreen';
import { googleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';

export default async function Home() {

    const data = await googleSheetsProvider.fetchAllScopesDefinitions();

    return <div className="pb-20">

        <ContentContainer element="main" id="main">
            <h1 className="text-xl font-bold pb-6">Zúčastněné týmy</h1>
            <p>Aktuálního ročníku 2023/24 se účastní tyto týmy:</p>
            <ScopeSelectScreen scopes={data} />

            <ScopeMap scopes={data} />
        </ContentContainer>

    </div>;

}
