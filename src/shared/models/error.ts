import { useNavigate } from "react-router-dom";

export interface ErrorAction {
	label: string | React.ReactElement;
	action: (callbacks: { navigate: ReturnType<typeof useNavigate> }) => void;
	primary?: boolean;
}

export class CustomError extends Error {
	actions?: ErrorAction[];
	icon?: React.JSXElementConstructor<{ color: string }>;

	constructor({
		message,
		name,
		actions,
		icon,
	}: {
		message: string;
		actions?: ErrorAction[];
		name: string;
		icon?: React.JSXElementConstructor<{ color: string }>;
	}) {
		super(message);
		this.name = name;
		this.actions = actions;
		this.icon = icon;
	}
}
