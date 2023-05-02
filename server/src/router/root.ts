import { createTRPCRouter } from "../trpc/trpc";
import { carRouter } from "./routes/carsRouter";
import { userRouter } from "./routes/userRouter";
import { supportRouter } from "./routes/supportRouter";

export const appRouter = createTRPCRouter({
  user: userRouter,
  car: carRouter,
  support: supportRouter
});

export type AppRouter = typeof appRouter;
