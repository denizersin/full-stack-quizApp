import express, { Application, NextFunction, Request, Response } from 'express'
import * as trpcExpress from '@trpc/server/adapters/express'
import { appRouter } from './router'
import cors from 'cors'
import { createContext } from './lib/trpc'


import OpenAI from "openai";



console.log(process.env);

const app: Application = express()
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173'
}))

// app.get('/', (req: Request, res: Response, next: NextFunction) => {
//   res.json({ message: 'Hello world!' })
// })

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
)

const PORT: number = Number(process.env.PORT) || 3000


app.listen(PORT, () => {

  console.log(`🚀 Server running on Port: ${PORT}`)
  
})




// const openai = new OpenAI({
//   apiKey: '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'
// });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices[0]);
// }

// main();