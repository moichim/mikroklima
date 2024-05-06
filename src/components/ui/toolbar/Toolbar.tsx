"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  cn,
} from "@nextui-org/react";
import React, { useState } from "react";
import { ArrowRightIcon, CloseIcon, SettingIcon } from "../icons";
import { Link } from "@/utils/link";
import { NavbarLink, NavbarLinkDefinition } from "../navigation/NavbarLink";

const Separator: React.FC = () => {
  return (
    <div className="text-gray-400 pr-4 hidden lg:block">
      <ArrowRightIcon />
    </div>
  );
};

type ToolbarPartProps = React.PropsWithChildren & {
  hasArrow?: boolean;
  className?: string;
};
const ToolbarPart: React.FC<ToolbarPartProps> = (props) => {
  return (
    <>
      <div className={props.className}>{props.children}</div>
      {props.hasArrow && <Separator />}
    </>
  );
};

type ToolbarProps = React.PropsWithChildren & {
  label?: React.ReactNode;
  classes?: {
    container?: string;
  };
  menu?: NavbarLinkDefinition[];
  links?: NavbarLinkDefinition[];
  configuration?: {
    content: React.ReactNode;
    label: React.ReactNode;
    description?: React.ReactNode;
  }[];
  configurationLabel?: React.ReactNode;
  persistentContent?: React.ReactNode;
  close?: {
    href: string;
    tooltip: React.ReactNode;
  };
};

export const Toolbar: React.FC<ToolbarProps> = (props) => {
  const [configOpen, setConfigOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <header
      className={cn(
        "sticky top-0 w-full border-b-1 border-b-gray-300 z-40",
        props.classes?.container ?? ""
      )}
    >
      <div className="p-6 w-full h-full relative flex gap-4 items-center">
        {props.menu && (
          <ToolbarPart className="block lg:hidden">
            <Button
              isIconOnly
              variant="flat"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <CloseIcon />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
                  />
                </svg>
              )}
            </Button>
          </ToolbarPart>
        )}

        {props.label && (
          <ToolbarPart hasArrow={true} className="font-bold">
            {props.label}
          </ToolbarPart>
        )}

        <div className="flex-grow flex gap-5 items-center">
          {props.menu && (
            <ToolbarPart className="gap-4 hidden lg:flex">
              {props.menu.map((link) => (
                <NavbarLink
                  key={link.href}
                  href={link.href}
                  text={link.text}
                  activeVariant={{
                    color: "primary",
                  }}
                  inactiveVariant={{
                    color: "foreground",
                  }}
                  className="text-sm"
                ></NavbarLink>
              ))}
            </ToolbarPart>
          )}

          {props.configuration && (
            <ToolbarPart className="hidden lg:flex items-center gap-4">
              {props.configuration &&
                props.configuration.map((config) => (
                  <div key={config.label?.toString()}>{config.content}</div>
                ))}
            </ToolbarPart>
          )}

          {props.children && (
            <ToolbarPart className="flex gap-4 items-center">
              {props.children}
            </ToolbarPart>
          )}
        </div>

        {props.links && (
          <ToolbarPart className="gap-4 hidden lg:flex">
            {props.links.map((link) => (
              <NavbarLink
                key={link.href}
                activeVariant={{
                  color: "primary",
                }}
                inactiveVariant={{
                  color: "foreground",
                }}
                {...link}
                className="text-sm"
              ></NavbarLink>
            ))}
          </ToolbarPart>
        )}

        {props.configuration && (
          <ToolbarPart className="block lg:hidden">
            <Button
              isIconOnly={props.configurationLabel === undefined}
              onClick={() => setConfigOpen(!configOpen)}
              variant="flat"
              color="primary"
            >
              <SettingIcon />{" "}
              {props.configurationLabel && props.configurationLabel}
            </Button>
            <Modal
              isOpen={configOpen}
              onOpenChange={setConfigOpen}
              className="z-[100]"
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      {props.configurationLabel ?? "Nastavení"}
                    </ModalHeader>
                    <ModalBody>
                      {props.configuration &&
                        props.configuration.map((config) => (
                          <div key={config.label?.toString()} className="pb-3">
                            <div className="text-sm uppercase py-2">
                              {config.label}
                            </div>

                            <div>{config.content}</div>
                            {config.description && (
                              <div className="text-sm text-gray-500 pt-1">
                                {config.description}
                              </div>
                            )}
                          </div>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onPress={onClose}>
                        Zavřít
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </ToolbarPart>
        )}

        {props.close && (
          <ToolbarPart>
            <Tooltip
              content={props.close.tooltip}
              size="sm"
              color="foreground"
              placement="left"
            >
              <Link
                href={props.close.href}
                color="foreground"
                className="hover:text-primary transition-all duration-300 ease-in-out"
              >
                <CloseIcon />
              </Link>
            </Tooltip>
          </ToolbarPart>
        )}
      </div>

      {props.persistentContent && (
        <div className="w-full pt-4">{props.persistentContent}</div>
      )}

      {props.menu && (
        <div className="relative">
          <div
            className={cn(
              "absolute h-4 w-4 bg-slate-300 transition-all duration-200 ease-in-out rotate-45",
              menuOpen ? "h-4 w-4 left-8 -top-2 opacity-100" : "h-0 w-0 left-8 top-0 opacity-0"
            )}
          ></div>
          <nav
            className={cn(
              "block w-full relative",
              menuOpen ? "max-h-[200px]" : "max-h-0",
              "overflow-hidden",
              "transition-all duration-300 ease-in-out"
            )}
          >
            <div className="p-6 bg-slate-300 flex w-full gap-4  h-full">
              {props.menu.map((link) => (
                <NavbarLink
                  key={link.href}
                  activeVariant={{
                    color: "primary",
                  }}
                  inactiveVariant={{
                    color: "foreground",
                  }}
                  {...link}
                  className="text-sm"
                  onClick={() => setMenuOpen(false)}
                ></NavbarLink>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
