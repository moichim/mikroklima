"use client";

import { useNotficationsContext } from "../../state/notifications/useNotifications";
import { NotificationItem } from "./notificationItem";

export const NotificationListing: React.FC = () => {

    const { notifications } = useNotficationsContext();

    if (notifications.length === 0) return <></>

    return <aside
        className="fixed bottom-0 right-0 w-full h-0 z-20"
        role="list"
    >

        <div className="absolute bottom-0 right-0 flex flex-col gap-3 items-end" style={{right: "5rem", bottom: "1rem"}} >

            {notifications.map( item => <NotificationItem {...item} key={item.id}/> )}

        </div>
    </aside>

}

