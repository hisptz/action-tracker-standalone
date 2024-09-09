import { colors, spacers } from "@dhis2/ui";
import React from "react";

export function DestructiveSelectOption({
	label,
	onClick,
}: {
	label: string;
	onClick: () => void;
}): React.ReactElement {
	return (
		<div onClick={onClick}>
			{label}
			<style>{`
        div {
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
          color: ${colors.red700};
          padding: ${spacers.dp8} ${spacers.dp12};
        }

        div:hover {
          background-color: ${colors.red050};
        }
      `}</style>
		</div>
	);
}
