import express, { static as expressStatic } from 'express';

const app = express();

app.use(expressStatic("D:\\ostimtools_release_server"));

app.listen(4001), () => {
    console.log(`Server is running on http://localhost:${4001}`);
  };
