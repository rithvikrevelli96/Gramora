import fs from "fs";
import path from "path";

const envPath = path.resolve("./.env");
if (!fs.existsSync(envPath)) {
    console.error("ERROR: .env file not found at", envPath);
    process.exit(2);
}

const raw = fs.readFileSync(envPath, "utf8");
const lines = raw.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));

const map = new Map();
const unparsable = [];
for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx === -1) {
        unparsable.push(line);
        continue;
    }
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    const arr = map.get(key) || [];
    arr.push(val);
    map.set(key, arr);
}

let errors = 0;
let warnings = 0;

console.log("=== .env validation ===");
if (unparsable.length) {
    console.error("Unparsable lines:", unparsable);
    errors++;
}

const required = [
    "PORT",
    "GEMINI_API_KEY",
    "INSTAGRAM_ACCESS_TOKEN",
    "INSTAGRAM_ACCOUNT_ID",
    "INSTAGRAM_BUSINESS_ID",
    "INSTAGRAM_APP_ID",
    "INSTAGRAM_USER_ID",
    "INSTAGRAM_TOKEN_EXPIRY",
    "INSTAGRAM_SCOPES",
    "MONGODB_URI",
];

for (const k of required) {
    if (!map.has(k)) {
        console.error("Missing required key:", k);
        errors++;
    }
}

// duplicate keys
for (const [k, vals] of map.entries()) {
    if (vals.length > 1) {
        console.warn("Duplicate key found:", k, `(${vals.length} entries)`);
        warnings++;
    }
}

// PORT check
if (map.has("PORT")) {
    const p = parseInt(map.get("PORT")[0], 10);
    if (!Number.isInteger(p) || p < 1 || p > 65535) {
        console.error("Invalid PORT value:", map.get("PORT")[0]);
        errors++;
    } else {
        console.log("PORT ok:", p);
    }
}

// MONGODB_URI check
if (map.has("MONGODB_URI")) {
    const uri = map.get("MONGODB_URI")[0];
    if (!/^mongodb(\+srv)?:\/\//i.test(uri)) {
        console.error("MONGODB_URI does not start with mongodb:// or mongodb+srv://");
        errors++;
    } else {
        console.log("MONGODB_URI looks OK (not printing secret).");
    }
}

// INSTAGRAM_TOKEN_EXPIRY check
if (map.has("INSTAGRAM_TOKEN_EXPIRY")) {
    const d = Date.parse(map.get("INSTAGRAM_TOKEN_EXPIRY")[0]);
    if (Number.isNaN(d)) {
        console.error("INSTAGRAM_TOKEN_EXPIRY is not a valid date:", map.get("INSTAGRAM_TOKEN_EXPIRY")[0]);
        errors++;
    } else {
        console.log("INSTAGRAM_TOKEN_EXPIRY parseable.");
    }
}

// INSTAGRAM_SCOPES check
if (map.has("INSTAGRAM_SCOPES")) {
    const scopes = map.get("INSTAGRAM_SCOPES")[0].split(",").map((s) => s.trim()).filter(Boolean);
    if (scopes.length === 0) {
        console.error("INSTAGRAM_SCOPES is empty or malformed.");
        errors++;
    } else {
        console.log("INSTAGRAM_SCOPES count:", scopes.length);
    }
}

// report secret presence (no values)
const secretKeys = ["GEMINI_API_KEY", "INSTAGRAM_ACCESS_TOKEN", "MONGODB_URI"];
for (const k of secretKeys) {
    if (map.has(k)) {
        console.log(`${k} present, length=${map.get(k)[0].length} (value not shown)`);
    }
}

console.log(`\nSummary: errors=${errors}, warnings=${warnings}`);
if (errors > 0) {
    console.error("Validation failed. Fix the errors above.");
    process.exit(1);
}
console.log("Validation passed.");
process.exit(0);