"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Button, ButtonProps, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from "@nextui-org/react";
import { useMemo } from "react";
import { TimePeriod } from "../../reducerInternals/actions";

type ButtonArrowDirection = "left" | "right"; // | "up" | "down";

type ButtonArrowProps = ButtonProps & {
    direction?: ButtonArrowDirection,
    availableTimeInHours: number,
    onDo: (period: TimePeriod) => void,
    // loading: boolean
}

export const ButtonArrow: React.FC<ButtonArrowProps> = ({
    availableTimeInHours,
    direction,
    onDo,
    className,
    // loading,
    ...props
}) => {

    const mayDo = availableTimeInHours > 0;

    const mark = useMemo(() => {
        return direction === "right"
            ? "+"
            : "-";
    }, [direction]);

    const classes = cn(
        className,
        "transition-all duration-300 ease-in-out group-hover:border-primary-300 h-14 bg-white",
        direction === "left"
            ? "border-r-0 rounded-e-none"
            : "border-l-0 rounded-s-none",
        mayDo
            ? "hover:bg-primary-300 hover:text-white"
            : "text-gray-400"
    );

    return <Dropdown
        isDisabled={availableTimeInHours <= 0}
    >
        <DropdownTrigger>
            <Button
                {...props}
                isIconOnly
                idDisabled={mayDo === false}
                variant={"bordered"}
                className={classes}
            >
                {direction === "left"
                    ? <ArrowLeftIcon />
                    : <ArrowRightIcon />
                }
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={value => {

                switch (value) {

                    case TimePeriod.HOUR:
                        onDo(TimePeriod.HOUR);
                        break;
                    case TimePeriod.DAY:
                        onDo(TimePeriod.DAY);
                        break;
                    case TimePeriod.WEEK:
                        onDo(TimePeriod.WEEK);
                        break;
                    case TimePeriod.MONTH:
                        onDo(TimePeriod.MONTH);
                        break;
                    case TimePeriod.YEAR:
                        onDo(TimePeriod.YEAR);
                        break;

                }

            }}
        >
            <DropdownItem
                key={TimePeriod.HOUR}
                isDisabled={availableTimeInHours <= 0}
            >
                {mark} 1 hodinu
            </DropdownItem>
            <DropdownItem
                key={TimePeriod.DAY}
                isDisabled={availableTimeInHours < 24}
            >
                {mark} 1 den
            </DropdownItem>
            <DropdownItem
                key={TimePeriod.WEEK}
                isDisabled={availableTimeInHours < (24 * 7)}
            >
                {mark} 1 týden
            </DropdownItem>
            <DropdownItem
                key={TimePeriod.MONTH}
                isDisabled={availableTimeInHours < (24 * 28)}
            >
                {mark} 1 měsíc
            </DropdownItem>
            <DropdownItem
                key={TimePeriod.YEAR}
                isDisabled={availableTimeInHours < (24 * 356)}
            >
                {mark} 1 rok
            </DropdownItem>
        </DropdownMenu>
    </Dropdown>

}