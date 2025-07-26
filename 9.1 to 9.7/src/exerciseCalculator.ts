interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export function calculateExercises(
  dailyExercises: number[],
  target: number
): Result {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((day) => day > 0).length;
  const average =
    dailyExercises.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;
  if (average >= target) {
    rating = 3;
    ratingDescription = "great job, target met!";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to work harder";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}
