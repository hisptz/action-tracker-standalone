import { Step } from 'intro.js-react'
import React from 'react'
import i18n from '@dhis2/d2-i18n'

export const CategoriesSteps: Step[] = [
    {

        title: i18n.t('Categories'),
        intro: <div>
            <p>{i18n.t('Categories are a way to group activities/actions. The action tracker allows you to group or categorize activities in up to 3 levels.')}</p>
            <p>{i18n.t('With each category level you can define what data to be collected by managing the fields for the category.')}</p>
        </div>
    },
    {
        element: '.category-name-field-container:nth-child(1)',
        intro: <>
            <p>{i18n.t('You can modify the category name by editing this field. This name will appear on the button to add values for this specific categories')}</p>
        </>
    },
    {
        element: '.category-field-table-container',
        intro: <>
            <p>{i18n.t('Here you can define what information to collect for this category. Each of the field defined here will appear in the data entry form of this category. Currently supported field types include text, long text, number, and date')}</p>
        </>
    },
    {
        element: 'td[data-test=\'field-table-action\']',
        intro: <>
            <p>{i18n.t('You can edit and delete fields here.')}</p>
        </>
    },
    {
        element: 'div[data-test=\'field-add-button\']',
        intro: <>
            <p>{i18n.t('You can add a new field by clicking here. There are 2 ways to add a field. You can select an existing field (from DHIS2 metadata) or you can add a completely new field.')}</p>
        </>
    }
]

export const ExistingMetadataSteps: Step[] = [
    {
        element: 'div[data-test=\'data-item-select-container\']',
        intro: <>
            <p>{i18n.t('You can select an existing data item from this list. For the first category, these will be tracked entity attributes. For all following categories these will be data elements.')}</p>
            <p>{i18n.t('When selected, this data item metadata will be modified to match other standalone action tracker metadata. This may affect how this data item is used in other programs. We recommend you create a new data item if you are not sure of the data item\'s usage. ')}</p>
        </>
    },
    {
        element: 'div[data-test=\'mandatory-check-container\']',
        intro: <>
            {i18n.t('Checking this will make it mandatory in the data entry form for this category')}
        </>
    },
    {
        element: 'div[data-test=\'show-in-table-container\']',
        intro: <>
            <p>{i18n.t('Checking this will enable this field to appear as a card header for the first category and as a column in the planning table for the other categories. ')}</p>
        </>
    },
    {
        element: 'button[data-test=\'cancel-data-item-select-btn\']',

        intro: <>
            <p>{i18n.t('You can click cancel to ignore changes')}</p>
        </>
    },
    {
        element: 'button[data-test=\'add-data-item-select-btn\']',

        intro: <>
            <p>{i18n.t('When done you can click on add to add the field')}</p>
        </>
    }
]

export const NewDataItemSteps: Step[] = [
    {
        intro: <>
            <p>{i18n.t('This form allows you to create a new field. Fields marked with * are mandatory')}</p>
        </>
    },
    {
        element: '.display-name-config-container',
        intro: <>
            <p>{i18n.t('This is the name of the field in the form. It will also be the column name if the field is set to show in column')}</p>
        </>
    },
    {
        element: '.short-name-config-container',
        intro: <>
            <p>{i18n.t('This is a shorter version of the name. It should not exceed 50 characters.')}</p>
        </>
    },
    {
        element: '.type-config-container',
        intro: <>
            <p>{i18n.t('Here you can select the type of data this field should hold. Currently, supported field types include text, long text, number, and date. A file resource field is also supported for action status only.')}</p>
        </>
    },
    {
        element: '.mandatory-check-container',
        intro: <>
            {i18n.t('Checking this will make it mandatory in the data entry form for this category')}
        </>
    },
    {
        element: '.show-in-column-field',
        intro: <>
            <p>{i18n.t('Checking this will enable this field to appear as a card header for the first category and as a column in the planning table for the other categories. ')}</p>
        </>
    },
    {
        element: 'button[data-test=\'cancel-data-item-btn\']',

        intro: <>
            <p>{i18n.t('You can click cancel to ignore changes')}</p>
        </>
    },
    {
        element: 'button[data-test=\'add-data-item-btn\']',

        intro: <>
            <p>{i18n.t('When done you can click on add to add the field')}</p>
        </>
    }
]
