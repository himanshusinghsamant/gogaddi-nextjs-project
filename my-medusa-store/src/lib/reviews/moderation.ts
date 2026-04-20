const BLOCKED_WORDS = [
  "fuck",
  "fucking",
  "fucker",
  "mf",
  "shit",
  "shitty",
  "bullshit",
  "crap",
  "dick",
  "dickhead",
  "cock",
  "pussy",
  "slut",
  "whore",
  "son of bitch",
  "sonofabitch",
  "bitch",
  "bastard",
  "asshole",
  "ass",
  "wanker",
  "motherfucker",
  "stfu",
  "f off",
  "fck",
  "fuk",
  "chutiya",
  "chut",
  "chu",
  "harami",
  "haraam",
  "haraami",
  "kamina",
  "kameena",
  "kutta",
  "kutiya",
  "kutti",
  "randi",
  "randi khana",
  "bhosdike",
  "bhosdiwala",
  "bhosadi",
  "bhosadiwala",
  "gaand",
  "gand",
  "gandu",
  "loda",
  "lund",
  "lawda",
  "laundiya",
  "saala",
  "sala",
  "bevkoof",
  "bewakoof",
  "chinal",
  "chhinal",
  "jhatu",
  "jhaatu",
  "tharki",
  "ullu",
  "nalayak",
  "haramkhor",
  "suar",
  "mc",
  "bc",
  "madarchod",
  "maderchod",
  "madar chod",
  "behenchod",
  "bhenchod",
  "bhen chod",
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function analyzeReviewText(text: string): {
  isFlagged: boolean
  matchedWords: string[]
} {
  const normalized = String(text ?? "").toLowerCase()
  const matchedWords: string[] = []

  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i")
    if (regex.test(normalized)) {
      matchedWords.push(word)
    }
  }

  return {
    isFlagged: matchedWords.length > 0,
    matchedWords,
  }
}
