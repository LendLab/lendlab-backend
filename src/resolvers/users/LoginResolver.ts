import {Arg, Ctx, Field, InputType, Mutation} from "type-graphql";
import argon2 from "argon2";

import {UserResponse} from "../../errors/User.errors";
import {MyContext} from "../../types/MyContext";
import {User} from "../../entity/user";
import {getRepository} from "typeorm";

@InputType()
class CedulaPasswordInput {
  @Field()
  cedula: number;
  @Field()
  password: string;
}

export class LoginResolver {
  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: CedulaPasswordInput,
    @Ctx() {req}: MyContext
  ): Promise<UserResponse> {
    const user = await getRepository(User)
      .createQueryBuilder("user")
      .innerJoinAndSelect("user.course", "course")
      .innerJoinAndSelect("course.institution", "institution")
      .where("user.cedula = :cedula", {cedula: options.cedula})
      .getOne();

    if (!user) {
      return {
        errors: [{path: "cedula", message: "Esta cedula no existe. "}],
      };
    }

    const valid = await argon2.verify(user.password, options.password);

    if (!valid) {
      return {
        errors: [
          {
            path: "password",
            message:
              "La constraseña es incorrecta. Porfavor intentalo de nuevo.",
          },
        ],
      };
    }

    console.log(user);

    req.session.cedula = user.cedula;
    return {user};
  }
}
