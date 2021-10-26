import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Lend } from "../../entity/lend";

@InputType()
class ReservationInputa {
  @Field()
  id_reserva: number;

  @Field(() => Date)
  fecha_hora: String;
}

@InputType()
class LendInput {
  @Field(() => String, {nullable: true})
  fecha_hora_presta: Date;

  @Field(() => String, {nullable: true})
  fecha_vencimiento: Date;

  @Field(() => String)
  fecha_devolucion: Date;

  @Field(() => ReservationInputa)
  reservation: ReservationInputa;
}

@Resolver()
export class LendResolver {
  @Query(() => String)
  async hello() {
    return "hello";
  }

  @Query(() => [Lend])
  async lend() {
    const lend = await getRepository(Lend)
    .createQueryBuilder("lend")
    .innerJoinAndSelect("lend.reservation", "reservation")
    .innerJoinAndSelect("reservation.material", "material")
    .innerJoinAndSelect("reservation.user", "user")
    .getMany();

    // SELECT * from lend JOIN reservation on lend.reservationIdReserva = reservation.id_reserva JOIN user ON user.cedula = reservation.userCedula
    return lend;
  }

  @Mutation(() => Lend)
  async createLend(
    @Arg("data", () => LendInput) data: LendInput
  ): Promise<Lend> {
    return Lend.create({...data}).save();
  }
}