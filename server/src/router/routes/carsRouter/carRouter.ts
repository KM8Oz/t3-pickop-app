import { t } from "../../../trpc/trpc";
import { getCars, getCar } from "./getCars";
import { likeCar, rateCar } from "./carActions";
import { newCar } from "./newCar";

export const carRouter = t.router({
  getCar,
  likeCar,
  rateCar,
  getCars,
  newCar,
});
