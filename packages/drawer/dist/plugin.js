import t from "fs-extra";
import { dirname as o, resolve as n } from "node:path";
import { fileURLToPath as a } from "node:url";
const s = a(import.meta.url), c = o(s);
function m() {
  return {
    name: "vite-plugin-cinq-drawer",
    async buildStart() {
      const i = n(c, "../src/drawer.html.liquid"), r = n(process.cwd(), "snippets/cinq-drawer.html.liquid");
      try {
        await t.pathExists(i) && (await t.ensureDir(o(r)), await t.copy(i, r), console.log("✅ CINQ : Liquid snippet copied."));
      } catch (e) {
        console.error("❌ CINQ : Copying error :", e);
      }
    },
    async handleHotUpdate({ file: i, server: r }) {
      if (i.endsWith("drawer.html.liquid")) {
        const e = n(process.cwd(), "snippets/cinq-drawer.html.liquid");
        await t.copy(i, e), r.ws.send({ type: "full-reload" });
      }
    }
  };
}
export {
  m as cinqDrawerPlugin
};
