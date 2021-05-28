import React, {useState} from 'react';
import {useRecoilValue, useSetRecoilState} from "recoil";
import {TableState, TableStateSelector} from "../../../core/states/column";
import {Button, ButtonStrip, Checkbox, Menu, Modal, ModalActions, ModalContent, ModalTitle,} from "@dhis2/ui";
import {confirmModalClose} from "../../../core/helpers/utils/utils";
import {Container, Grid} from "@material-ui/core";
import {setVisibility, updateVisibleColumns} from "../../../core/helpers/utils/table.utils";
import {useAlert} from "@dhis2/app-runtime";
import i18n from '@dhis2/d2-i18n'
function ColumnListTile({column, onChange}) {
    const {displayName = '', visible = false, name, mandatory} = column || {};
    const styles = {
        container: {
            padding: '10px 0'
        }
    }
    return (
        <div style={styles.container}>
            <Checkbox disabled={mandatory} value={visible} name={name} label={`${displayName}`} checked={visible}
                      onChange={onChange}/>
        </div>
    )
}

export default function ColumnManagerDialog({onClose}) {
    const setTables = useSetRecoilState(TableState);
    const tables = useRecoilValue(TableStateSelector);
    const [tempTables, setTempTables] = useState({...tables});
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))


    function onColumnVisibilityChange(value, column, tableName) {
        let modifiedTables = {...tempTables, [tableName]: setVisibility(value, tempTables[tableName], [column.name])};
        updateVisibleColumns(modifiedTables);
        setTempTables(modifiedTables);
    }

    function setAll(visible = true) {
        let modifiedTables = {};
        _.forIn(tempTables, (value, key) => {
            if (value.columns) {
                modifiedTables[key] = {
                    ...value,
                    columns: value.columns.map(column => !column.mandatory ? ({...column, visible}) : column)
                };
            }
        })
        updateVisibleColumns(modifiedTables);
        setTempTables({...modifiedTables});
    }

    function onCheckAll() {
        setAll(true);
    }

    function onUncheckAll() {
        setAll(false)
    }

    return (
        <Modal className="dialog-container" onClose={_ => confirmModalClose(onClose)}>
            <ModalTitle>{i18n.t('Choose columns to be displayed on the table')}</ModalTitle>
            <ModalContent>
                <Container>
                    <Grid container>
                        <Grid item xs={12}>
                            <ButtonStrip>
                                <Button onClick={onCheckAll}>{i18n.t('Check all')}</Button>
                                <Button onClick={onUncheckAll}>{i18n.t('Uncheck all')}</Button>
                            </ButtonStrip>
                        </Grid>
                        <Grid item xs={12}>
                            <Menu>
                                {
                                    _.map(_.keys(tempTables), (tableName) => _.map(tempTables[tableName]?.columns, (col) =>
                                        <ColumnListTile
                                            key={`${col.name}-manager`}
                                            column={col}
                                            onChange={value => onColumnVisibilityChange(value?.checked, col, tableName)}
                                        />
                                    ))
                                }
                            </Menu>
                        </Grid>
                    </Grid>
                </Container>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={_ => confirmModalClose(onClose)}>{i18n.t('Hide')}</Button>
                    <Button primary onClick={_ => {
                        setTables(tempTables);
                        show({message: i18n.t('Columns changed successfully'), type: {success: true}})
                        onClose();
                    }}>{i18n.t('Update')}</Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
