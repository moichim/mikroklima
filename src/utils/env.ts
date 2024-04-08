
/**
 * Run this only on the backend!
 * @throws Error if accessing in the frontend!
 */
export class Env {

    protected static makeSureThisRunsOnBackend() {
        if ( "browser" in process ) {
            throw new Error( "Trying to access environment variables from the frontend." )
        }
    }

    protected static getEnvironmentVariableAsEntry<T extends (string|number)>( key: string ): [string, T] {
        Env.makeSureThisRunsOnBackend();
        return [ key, process.env[ key ] as T ];
    }

    public static getGoogleCredentials() {
        Env.makeSureThisRunsOnBackend();
        return Object.fromEntries( [
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_TYPE"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_PROJECT_ID"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_PRIVATE_KEY_ID"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_PRIVATE_KEY"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_CLIENT_EMAIL"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_CLIENT_ID"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_AUTH_URI"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_TOKEN_URI"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_AUTH_PROVIDER_X509_CERT_URL"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_CLIENT_X509_CERT_URL"),
            Env.getEnvironmentVariableAsEntry<string>("GOOGLE_UNIVERSE_DOMAIN"),
        ] );
    }

}