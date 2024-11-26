import express,  { RequestHandler }  from 'express';
import cors from 'cors';

const app = express();
const router = express.Router(); // Crea un router

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors() as RequestHandler);
app.use(express.json());

router.get('/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api', router);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
