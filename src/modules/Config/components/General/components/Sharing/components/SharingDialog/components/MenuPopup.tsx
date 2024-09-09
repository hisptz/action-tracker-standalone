import { Layer, Popper, ReferenceElement } from "@dhis2/ui";
import React from "react";

export function MenuPopup({
	children,
	menuRef,
	onClose,
}: {
	children: React.ReactElement;
	menuRef: ReferenceElement;
	onClose: () => void;
}): React.ReactElement {
	const sameWidth = {
		name: "sameWidth",
		enabled: true,
		phase: "beforeWrite",
		requires: ["computeStyles"],
		fn: ({ state }: { state: any }) => {
			state.styles.popper.width = `${state.rects.reference.width}px`;
		},
		effect: ({ state }: { state: any }) => {
			state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
		},
	} as any;

	return (
		<Layer onClick={onClose}>
			<Popper
				modifiers={[
					sameWidth,
					{
						name: "offset",
						options: { offset: [0, 8] },
					},
				]}
				observePopperResize
				observeReferenceResize
				reference={menuRef}
				placement="bottom-start"
			>
				{children}
			</Popper>
		</Layer>
	);
}
