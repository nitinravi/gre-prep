# GRE Prep

A mock test runner for GRE Verbal and Quantitative practice. You write a test as a JSON file (or have an LLM write one), upload it, take it with a timer running, and get a scored breakdown at the end.

There are no question banks to maintain and no backend. A new practice set is just a new JSON file.

**Live:** [nitinravi.github.io/gre-prep](https://nitinravi.github.io/gre-prep)

## Why

Most free GRE practice runs out quickly, and the paid material is fixed. LLMs are good at producing GRE-style questions on demand, but answering them in a chat window is nothing like sitting the test. This app sits between the two: generate as many sets as you like, then take them in something that behaves like an exam.

## Features

- **All seven GRE question types**, each with its own answer UI:
  - Verbal: Text Completion (one to three blanks), Sentence Equivalence, Reading Comprehension
  - Quant: Quantitative Comparison, Multiple Choice (single answer), Multiple Choice (select all that apply), Numeric Entry
- **Timed sessions**: a running clock plus time spent per question
- **Results**: score, accuracy, total and average time, a per-type breakdown, and a question-by-question review of your answer against the correct one
- **Runs entirely in the browser**: your test file and answers never leave your machine

## Quick start

```bash
git clone https://github.com/nitinravi/gre-prep.git
cd gre-prep
npm install
npm run dev
```

Open the local URL Vite prints, click **Start Creating Your Test**, and upload a JSON file.

## Test file format

```json
{
  "section": "Verbal Reasoning",
  "total_questions": 2,
  "questions": [ ... ]
}
```

`section` is `"Verbal Reasoning"` or `"Quantitative Reasoning"`. Every question has a unique numeric `id`, a `type`, the `question` text, and `options` and `correct_answers` in the shape its type expects:

| `type` | `options` | `correct_answers` | Notes |
|---|---|---|---|
| `Text Completion` (1 blank) | `["a", "b", ...]` | `["a"]` | Set `"blanks": 1` |
| `Text Completion` (2–3 blanks) | `{ "blank1": [...], "blank2": [...] }` | `{ "blank1": "...", "blank2": "..." }` | Set `"blanks": 2` or `3` |
| `Sentence Equivalence` | six choices | exactly two | Both must be chosen |
| `Reading Comprehension` | choices | one | Add the text as `passage` |
| `Quantitative Comparison` | `[]` | `"A"`, `"B"`, `"C"` or `"D"` | Put the two quantities on separate lines with `\n` |
| `Multiple Choice — Single Answer` | choices | one | |
| `Multiple Choice — Multiple Answers` | choices | every correct choice | Graded on the exact set |
| `Numeric Entry` | `[]` | `["75"]` | Compared as an exact string |

The type names must match exactly, including the em dash (`—`) in the two Multiple Choice types.

<details>
<summary>Full example: one of each Verbal type</summary>

```json
{
  "section": "Verbal Reasoning",
  "total_questions": 4,
  "questions": [
    {
      "id": 1,
      "type": "Text Completion",
      "blanks": 1,
      "question": "Far from being ______, the critic's review was measured and generous.",
      "options": ["scathing", "laudatory", "tepid", "verbose", "cursory"],
      "correct_answers": ["scathing"]
    },
    {
      "id": 2,
      "type": "Text Completion",
      "blanks": 2,
      "question": "The theory was (i) ______ at first, but later evidence made it (ii) ______.",
      "options": {
        "blank1": ["dismissed", "celebrated", "ignored"],
        "blank2": ["untenable", "orthodox", "obscure"]
      },
      "correct_answers": { "blank1": "dismissed", "blank2": "orthodox" }
    },
    {
      "id": 3,
      "type": "Sentence Equivalence",
      "question": "Her ______ manner put even nervous candidates at ease.",
      "options": ["affable", "brusque", "genial", "aloof", "pedantic", "curt"],
      "correct_answers": ["affable", "genial"]
    },
    {
      "id": 4,
      "type": "Reading Comprehension",
      "passage": "Bees communicate the location of food through a 'waggle dance'...",
      "question": "The passage is primarily concerned with:",
      "options": ["how bees share information", "why bees swarm", "the anatomy of bees", "the decline of bee populations"],
      "correct_answers": ["how bees share information"]
    }
  ]
}
```

</details>

<details>
<summary>Full example: Quant</summary>

```json
{
  "section": "Quantitative Reasoning",
  "total_questions": 3,
  "questions": [
    {
      "id": 1,
      "type": "Quantitative Comparison",
      "question": "Quantity A: √50\nQuantity B: 7",
      "options": [],
      "correct_answers": ["A"]
    },
    {
      "id": 2,
      "type": "Multiple Choice — Multiple Answers",
      "question": "Which of the following integers are factors of 60? Select all that apply.",
      "options": ["4", "5", "7", "10", "15"],
      "correct_answers": ["4", "5", "10", "15"]
    },
    {
      "id": 3,
      "type": "Numeric Entry",
      "question": "A triangle's angles are in the ratio 3:4:5. What is the largest angle, in degrees?",
      "options": [],
      "correct_answers": ["75"]
    }
  ]
}
```

</details>

## Generating tests with an LLM

Paste the format table and one of the examples above into ChatGPT, Claude or similar, then ask for what you want:

> Generate a GRE Quantitative Reasoning practice set of 15 questions as a single JSON object, following the format above exactly. Mix all four Quant question types, at medium-to-hard difficulty. Use unique sequential ids. Output only the JSON.

Check the output before you upload it. Models sometimes get the arithmetic wrong, or forget `blanks` on Text Completion questions.

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, React Router (hash routing for GitHub Pages) and lucide-react icons.

## Deploying

The app is set up for GitHub Pages under `/gre-prep/` (see `base` in `vite.config.ts`):

```bash
npm run deploy
```

This builds into `dist/` and publishes it to the `gh-pages` branch. If you deploy a fork under a different repo name, change `base` and `homepage` in `package.json` to match.

## Contributing

Issues and pull requests are welcome, especially for new question renderers, better scoring, or sample test sets.

## License

[MIT](LICENSE)
