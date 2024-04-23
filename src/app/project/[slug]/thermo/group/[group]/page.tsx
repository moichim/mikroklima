import { scopeProvider } from "@/graphql/scope/ScopeProvider";
import { GroupController } from "@/modules/thermal/components/views/group/groupController";

export const dynamicParams = true;

type GroupPageProps = {
    slug: string,
    group: string
}

const GroupPage = async (
    { params }: { params: GroupPageProps }
) => {

    const scope = await scopeProvider.fetchScopeDefinition(params.slug);

    return <div>
        <GroupController groupId={params.group} scope={scope} />
    </div>

}

export default GroupPage;