import {
  Arg,
  Int,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import {getRepository} from "typeorm";
//import yup from "yup";

import {User} from "../../entity/user";
import {UserInput} from "../../inputs/user/UserInput";
import {UserUpdateInput} from "../../inputs/user/UserUpdateInput";
import {UserResponse} from "../../errors/User.errors";

@Resolver()
export class RegisterResolver {
  @Query(() => [User])
  async getUsers() {
    const user = getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.institution", "institution")
      .innerJoinAndSelect("user.course", "course")
      .getMany();

    return user;
  }

  @Query(() => User)
  async getUser(@Arg("cedula", () => Int) cedula: number) {
    const user = getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.course", "course")
      .innerJoinAndSelect("user.institution", "institution")
      .where(`user.cedula = ${cedula} `)
      .getOne();

    return user;
  }

  @Query(() => [User])
  async getLaboratorist() {
    const laboratorists = getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.course", "course")
      .innerJoinAndSelect("user.institution", "institution")
      .where("user.tipo_usuario = :tipo", { tipo: "Laboratorista" })
      .getMany();

    return laboratorists;
  }

  @Query(() => [User])
  async getLaboratoristsByInstitution(@Arg("id_institution", () => Int) id_institution: number) {

    const laboratorists = getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.course", "course")
      .innerJoinAndSelect("user.institution", "institution")
      .where("user.tipo_usuario = :tipo", { tipo: "Laboratorista" })
      .andWhere("user.institution.id_institution = :institution", { institution: {id_institution} })
      .getMany();

    return laboratorists;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("data", () => UserInput)
    data: UserInput,
    @PubSub() pubsub: PubSubEngine
  ): Promise<UserResponse> {
    const hashedPassword = await argon2.hash(data.password);

    const result = await User.create({
      cedula: data.cedula,
      nombre: data.nombre,
      password: hashedPassword,
      direccion: data.direccion,
      foto_usuario: data.foto_usuario,
      telefono: data.telefono,
      tipo_usuario: data.tipo_usuario,
      fecha_nacimiento: data.fecha_nacimiento,
      institution: data.institution,
      course: data.course,
    }).save();


    const user = await getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.institution", "institution")
      .innerJoinAndSelect("user.course", "course")
      .where("user.cedula = :cedula", { cedula: result.cedula })
      .getOne();


    pubsub.publish("CREATE_USER", user);
    //const validationSchema = yup.object().shape({
    //  cedula: yup.number().required().moreThan(8).lessThan(8),
    //});

    return {user};
  }

  @Mutation(() => User, {nullable: true})
  async updateUser(
    @Arg("cedula", () => Int) cedula: number,
    @Arg("data", () => UserUpdateInput) data: UserUpdateInput
  ) {
    await User.update({cedula}, data);
    const updatedUser = User.findOne({cedula});
    if (!updatedUser) {
      return null;
    }
    return updatedUser;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("cedula", () => Int) cedula: number): Promise<Boolean> {
    await User.delete({cedula});
    return true;
  }
}
