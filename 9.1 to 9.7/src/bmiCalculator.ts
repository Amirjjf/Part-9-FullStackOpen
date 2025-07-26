
const calculateBmi = (height: number, weight: number): string => {
  if (height <= 0) {
    throw new Error("Height must be greater than zero.");
  }
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 24.9) {
    return "Normal range";
  } else if (bmi < 29.9) {
    return "Overweight";
  } else {
    return "Obesity";
  }
};

export { calculateBmi };

