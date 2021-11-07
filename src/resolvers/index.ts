import {PubSub} from "graphql-subscriptions";
import {buildSchema, NonEmptyArray} from "type-graphql";

import {InstitutionResolver} from "./institution/InstitutionResolver";
import {LendResolver} from "./lend/LendResolver";
import {MaterialResolver} from "./material/MaterialResolver";
import {ReservationResolver} from "./reservation/ReservationResolver";
import {LoginResolver} from "./users/LoginResolver";
import {LogOutResolver} from "./users/LogoutResolver";
import {MeResolver} from "./users/MeResolver";
import {RegisterResolver} from "./users/RegisterResolver";
import {CourseResolver} from "./course/CourseResolver";
import {IncidentResolver} from "./incident/IncidentResolver";
import {RoomResolver} from "./room/RoomResolver";

//subscriptions
import {UserSubscription} from "../subscriptions/user/user.subscription";
import {ReservationSubscription} from "../subscriptions/reservation/reservation.subscription";
import {LendSubscription} from "../subscriptions/lend/lend.subscription";
import {MaterialSubscription} from "../subscriptions/material/material.subscription";
import {IncidentSubscription} from "../subscriptions/incident/incident.subscription";
import {ReservateRoomSubscription} from "../subscriptions/reservate_room/reservate.room.subscription";

const resolversArray = [
  //user actions
  RegisterResolver,
  LoginResolver,
  MeResolver,
  LogOutResolver,
  //material actions
  MaterialResolver,
  //reservations actions
  ReservationResolver,
  //lend actions
  LendResolver,
  //institiution actions
  InstitutionResolver,
  //course actions
  CourseResolver,
  //incident actions
  IncidentResolver,
  //room actions
  RoomResolver,
  //subscriptions
  UserSubscription,
  ReservationSubscription,
  LendSubscription,
  MaterialSubscription,
  IncidentSubscription,
  ReservateRoomSubscription,
] as const;

export const schemaIndex = buildSchema({
  pubSub: new PubSub(),
  resolvers: resolversArray as NonEmptyArray<Function>,
  //emitSchemaFile: __dirname + "./schema.graphql", autogenerated graphql schema
  validate: false,
});
