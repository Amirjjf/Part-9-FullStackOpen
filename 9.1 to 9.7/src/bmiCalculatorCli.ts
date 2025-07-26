import { calculateBmi } from "./bmiCalculator";

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.error("Usage: npm run calculateBmi <height(cm)> <weight(kg)>");
    process.exit(1);
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (isNaN(height) || isNaN(weight)) {
    console.error("Both height and weight must be numbers.");
    process.exit(1);
  }

  try {
    const result = calculateBmi(height, weight);
    console.log(result);
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error("Unknown error", e);
    }
  }
}
