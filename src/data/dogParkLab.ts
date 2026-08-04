import { chance, createRng, hashString, intRange, pick, pickN, type Rng } from "@/lib/seeded";

export type ExperimentStatus =
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "CLASSIFIED"
  | "TEMPORARY";

export type StampKind =
  | "APPROVED"
  | "FAILED"
  | "TESTED"
  | "VERIFIED"
  | "DOG SAFE"
  | "EXPERIMENTAL"
  | "CLASSIFIED"
  | "CONFIDENTIAL"
  | "TEMPORARY RESULT";

export interface ExperimentTemplate {
  id: string;
  status: ExperimentStatus;
  result: string;
  resultKind: "percent" | "text" | "failed";
  sideEffect: string;
  observation: string;
  note: string;
}

export interface DogProfile {
  label: string;
  trait: string;
  traitValue: string;
  likes: string;
  mood: string;
  treatDetected: boolean;
}

export interface ArchiveCard {
  id: string;
  result: string;
  breed: string;
  popularity: string;
  sideEffect: string;
  photoHue: number;
}

export interface Experiment {
  seed: number;
  experimentNo: string;
  status: ExperimentStatus;
  result: string;
  resultKind: "percent" | "text" | "failed";
  percentValue: number | null;
  sideEffect: string;
  observation: string;
  note: string;
  observations: string[];
  warnings: string[];
  stamps: { kind: StampKind; x: number; y: number; rot: number; opacity: number }[];
  dogs: [DogProfile, DogProfile];
  operator: string;
  location: string;
  version: string;
  dateLabel: string;
  microEvent: null | { type: "DOG DETECTED" | "SYSTEM ERROR" | "UNKNOWN BREED"; delayMs: number };
  archive: ArchiveCard[];
}

