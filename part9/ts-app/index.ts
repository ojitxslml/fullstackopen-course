import express from 'express';
import { calculator, Operation } from './calculator';

const app = express();

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.post('/calculate', (_req, res: unknown) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { value1, value2, op } = _req.body;

    const result = calculator(
        Number(value1), Number(value2), op as Operation
      );
  
   return res.send({ result });
  });
const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});