import { readFileSync, writeFileSync } from "node:fs";

const [inputPath, outputPath, factorArgument] = process.argv.slice(2);
const factor = Number(factorArgument);

if (!inputPath || !outputPath || !Number.isFinite(factor) || factor <= 0) {
  throw new Error(
    "Usage: node scale-srt-timings.mjs <input.srt> <output.srt> <positive-factor>"
  );
}

const toMilliseconds = timestamp => {
  const match = timestamp.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) throw new Error(`Invalid SRT timestamp: ${timestamp}`);
  const [, hours, minutes, seconds, milliseconds] = match;
  return (
    Number(hours) * 3_600_000 +
    Number(minutes) * 60_000 +
    Number(seconds) * 1_000 +
    Number(milliseconds)
  );
};

const toTimestamp = milliseconds => {
  const bounded = Math.max(0, Math.round(milliseconds));
  const hours = Math.floor(bounded / 3_600_000);
  const minutes = Math.floor((bounded % 3_600_000) / 60_000);
  const seconds = Math.floor((bounded % 60_000) / 1_000);
  const remainder = bounded % 1_000;
  return [hours, minutes, seconds]
    .map(value => String(value).padStart(2, "0"))
    .join(":")
    .concat(`,${String(remainder).padStart(3, "0")}`);
};

const content = readFileSync(inputPath, "utf8");
const scaled = content.replace(
  /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/gm,
  (_line, start, end) =>
    `${toTimestamp(toMilliseconds(start) / factor)} --> ${toTimestamp(toMilliseconds(end) / factor)}`
);

writeFileSync(outputPath, scaled);
