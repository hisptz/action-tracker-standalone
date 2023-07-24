import React, {useMemo} from "react";
import {useController} from "react-hook-form";
import {
		DropdownButton,
		FlyoutMenu,
		MenuItem,
		Table,
		TableBody,
		TableCell,
		TableCellHead,
		TableHead,
		TableRow,
		TableRowHead
} from "@dhis2/ui"
import i18n from '@dhis2/d2-i18n';
import {useBoolean} from "usehooks-ts";
import {capitalize} from "lodash";
import {DataItemManageForm} from "./DataItemManageForm";
import {DataItemSelect} from "./DataItemSelect";
import {DataField} from "../schemas/config";

export interface FieldTableProps {
		namespace: string;
		type: "dataElement" | "attribute"
}

export function FieldTable({namespace, type}: FieldTableProps) {
		const {value: menuOpen, setFalse: closeMenu, toggle: toggleMenu} = useBoolean(false);
		const {value: hideSelect, setTrue: onHideSelect, setFalse: onShowSelect} = useBoolean(true);
		const {value: hideCreate, setTrue: onHideCreate, setFalse: onShowCreate} = useBoolean(true);
		const {field} = useController({
				name: `${namespace}.fields`
		});
		const fields = useMemo(() => field.value as DataField[] ?? [], [field])
		const fieldIds = useMemo(() => fields.map(({id}) => id), [fields])
		const onMenuSelect = (type: "new" | "existing") => () => {
				closeMenu();
        if (type === "existing") {
            onShowSelect();
        } else {
            onShowCreate()
        }
    }

    const onFieldAdd = (newField: DataField) => {
        field.onChange([...field.value, newField])
    }

    return (
        <>
            <DataItemManageForm hide={hideCreate} type={type} onClose={onHideCreate} onAdd={onFieldAdd}/>
            <DataItemSelect onAdd={onFieldAdd} key={`${namespace}-select-field`} filtered={fieldIds} type={type}
                            hide={hideSelect}
                            onClose={onHideSelect}/>
            <div className="column gap-16">
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t("Name")}</TableCellHead>
                            <TableCellHead>{i18n.t("Type")}</TableCellHead>
                            <TableCellHead>{i18n.t("Required")}</TableCellHead>
                            <TableCellHead>{i18n.t("Show as {{ type }}")}</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={index}>
                                <TableCell>{field.name}</TableCell>
                                <TableCell>{capitalize(field.type.replaceAll(/_/g, " "))}</TableCell>
                                <TableCell>{field.mandatory ? i18n.t("Yes") : i18n.t("No")}</TableCell>
                                <TableCell>{field.showAsColumn ? i18n.t("Yes") : i18n.t("No")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{justifyContent: "flex-end"}} className="row">
                    <DropdownButton
                        open={menuOpen} onClick={toggleMenu}
                        component={
                            <FlyoutMenu>
                                <MenuItem onClick={onMenuSelect("existing")}
                                          label={i18n.t("Add field from existing metadata")}/>
                                <MenuItem onClick={onMenuSelect("new")} label={i18n.t("Add new field")}/>

                            </FlyoutMenu>
                        }
                    >{i18n.t("Add field")}
                    </DropdownButton>
                </div>
            </div>
        </>
    )
}