/** 60+ experiment templates — fake public / research campaign copy. */
export const EXPERIMENT_TEMPLATES: readonly ExperimentTemplate[] = [
  { id: "t01", status: "SUCCESS", resultKind: "percent", result: "327%", sideEffect: "Strangers started conversations", observation: "Subject carried chicken jerky.", note: "Within expected sociability band." },
  { id: "t02", status: "RUNNING", resultKind: "percent", result: "412%", sideEffect: "Owner became unexpectedly popular", observation: "Nearby dogs increased.", note: "Attraction curve still climbing." },
  { id: "t03", status: "FAILED", resultKind: "failed", result: "FAILED", sideEffect: "Too many dogs detected", observation: "Snack visibility critical.", note: "Abort recommended." },
  { id: "t04", status: "SUCCESS", resultKind: "text", result: "Owner became unexpectedly popular", sideEffect: "Neighbour's dog refused to leave", observation: "Owner smiled.", note: "Social spillover confirmed." },
  { id: "t05", status: "TEMPORARY", resultKind: "text", result: "Neighbour's dog refused to leave", sideEffect: "Unexpected conversation detected", observation: "A Corgi followed for 18 minutes.", note: "Temporary attachment loop." },
  { id: "t06", status: "SUCCESS", resultKind: "text", result: "Strangers started conversations", sideEffect: "Another owner requested product information", observation: "Unexpected conversation detected.", note: "Snack as social protocol." },
  { id: "t07", status: "RUNNING", resultKind: "percent", result: "289%", sideEffect: "Golden Retriever queue formed", observation: "One Golden Retriever refused to leave.", note: "Queue length: unknown." },
  { id: "t08", status: "CLASSIFIED", resultKind: "text", result: "CLASSIFIED", sideEffect: "Data sealed by Dog Unit", observation: "Operator smiled without explanation.", note: "Do not publish." },
  { id: "t09", status: "SUCCESS", resultKind: "percent", result: "341%", sideEffect: "Park density +2 dogs/min", observation: "Treat aroma detected at 12m.", note: "Wind bias: mild." },
  { id: "t10", status: "FAILED", resultKind: "failed", result: "EXPERIMENT FAILED", sideEffect: "Subject ran out of jerky", observation: "No injuries reported.", note: "Restock protocol triggered." },
  { id: "t11", status: "RUNNING", resultKind: "percent", result: "318%", sideEffect: "Tail wag frequency elevated", observation: "Subject A stared at bag.", note: "Hunger index rising." },
  { id: "t12", status: "SUCCESS", resultKind: "percent", result: "405%", sideEffect: "Phone numbers exchanged nearby", observation: "Another owner requested product information.", note: "Human networking event." },
  { id: "t13", status: "TEMPORARY", resultKind: "percent", result: "999%", sideEffect: "Sensor overflow", observation: "Too many Labradors nearby.", note: "Number may be theatrical." },
  { id: "t14", status: "SUCCESS", resultKind: "text", result: "DOG DETECTED", sideEffect: "Attraction exceeds normal range", observation: "Subject B circled twice.", note: "Detection confident." },
  { id: "t15", status: "RUNNING", resultKind: "percent", result: "276%", sideEffect: "Picnic table claimed", observation: "Owner shared one strip.", note: "Fairness module online." },
  { id: "t16", status: "FAILED", resultKind: "failed", result: "FAILED", sideEffect: "Unknown breed interference", observation: "UNKNOWN BREED flashed once.", note: "Reclassify later." },
  { id: "t17", status: "SUCCESS", resultKind: "percent", result: "356%", sideEffect: "Compliments received: 7", observation: "Owner posture improved.", note: "Confidence transfer observed." },
  { id: "t18", status: "CLASSIFIED", resultKind: "percent", result: "327%", sideEffect: "Redacted side effect", observation: "Microphone muted itself.", note: "Classified for comedy." },
  { id: "t19", status: "RUNNING", resultKind: "text", result: "Calibrating dogs…", sideEffect: "Waiting for more subjects", observation: "Park quiet for 9 seconds.", note: "Idle but hopeful." },
  { id: "t20", status: "SUCCESS", resultKind: "percent", result: "388%", sideEffect: "Corgi convoy assembled", observation: "A Corgi followed for 18 minutes.", note: "Short legs, long loyalty." },
  { id: "t21", status: "TEMPORARY", resultKind: "percent", result: "301%", sideEffect: "Snack visibility critical", observation: "Bag held higher than usual.", note: "Visibility = destiny." },
  { id: "t22", status: "SUCCESS", resultKind: "text", result: "Conversation unlocked", sideEffect: "Strangers discussed breeds", observation: "Unexpected conversation detected.", note: "Protocol: jerky diplomacy." },
  { id: "t23", status: "FAILED", resultKind: "failed", result: "FAILED", sideEffect: "Dog attraction exceeds normal range", observation: "Subject lost grip on leash briefly.", note: "No injuries reported." },
  { id: "t24", status: "RUNNING", resultKind: "percent", result: "334%", sideEffect: "Shadow dog detected", observation: "Something barked behind the CRT.", note: "Hardware empathy rising." },
  { id: "t25", status: "SUCCESS", resultKind: "percent", result: "420%", sideEffect: "Meme potential confirmed", observation: "Owner took a photo of the bag.", note: "Internet awaits." },
  { id: "t26", status: "SUCCESS", resultKind: "text", result: "Neighbour became a regular", sideEffect: "Fence conversations increased", observation: "Neighbour waved twice.", note: "Local network formed." },
  { id: "t27", status: "TEMPORARY", resultKind: "percent", result: "259%", sideEffect: "Treat detected: YES", observation: "Subject B sniffed air.", note: "Nose calibration OK." },
  { id: "t28", status: "CLASSIFIED", resultKind: "text", result: "SEE APPENDIX", sideEffect: "Appendix missing", observation: "Clipboard empty.", note: "Bureaucracy wins." },
  { id: "t29", status: "RUNNING", resultKind: "percent", result: "367%", sideEffect: "Park entry rate +14%", observation: "Gate opened more often.", note: "Foot traffic ≠ paw traffic." },
  { id: "t30", status: "SUCCESS", resultKind: "percent", result: "345%", sideEffect: "Owner reported feeling lucky", observation: "Owner smiled.", note: "Luck not peer-reviewed." },
  { id: "t31", status: "FAILED", resultKind: "failed", result: "EXPERIMENT FAILED", sideEffect: "Too many Labradors nearby", observation: "Labradors exceeded soft limit.", note: "Soft limit was emotional." },
  { id: "t32", status: "SUCCESS", resultKind: "text", result: "Public experiment approved", sideEffect: "Stamp applied: APPROVED", observation: "Rubber stamp sound imagined.", note: "Valid until sundown." },
  { id: "t33", status: "RUNNING", resultKind: "percent", result: "312%", sideEffect: "CRT flicker synced to tails", observation: "Monitor hummed in G major.", note: "Hardware folklore." },
  { id: "t34", status: "TEMPORARY", resultKind: "text", result: "Result pending sunset", sideEffect: "Light conditions unstable", observation: "Yellow grid glowed harder.", note: "Wait for night market hour." },
  { id: "t35", status: "SUCCESS", resultKind: "percent", result: "399%", sideEffect: "Vendor asked for samples", observation: "Night market energy detected.", note: "Taiwan protocol online." },
  { id: "t36", status: "SUCCESS", resultKind: "percent", result: "273%", sideEffect: "Quiet success", observation: "No drama. Only dogs.", note: "Boring is good science." },
  { id: "t37", status: "FAILED", resultKind: "failed", result: "FAILED", sideEffect: "Bag fell (caught)", observation: "Reflexes: adequate.", note: "Jerky survived." },
  { id: "t38", status: "RUNNING", resultKind: "percent", result: "350%", sideEffect: "Eye contact with strangers", observation: "Human social graph expanding.", note: "Dogs as routers." },
  { id: "t39", status: "CLASSIFIED", resultKind: "percent", result: "000%", sideEffect: "Null result sealed", observation: "Sensors returned poetry.", note: "Ignore poetry." },
  { id: "t40", status: "SUCCESS", resultKind: "text", result: "Snack diplomacy achieved", sideEffect: "Three owners introduced dogs", observation: "Names exchanged.", note: "Civil society + jerky." },
  { id: "t41", status: "TEMPORARY", resultKind: "percent", result: "428%", sideEffect: "Overperformance warning", observation: "Attraction exceeds normal range.", note: "Cooling period advised." },
  { id: "t42", status: "RUNNING", resultKind: "percent", result: "295%", sideEffect: "Waiting for more Golden Retrievers", observation: "Park breed mix shifting.", note: "Recruitment organic." },
  { id: "t43", status: "SUCCESS", resultKind: "percent", result: "371%", sideEffect: "Dog Unit applauded silently", observation: "Operator nodded once.", note: "Praise withheld for science." },
  { id: "t44", status: "FAILED", resultKind: "failed", result: "FAILED", sideEffect: "Experiment interrupted by rain", observation: "Bag remained dry somehow.", note: "Miracles not funded." },
  { id: "t45", status: "SUCCESS", resultKind: "text", result: "Archive entry created", sideEffect: "Future visitors will see this", observation: "Logging complete.", note: "History is a joke we keep." },
  { id: "t46", status: "RUNNING", resultKind: "percent", result: "333%", sideEffect: "Repeating digits anomaly", observation: "Subjects tilted heads.", note: "Aesthetic coincidence." },
  { id: "t47", status: "TEMPORARY", resultKind: "text", result: "DOG PARK LAB ONLINE", sideEffect: "Public portal exposed", observation: "Visitor arrived.", note: "You are part of the sample." },
  { id: "t48", status: "SUCCESS", resultKind: "percent", result: "360%", sideEffect: "Treat sharing cascade", observation: "Subject shared with Subject B.", note: "Altruism: accidental." },
  { id: "t49", status: "CLASSIFIED", resultKind: "text", result: "[REDACTED]", sideEffect: "[REDACTED]", observation: "[REDACTED]", note: "Redaction is the point." },
  { id: "t50", status: "RUNNING", resultKind: "percent", result: "308%", sideEffect: "Keyboard clicks from nowhere", observation: "Old internet waking up.", note: "Y2K ghost process." },
  { id: "t51", status: "SUCCESS", resultKind: "percent", result: "382%", sideEffect: "Owner booked another visit", observation: "Return probability high.", note: "Loyalty loop installed." },
  { id: "t52", status: "FAILED", resultKind: "failed", result: "EXPERIMENT FAILED", sideEffect: "Snack visibility critical", observation: "Bag hidden in backpack.", note: "Visibility restored later." },
  { id: "t53", status: "SUCCESS", resultKind: "text", result: "Public trust +1", sideEffect: "Someone said '可愛'", observation: "Language: Traditional Chinese.", note: "Local dialect preferred." },
  { id: "t54", status: "TEMPORARY", resultKind: "percent", result: "444%", sideEffect: "Lucky number bias", observation: "Subjects barked in 4s.", note: "Numerology not scientific." },
  { id: "t55", status: "RUNNING", resultKind: "percent", result: "329%", sideEffect: "Almost the poster number", observation: "Poster hummed softly.", note: "Reality syncing." },
  { id: "t56", status: "SUCCESS", resultKind: "percent", result: "415%", sideEffect: "LINE requests increased", observation: "Someone asked for @FURMOSA.", note: "Commerce as side effect." },
  { id: "t57", status: "CLASSIFIED", resultKind: "failed", result: "FAILED / CLASSIFIED", sideEffect: "Dual-state paradox", observation: "Status bar flickered.", note: "Both true somehow." },
  { id: "t58", status: "SUCCESS", resultKind: "text", result: "Museum mode engaged", observation: "Visitors whispered.", note: "Exhibit feels abandoned on purpose.", sideEffect: "No shop UI detected" },
  { id: "t59", status: "RUNNING", resultKind: "percent", result: "287%", sideEffect: "Slow day, honest data", observation: "Fewer dogs, clearer signal.", note: "Quiet parks still count." },
  { id: "t60", status: "SUCCESS", resultKind: "percent", result: "392%", sideEffect: "Experiment self-congratulated", observation: "System wrote 'good dog'.", note: "Praise loop closed." },
  { id: "t61", status: "TEMPORARY", resultKind: "text", result: "Night market spillover", sideEffect: "Smell traveled farther than predicted", observation: "Vendors looked over.", note: "Urban ecology note." },
  { id: "t62", status: "FAILED", resultKind: "failed", result: "FAILED", sideEffect: "Operator lost clipboard", observation: "Clipboard found under CRT.", note: "Hardware ate paperwork." },
  { id: "t63", status: "SUCCESS", resultKind: "percent", result: "364%", sideEffect: "Breed diversity bonus", observation: "Seven breeds in frame.", note: "Diversity metric: vibes." },
  { id: "t64", status: "RUNNING", resultKind: "percent", result: "321%", sideEffect: "Almost classic", observation: "Poster percentage argued back.", note: "Do not argue with poster." },
] as const;

