import { beginNextReel, loadProgram, markDriveVerified, recordFailure, selectNextReel } from "../lib/reelWorkflow";

const [command = "inspect", ...args] = process.argv.slice(2);
const rootDir = process.cwd();

if (command === "inspect") {
  const program = loadProgram(rootDir);
  console.log(JSON.stringify({ state: program.state, next: selectNextReel(program) }, null, 2));
} else if (command === "start") {
  console.log(JSON.stringify({ started: beginNextReel(rootDir) }, null, 2));
} else if (command === "fail") {
  const [stage, errorCategory, ...message] = args;
  if (!stage || !errorCategory || message.length === 0) throw new Error("Usage: fail <stage> <category> <message>");
  console.log(JSON.stringify(recordFailure(rootDir, stage as never, errorCategory, message.join(" ")), null, 2));
} else if (command === "verify") {
  const [videoFileId, metadataFileId, sha256] = args;
  console.log(JSON.stringify(markDriveVerified(rootDir, { videoFileId, metadataFileId, sha256 }), null, 2));
} else {
  throw new Error(`Unknown command: ${command}`);
}
