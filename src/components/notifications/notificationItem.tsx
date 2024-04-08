"use client";

import { NotificationType } from "@/state/notifications/useNotifications";
import { cn } from "@nextui-org/react";
import { CloseIcon } from "../ui/icons";

export const NotificationItem: React.FC<NotificationType> = props => {

    const Icon = props.icon;

    return <div
        className={cn(
            "px-6 py-3 rounded-lg shadow-lg flex gap-3",
            props.classes
        )}
        role="listitem"
    >

        {Icon && <div><Icon /></div>}
        
        <div>{props.message}</div>
        
        <div
            onClick={props.onRemove}
            className="cursor-pointer"
        ><CloseIcon /></div>

    </div>


}