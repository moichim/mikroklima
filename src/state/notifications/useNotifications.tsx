"use client";

import { ErrorIcon, HelpIcon, InfoIcon, SuccessIcon } from "@/components/ui/icons";
import { generateRandomString } from "@/utils/strings";
import { Button, ButtonVariantProps } from "@nextui-org/react";
import React, { createContext, useCallback, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type NotificationButtonType = {
    label: string,
    href?: string,
    onClick?: () => void,
    variant: ButtonVariantProps
}

export type NotificationType = {
    id: string,
    message: React.ReactNode,
    classes: string,
    icon?: React.FC,
    buttons?: NotificationButtonType[],
    duration?: number,
    onRemove: () => void
}

const DEFAULT_DURATION = 2000;

export class NotificationFactory {

    public static success(
        message: React.ReactNode,
        duration: undefined | number = DEFAULT_DURATION
    ): NotificationType {
        const notification = {
            id: uuidv4(),
            message: message,
            classes: "bg-success text-white",
            icon: SuccessIcon,
            buttons: [],
            duration: duration,
            onRemove: () => { }
        };

        return notification;
    }

    public static error(
        message: React.ReactNode,
        duration: undefined | number = DEFAULT_DURATION
    ): NotificationType {
        const notification = {
            id: uuidv4(),
            message: message,
            classes: "bg-danger text-white",
            icon: ErrorIcon,
            buttons: [],
            duration: duration,
            onRemove: () => { }
        };

        return notification;
    }

    public static info(
        message: React.ReactNode,
        duration: undefined | number = DEFAULT_DURATION
    ): NotificationType {
        const notification = {
            id: uuidv4(),
            message: message,
            classes: "bg-foreground text-background",
            icon: InfoIcon,
            buttons: [],
            duration: duration,
            onRemove: () => { }
        };

        return notification;
    }

    public static help(
        message: React.ReactNode,
        duration: undefined | number = DEFAULT_DURATION
    ): NotificationType {
        const notification = {
            id: uuidv4(),
            message: message,
            classes: "bg-blue-500 text-white",
            icon: HelpIcon,
            buttons: [],
            duration: duration,
            onRemove: () => { }
        };

        return notification;
    }

}

type NotificationsContextType = ReturnType<typeof useNotifications>;

const notificationContextDefaults: NotificationsContextType = {
    notifications: [],
    addNotification: () => { }
}

const NotificationContext = createContext(notificationContextDefaults);

const useNotifications = () => {

    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    const addNotification = (notification: NotificationType) => {

        notification.onRemove = () => {
            setNotifications(original => {
                return original.filter(current => current.id !== notification.id);
            })
        };

        setNotifications(nots => [...nots, notification]);

        if (notification.duration) {
            setTimeout(notification.onRemove, notification.duration);
        }

    }

    return {
        addNotification,
        notifications
    }
}


export const NotificationsContextProvider: React.FC<React.PropsWithChildren> = props => {

    const value = useNotifications();

    return <NotificationContext.Provider value={value}>
        {props.children}
    </NotificationContext.Provider>

}

export const useNotficationsContext = () => {
    return useContext(NotificationContext);
}

export const NotificationTestButton: React.FC = () => {

    const notifications = useNotficationsContext();

    const generateSuccess = useCallback(() => {

        const notification = NotificationFactory.success(
            generateRandomString(Math.abs(Math.random() * 40))
        );

        return notification;

    }, []);

    const generateInfo = useCallback(() => {

        const notification = NotificationFactory.info(
            generateRandomString(Math.abs(Math.random() * 40))
        );

        return notification;

    }, []);

    const generateError = useCallback(() => {

        const notification = NotificationFactory.error(
            generateRandomString(Math.abs(Math.random() * 40))
        );

        return notification;

    }, []);

    const generateHelp = useCallback(() => {

        const notification = NotificationFactory.help(
            generateRandomString(Math.abs(Math.random() * 40))
        );

        return notification;

    }, []);

    return <>
        <Button
            onClick={() => notifications.addNotification(generateSuccess())}
        >Success</Button>
        <Button
            onClick={() => notifications.addNotification(generateInfo())}
        >Info</Button>
        <Button
            onClick={() => notifications.addNotification(generateError())}
        >Error</Button>

<Button
            onClick={() => notifications.addNotification(generateHelp())}
        >Help</Button>
    </>
}
