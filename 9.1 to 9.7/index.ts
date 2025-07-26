
import express, { Request, Response } from "express";
import { calculateBmi } from "./src/bmiCalculator";
import { calculateExercises } from "./src/exerciseCalculator";


const app = express();
app.use(express.json());

app.post("/exercises", (req: Request, res: Response) => {
  const body: unknown = req.body;
  if (typeof body !== 'object' || body === null) {
    return res.status(400).json({ error: "parameters missing" });
  }
  const { daily_exercises, target } = body as { daily_exercises?: unknown; target?: unknown };

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }

  if (!Array.isArray(daily_exercises) ||
      !daily_exercises.every((n) => typeof n === "number" || !isNaN(Number(n))) ||
      (typeof target !== "number" && isNaN(Number(target)))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  // Convert all to numbers (in case of stringified numbers)
  const dailyNumbers = daily_exercises.map(Number);
  const targetNumber = Number(target);

  if (dailyNumbers.some(isNaN) || isNaN(targetNumber)) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  try {
    const result = calculateExercises(dailyNumbers, targetNumber);
    return res.json(result);
  } catch {
    return res.status(400).json({ error: "malformatted parameters" });
  }
});

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req: Request, res: Response) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  try {
    const bmi = calculateBmi(heightNum, weightNum);
    return res.json({
      weight: weightNum,
      height: heightNum,
      bmi: bmi,
    });
  } catch {
    return res.status(400).json({
      error: "malformatted parameters",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
