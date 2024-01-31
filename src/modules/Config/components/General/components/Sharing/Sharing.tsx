import { Button } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { SharingDialog } from './components/SharingDialog/SharingDialog'
import './sharing.css'

export function Sharing() {
	const { show } = useDilog();

	const onShowClick = () => {
		show({
			title: i18n.t("'Configure sharing',
			content: <SharingDialog />,
			position: 'middle',
			size: 'large',
		})
	}

	return (
		<>
			<div className="column gap-8">
				<span>
					{i18n.t(
						'Configure who can access this configuration and metadata associated',
					)}
				</span>
				<div>
					<Button onClick={onShowClick}>
						{i18n.t('Configure sharing')}
					</Button>
				</div>
			</div>
		</>
	)
}
