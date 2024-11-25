import express from 'express';
import { calculator } from './bmiCalculator';
import { calculateExercises,  ExerciseResult } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (_req, res: any) => {
  const { height, weight } = _req.query;

  if (typeof height === 'string' && typeof weight === 'string') {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || isNaN(weightNum)) {
      return res.status(400).json({
        error: "Height and weight must be valid numbers"
      });
    }

    const bmiCategory = calculator(heightNum, weightNum);

    return res.json({
      weight: weightNum,
      height: heightNum,
      bmi: bmiCategory
    });
  } else {
    return res.status(400).json({
      error: "Height and weight must be provided as query parameters"
    });
  }
});

app.post('/exercises', (_req, res: any) => {
  const { daily_exercises, target } = _req.body;

  console.log('Request body:', _req.body); // Log para inspeccionar el body

  if (!daily_exercises || !target) {
    console.error('Error: parameters missing');
    return res.status(400).send({ error: 'parameters missing' });
  }

  if (!Array.isArray(daily_exercises) || !daily_exercises.every((day: number) => !isNaN(day))) {
    console.error('Error: malformatted parameters - daily_exercises is not valid');
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  if (isNaN(Number(target))) {
    console.error('Error: malformatted parameters - target is not a number');
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result: ExerciseResult = calculateExercises(daily_exercises, target);
    return res.send(result);
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).send({ error: 'Something went wrong' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