const OBSERVATION_POOL = [
  "Subject carried chicken jerky.",
  "Nearby dogs increased.",
  "Owner smiled.",
  "Unexpected conversation detected.",
  "Another owner requested product information.",
  "One Golden Retriever refused to leave.",
  "A Corgi followed for 18 minutes.",
  "No injuries reported.",
  "Treat aroma detected at 12m.",
  "Tail wag frequency elevated.",
  "Subject A stared at bag.",
  "Subject B circled twice.",
  "Gate opened more often.",
  "Owner posture improved.",
  "Phone numbers exchanged nearby.",
  "Someone whispered 壕大大.",
  "CRT monitor flickered once.",
  "Yellow grid felt warmer.",
  "A stranger asked for the LINE.",
  "Park bench conversation lasted 4 minutes.",
] as const;

const WARNING_POOL = [
  "WARNING — Too many Labradors nearby",
  "WARNING — Dog attraction exceeds normal range",
  "WARNING — Snack visibility critical",
  "WARNING — Unexpected popularity detected",
  "WARNING — Treat density above threshold",
  "WARNING — Social spillover risk",
  "WARNING — Unknown breed in perimeter",
  "WARNING — Operator clipboard unstable",
] as const;

const STAMP_POOL: readonly StampKind[] = [
  "APPROVED",
  "FAILED",
  "TESTED",
  "VERIFIED",
  "DOG SAFE",
  "EXPERIMENTAL",
  "CLASSIFIED",
  "CONFIDENTIAL",
  "TEMPORARY RESULT",
];

