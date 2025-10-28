import path from "path";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";

const viteConfig = defineConfig(async (configEnv) => {
	const { mode } = configEnv;
	return {
		plugins: [svgrPlugin()],
		// In dev environments, don't clear the terminal after files update
		clearScreen: mode !== "development",
		// Use an import alias: import from '@/' anywhere instead of 'src/'
		resolve: { alias: { "@": path.resolve(__dirname, "src") } },
		// ...other config options here
	};
});

export default viteConfig;
