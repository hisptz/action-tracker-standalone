import {chunk, head} from "lodash";
import {Box, Chip, CircularLoader, Tooltip} from "@dhis2/ui";
import React from "react";
import i18n from '@dhis2/d2-i18n';
import classes from "../DimensionFilterArea.module.css";

export interface DimensionSelectionProps {
    selectedItems: any[];
    onClick: () => void;
    title: string;
    loading?: boolean;
}

const ITEM_DISPLAY_NO = 1;


export function DimensionSelection({
                                       onClick,
                                       title,
                                       selectedItems = [],
                                       loading,
                                       ...props
                                   }: DimensionSelectionProps) {

    const itemsToDisplay = head(chunk(selectedItems, ITEM_DISPLAY_NO));

    return (
        <div onClick={onClick}>
            <Tooltip
                content={
                    <div>
                        {selectedItems?.map(({name, displayName, id}) => (
                            <p style={{margin: 4}} key={`${id}-tooltip`}>
                                {name ?? displayName}
                            </p>
                        ))}
                    </div>
                }
            >
                <Box className={classes['selection-box']} {...props}>
                    <p className={classes['selection-box-header']}>{title}</p>
                    <Box className={classes['selection-text-box']} width="90%" height="40%">
                        {
                            loading ? <CircularLoader tiny/> : <>
                                {itemsToDisplay?.map(({name, displayName, id}) => (
                                    <Chip key={id}>{name ?? displayName}</Chip>
                                ))}
                                {selectedItems?.length > ITEM_DISPLAY_NO && (
                                    <Chip>
                                        {i18n.t(`and {{number}} more`, {
                                            number: selectedItems.length - ITEM_DISPLAY_NO,
                                        })}
                                    </Chip>
                                )}
                            </>
                        }
                    </Box>
                </Box>
            </Tooltip>
        </div>
    );
}