const BREEDS = [
  "Golden Retriever",
  "Corgi",
  "Labrador",
  "Shiba",
  "Poodle",
  "Beagle",
  "Husky",
  "Taiwan Dog",
  "Schnauzer",
  "Mixed / Unknown",
] as const;

const OPERATORS = [
  "DOG UNIT 01",
  "DOG UNIT 04",
  "DOG UNIT 07",
  "DOG UNIT 12",
  "FIELD OPS B",
  "NIGHT MARKET DESK",
] as const;

const LOCATIONS = [
  "Taipei Dog Park",
  "Da'an Dog Area",
  "Riverside Temporary Yard",
  "Night Market Perimeter",
  "Classified Municipal Park",
  "Experimental Lawn #3",
] as const;

const MOODS = ["Hungry", "Curious", "Social", "Suspicious", "Joyful", "Plotting"] as const;
const LIKES = [
  "Golden Retrievers",
  "Corgis",
  "Chicken jerky",
  "Strangers with bags",
  "CRT glow",
  "Yellow grids",
] as const;

function parsePercent(raw: string): number | null {
  const m = raw.match(/(\d+)\s*%/);
  return m ? Number(m[1]) : null;
}

function makeDog(rng: Rng, label: string): DogProfile {
  return {
    label,
    trait: pick(rng, ["Confidence", "Social", "Focus", "Charm", "Chaos"]),
    traitValue: `${intRange(rng, 61, 99)}%`,
    likes: pick(rng, LIKES),
    mood: pick(rng, MOODS),
    treatDetected: chance(rng, 0.72),
  };
}

