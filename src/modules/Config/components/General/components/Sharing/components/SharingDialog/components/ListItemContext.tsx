import { colors } from "@dhis2/ui";
import React from "react";

export default function ListItemContext({
	access,
}: {
	access: any;
}): React.ReactElement {
	return (
		<p>
			{access}
			<style>{`
        p {
          font-size: 14px;
          color: ${colors.grey700};
          margin: 6px 0 0 0;
          padding: 0;
        }
      `}</style>
		</p>
	);
}
