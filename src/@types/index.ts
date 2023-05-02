
import type { User, Car, Chat, Feature, Geo, Media, Message, Order, Rating, Tag, VerificationToDrive } from "@prisma/client";
export type UserData = User

export type CarProps = Car & {
  features: Feature[],
  ratings: Rating[],
  tags: Tag[],
  User?: User,
  favoredby:User[]|[],
  medias: Media[],
  geo?: Geo,
  Orders: Order[]|[]
};