function makeArchive(rng: Rng, count: number): ArchiveCard[] {
  return Array.from({ length: count }, (_, i) => {
    const pct = intRange(rng, 180, 999);
    return {
      id: `ARC-${String(intRange(rng, 1, 9999)).padStart(4, "0")}-${i}`,
      result: chance(rng, 0.18) ? pick(rng, ["FAILED", "CLASSIFIED", "PENDING"]) : `${pct}%`,
      breed: pick(rng, BREEDS),
      popularity: pick(rng, ["LOW", "MED", "HIGH", "UNSAFE", "UNKNOWN"]),
      sideEffect: pick(rng, [
        "Conversation started",
        "Dog refused to leave",
        "Owner smiled",
        "Queue formed",
        "No side effects logged",
        "Unexpected popularity",
      ]),
      photoHue: intRange(rng, 0, 359),
    };
  });
}

export function createSessionSeed(): number {
  // Per page load — Date.now + performance entropy when available.
  const perf =
    typeof performance !== "undefined" ? Math.floor(performance.now() * 1000) : 0;
  return (Date.now() ^ perf ^ (Math.floor(Math.random() * 0xffffffff) >>> 0)) >>> 0;
}

export function generateExperiment(seed: number): Experiment {
  const rng = createRng(seed);
  const template = pick(rng, EXPERIMENT_TEMPLATES);

  let percentValue = parsePercent(template.result);
  if (template.resultKind === "percent") {
    // Prefer rolling around classic poster number, with rare extremes.
    if (chance(rng, 0.08)) percentValue = pick(rng, [999, 1, 0, 777, 444]);
    else percentValue = intRange(rng, 259, 450);
  }

  const result =
    template.resultKind === "percent" && percentValue != null
      ? `${percentValue}%`
      : template.result;

  const stampCount = intRange(rng, 1, 3);
  const stamps = pickN(rng, STAMP_POOL, stampCount).map((kind) => ({
    kind,
    x: intRange(rng, 6, 78),
    y: intRange(rng, 8, 72),
    rot: intRange(rng, -18, 18),
    opacity: 0.18 + rng() * 0.22,
  }));

  const warningCount = chance(rng, 0.55) ? intRange(rng, 1, 2) : 0;

  return {
    seed,
    experimentNo: String(intRange(rng, 1, 9999)).padStart(4, "0"),
    status: template.status,
    result,
    resultKind: template.resultKind,
    percentValue: template.resultKind === "percent" ? percentValue : null,
    sideEffect: template.sideEffect,
    observation: template.observation,
    note: template.note,
    observations: pickN(rng, OBSERVATION_POOL, intRange(rng, 4, 7)),
    warnings: pickN(rng, WARNING_POOL, warningCount),
    stamps,
    dogs: [makeDog(rng, "Subject A"), makeDog(rng, "Subject B")],
    operator: pick(rng, OPERATORS),
    location: pick(rng, LOCATIONS),
    version: `3.${intRange(rng, 0, 9)}.${intRange(rng, 0, 9)}`,
    dateLabel: "Today",
    microEvent: chance(rng, 0.01)
      ? {
          type: pick(rng, ["DOG DETECTED", "SYSTEM ERROR", "UNKNOWN BREED"] as const),
          delayMs: intRange(rng, 2500, 9000),
        }
      : null,
    archive: makeArchive(rng, intRange(rng, 8, 14)),
  };
}

export function stableSeedFromKey(key: string): number {
  return hashString(key);
}
