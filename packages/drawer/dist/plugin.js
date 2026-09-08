import { access as e, cp as t, mkdir as n } from "node:fs/promises";
import { dirname as r, resolve as i } from "node:path";
import { fileURLToPath as a } from "node:url";
//#region src/plugin.ts
var o = a(import.meta.url), s = r(o);
async function c(t) {
	try {
		return await e(t), !0;
	} catch {
		return !1;
	}
}
function l() {
	return {
		name: "vite-plugin-cinq-drawer",
		async buildStart() {
			let e = i(s, "../src/drawer.html.liquid"), a = i(process.cwd(), "snippets/cinq-drawer.html.liquid");
			try {
				await c(e) && (await n(r(a), { recursive: !0 }), await t(e, a), console.log("✅ CINQ : Liquid snippet copied."));
			} catch (e) {
				console.error("❌ CINQ : Copying error :", e);
			}
		},
		async handleHotUpdate({ file: e, server: n }) {
			if (e.endsWith("drawer.html.liquid")) {
				let r = i(process.cwd(), "snippets/cinq-drawer.html.liquid");
				await t(e, r), n.ws.send({ type: "full-reload" });
			}
		}
	};
}
//#endregion
export { l as cinqDrawerPlugin };
