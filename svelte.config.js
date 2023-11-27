import adapter from "@sveltejs/adapter-netlify";
import svelte_preprocess from "svelte-preprocess";

const config = {
    kit: {
        adapter: adapter({
            edge: true,
        }),
        alias: {
            $static: "./static",
            $routes: "./src/routes",
            $fn: "./src/lib/functions",
            $comp: "./src/lib/components",
            $docs: "./src/lib/docs",
            $cfg: "./src/lib/configs",
            $corecomp: "./src/lib/core_components",
        },
    },
    vitePlugin: { inspector: true },
    onwarn: (warning, handler) => {
        if (warning.code.startsWith("a11y-")) return;
        handler(warning);
    },
    preprocess: [
        svelte_preprocess({
            scss: {
                prependData: `
				@import 'src/styles/var.scss';
				`,
            },
        }),
    ],
};

export default config;
