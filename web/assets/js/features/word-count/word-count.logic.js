/**
 * Word count analyzer — pure business logic (no DOM).
 */

import { READING_SPEED_WPM, THAI_CHAR_PATTERN } from "./word-count.constants.js";

/**
 * @typedef {{ words: number, chars: number, charsNoSp: number, sentences: number, paragraphs: number, lines: number }} TextStats
 */

/** Count words, characters, sentences, paragraphs, and lines. */
export function analyzeText(text) {
  if (text.trim() === "") {
    return { words: 0, chars: 0, charsNoSp: 0, sentences: 0, paragraphs: 0, lines: 0 };
  }

  const hasThai = THAI_CHAR_PATTERN.test(text);
  const locale = hasThai ? "th" : undefined;

  let words = 0;
  try {
    const wordSeg = new Intl.Segmenter(locale, { granularity: "word" });
    words = [...wordSeg.segment(text)].filter((segment) => segment.isWordLike).length;
  } catch {
    words = text.trim().split(/\s+/).length;
  }

  let sentences = 0;
  try {
    const sentSeg = new Intl.Segmenter(locale, { granularity: "sentence" });
    sentences = [...sentSeg.segment(text)].filter(
      (segment) => segment.segment.trim().length > 0,
    ).length;
  } catch {
    sentences = (text.match(/[.!?。！？\n]+/g) || []).length;
  }

  return {
    words,
    chars: text.length,
    charsNoSp: text.replace(/\s/g, "").length,
    sentences,
    paragraphs: text.split(/\n\n+/).filter((part) => part.trim() !== "").length,
    lines: text.split("\n").length,
  };
}

/** Estimate reading time in whole minutes (minimum 1 when words > 0). */
export function estimateReadingMinutes(wordCount) {
  if (wordCount <= 0) return 0;
  return Math.ceil(wordCount / READING_SPEED_WPM);
}
