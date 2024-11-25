import express from 'express';
import { calculator } from './bmiCalculator';

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
