import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = resolve(__dirname, '../.env.local');
  try {
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // fall back to existing env
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set');
  process.exit(1);
}

const packageSchema = new mongoose.Schema({}, { strict: false, collection: 'packages' });
const Package = mongoose.models.ClearFlagsPackage || mongoose.model('ClearFlagsPackage', packageSchema);

await mongoose.connect(uri);
const result = await Package.updateMany(
  {},
  {
    $set: {
      isFeaturedDestination: false,
      isPopularPackage: false,
      isFeaturedTrip: false,
      updatedAt: new Date(),
    },
  }
);

console.log(JSON.stringify({
  success: true,
  matchedCount: result.matchedCount,
  modifiedCount: result.modifiedCount,
}, null, 2));

await mongoose.disconnect();
