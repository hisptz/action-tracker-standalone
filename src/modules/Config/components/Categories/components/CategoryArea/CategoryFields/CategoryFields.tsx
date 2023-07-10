import React from "react";
import {useWatch} from "react-hook-form";
import {Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead} from "@dhis2/ui"
import {DataField} from "../../../../../../../shared/schemas/config";
import i18n from '@dhis2/d2-i18n';

export interface CategoryFieldsProps {
    namespace: string;
}

export function CategoryFields({namespace}: CategoryFieldsProps) {
    const fields: DataField[] = useWatch({
        name: `${namespace}.fields`
    });

    return (
        <div>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>{i18n.t("Name")}</TableCellHead>
                        <TableCellHead>{i18n.t("Type")}</TableCellHead>
                        <TableCellHead>{i18n.t("Required")}</TableCellHead>
                        <TableCellHead>{i18n.t("Show as column")}</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={index}>
                            <TableCell>{field.name}</TableCell>
                            <TableCell>{field.type}</TableCell>
                            <TableCell>{field.mandatory ? i18n.t("Yes") : i18n.t("No")}</TableCell>
                            <TableCell>{field.showAsColumn ? i18n.t("Yes") : i18n.t("No")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}
