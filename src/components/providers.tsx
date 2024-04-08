'use client'

import { NotificationsContextProvider } from "@/state/notifications/useNotifications"
import { ScopeContextProvider } from "@/state/scope/scopeContext"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { NextUIProvider } from "@nextui-org/react"
import React from "react"

const client = new ApolloClient({

    uri: '/api/',

    cache: new InMemoryCache(),

});

export const Providers: React.FC<React.PropsWithChildren> = props => {
    return <ApolloProvider client={client}>
        <NextUIProvider>
            <NotificationsContextProvider>
                    {props.children}
            </NotificationsContextProvider>
        </NextUIProvider>
    </ApolloProvider>
}