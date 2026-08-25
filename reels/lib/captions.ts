export type CaptionCue = {
  index: number;
  startMs: number;
  endMs: number;
  text: string;
};

function parseTimestamp(timestamp: string): number {
  const match = timestamp.trim().match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/);
  if (!match) throw new Error(`Invalid SRT timestamp: ${timestamp}`);
  const [, hours, minutes, seconds, milliseconds] = match;
  return (
    (Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds)) * 1000 +
    Number(milliseconds)
  );
}

export function parseSrt(source: string): CaptionCue[] {
  const blocks = source
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean);
  return blocks.map((block, fallbackIndex) => {
    const lines = block.split(/\r?\n/);
    const index = Number(lines[0]);
    const timing = lines[1]?.split("-->");
    if (!Number.isInteger(index) || !timing || timing.length !== 2)
      throw new Error(`Invalid SRT cue at block ${fallbackIndex + 1}`);
    const text = lines.slice(2).join("\n").trim();
    if (!text) throw new Error(`Caption cue ${index} has no text.`);
    return {
      index,
      startMs: parseTimestamp(timing[0]),
      endMs: parseTimestamp(timing[1]),
      text,
    };
  });
}

export function validateSrt(source: string, videoDurationMs?: number) {
  const cues = parseSrt(source);
  if (cues.length === 0)
    throw new Error("SRT must include at least one caption cue.");
  for (let position = 0; position < cues.length; position += 1) {
    const cue = cues[position];
    if (cue.endMs <= cue.startMs)
      throw new Error(`Caption cue ${cue.index} must end after it starts.`);
    if (!/[\u0900-\u097F]/.test(cue.text))
      throw new Error(
        `Caption cue ${cue.index} must include Devanagari/Hindi text.`
      );
    if (position > 0 && cue.startMs < cues[position - 1].endMs) {
      throw new Error(
        `Caption cue ${cue.index} overlaps cue ${cues[position - 1].index}.`
      );
    }
    if (videoDurationMs !== undefined && cue.endMs > videoDurationMs) {
      throw new Error(`Caption cue ${cue.index} exceeds the video duration.`);
    }
  }
  return { cueCount: cues.length, maxEndMs: cues.at(-1)!.endMs };
}
