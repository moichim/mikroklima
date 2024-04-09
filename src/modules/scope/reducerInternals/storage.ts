import { GoogleScope } from "@/graphql/google/google"

export type ScopeContextType = {

    activeScope?: GoogleScope,

    availableScopes: GoogleScope[],
    
    allScopes: GoogleScope[]

}