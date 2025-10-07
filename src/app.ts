import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', (req, res) => res.json({message: 'FastFood API'}));

export default app;