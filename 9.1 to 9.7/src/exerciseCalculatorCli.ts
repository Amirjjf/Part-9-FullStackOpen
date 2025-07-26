import { calculateExercises } from './exerciseCalculator';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('Usage: npm run calculateExercises <target> <day1> <day2> ...');
  process.exit(1);
}

const target = Number(args[0]);
const dailyExercises = args.slice(1).map(Number);

if (isNaN(target) || dailyExercises.some(isNaN)) {
  console.error('All arguments must be numbers.');
  process.exit(1);
}

try {
  const result = calculateExercises(dailyExercises, target);
  console.log(JSON.stringify(result, null, 2));
} catch (e: unknown) {
  if (e instanceof Error) {
    console.error(e.message);
  } else {
    console.error('An unknown error occurred.');
  }
  process.exit(1);
}
