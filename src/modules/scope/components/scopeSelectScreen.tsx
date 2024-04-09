import { GoogleScope } from "@/graphql/google/google";
import { ScopeTable } from "./scopeTable";


type ScopeSelectScreenProps = {
    scopes: GoogleScope[]
}

export const ScopeSelectScreen: React.FC<ScopeSelectScreenProps> = props => {

    return <>

        <div className="py-4 text-xl flex gap-4 text-background">
            <div>Zapojené týmy ({props.scopes.length})</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
            </svg>
        </div>

        <div className="pb-10">
            <ScopeTable scopes={props.scopes} />
        </div>


    </>

}