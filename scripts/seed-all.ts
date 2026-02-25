import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scripts = [
    "seed-sigma-profil.ts",
    "seed-elektronik.ts",
    "seed-mekanik.ts",
    "seed-kizaklar-rulmanlar-vidali-miller.ts",
    "seed-cnc-router.ts",
    "seed-egitim.ts",
];

async function runScript(scriptName: string) {
    return new Promise<void>((resolve, reject) => {
        console.log(`\n🚀 Running ${scriptName}...`);
        const scriptPath = path.join(__dirname, scriptName);
        const child = spawn("npx", ["tsx", scriptPath], { stdio: "inherit" });

        child.on("close", (code) => {
            if (code === 0) {
                console.log(`✅ ${scriptName} completed.`);
                resolve();
            } else {
                console.error(`❌ ${scriptName} failed with code ${code}`);
                reject(new Error(`${scriptName} failed`));
            }
        });
    });
}

async function main() {
    console.log("🌟 Starting Master Seed Process...");

    for (const script of scripts) {
        try {
            await runScript(script);
        } catch (error) {
            console.error("🛑 Master seed stopped due to error.");
            process.exit(1);
        }
    }

    console.log("\n✨ ALL SEEDS COMPLETED SUCCESSFULLY! ✨\n");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
