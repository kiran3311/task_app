import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
export const ChevronDownIcon = () => (
    <svg fill="none" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z" fill="currentColor" />
    </svg>
);
export default function ButtonDropdown({ labelsMap, defaultSelectedValue, handleUpdateItem, name, taskid, handleUpdateTaskAppDetails }: any) {
    const [selectedOption, setSelectedOption] = useState<any>(new Set([defaultSelectedValue]));
    const selectedOptionValue: any = Array.from(selectedOption)[0];
    useEffect(() => {
        setSelectedOption(new Set([defaultSelectedValue]))
    }, [defaultSelectedValue])
   
    // // Convert the Set to an Array and get the first value.
    const handlesetSelectedOption = (value: any) => {

        setSelectedOption(value)
        let selectedOptionValue: any = Array.from(value)[0];

        if (name === "clientid" || name == "projectid" || name === "taskdescriptionid" || name == "assigneeuserid" || name === "projectleaduserid" || name === "teamleaduserid" || name === "productid" || name === "moduleid") {
            selectedOptionValue = Number(selectedOptionValue)
        }

        handleUpdateItem(taskid, name, selectedOptionValue)

    }
    return (
        <ButtonGroup className="w-full  border border-slate-500 " variant="flat">
            <Button className="w-full">{labelsMap[selectedOptionValue]}</Button>
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <Button className="border border-y-0 border-r-0 border-slate-500 rounded-0" isIconOnly>
                        <ChevronDownIcon />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    disallowEmptySelection
                    aria-label="Merge options"
                    selectedKeys={selectedOption}
                    selectionMode="single"
                    onSelectionChange={handlesetSelectedOption}
                >
                    {Object.keys(labelsMap).map((key) => (
                        <DropdownItem key={key}>
                            {labelsMap[key]}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>

        </ButtonGroup>
    );
}
