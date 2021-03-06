"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterResolver = void 0;
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const typeorm_1 = require("typeorm");
const user_1 = require("../../entity/user");
const UserInput_1 = require("../../inputs/user/UserInput");
const UserUpdateInput_1 = require("../../inputs/user/UserUpdateInput");
const User_errors_1 = require("../../errors/User.errors");
let RegisterResolver = class RegisterResolver {
    async getUsers() {
        const user = (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.institution", "institution")
            .innerJoinAndSelect("user.course", "course")
            .getMany();
        return user;
    }
    async getUser(cedula) {
        const user = (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.course", "course")
            .innerJoinAndSelect("user.institution", "institution")
            .where(`user.cedula = ${cedula} `)
            .getOne();
        return user;
    }
    async getLaboratorist() {
        const laboratorists = (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.course", "course")
            .innerJoinAndSelect("user.institution", "institution")
            .where("user.tipo_usuario = :tipo", { tipo: "Laboratorista" })
            .getMany();
        return laboratorists;
    }
    async getLaboratoristsByInstitution(id_institution) {
        const laboratorists = (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.course", "course")
            .innerJoinAndSelect("user.institution", "institution")
            .where("user.tipo_usuario = :tipo", { tipo: "Laboratorista" })
            .andWhere("user.institution.id_institution = :institution", { institution: { id_institution } })
            .getMany();
        return laboratorists;
    }
    async getStudents() {
        const students = (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.course", "course")
            .innerJoinAndSelect("user.institution", "institution")
            .where("user.tipo_usuario = :tipo", { tipo: "Alumno" })
            .getMany();
        return students;
    }
    async getStudentsByInstitution(id_institution) {
        const students = (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.course", "course")
            .innerJoinAndSelect("user.institution", "institution")
            .where("user.tipo_usuario = :tipo", { tipo: "Alumno" })
            .andWhere("user.institution.id_institution = :institution", { institution: { id_institution } })
            .getMany();
        return students;
    }
    async register(data, pubsub) {
        const hashedPassword = await argon2_1.default.hash(data.password);
        const result = await user_1.User.create({
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
        const user = await (0, typeorm_1.getRepository)(user_1.User)
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.institution", "institution")
            .innerJoinAndSelect("user.course", "course")
            .where("user.cedula = :cedula", { cedula: result.cedula })
            .getOne();
        pubsub.publish("CREATE_USER", user);
        return { user };
    }
    async updateUser(cedula, data) {
        await user_1.User.update({ cedula }, data);
        const updatedUser = user_1.User.findOne({ cedula });
        if (!updatedUser) {
            return null;
        }
        return updatedUser;
    }
    async deleteUser(cedula) {
        await user_1.User.delete({ cedula });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [user_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "getUsers", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_1.User),
    __param(0, (0, type_graphql_1.Arg)("cedula", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "getUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => [user_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "getLaboratorist", null);
__decorate([
    (0, type_graphql_1.Query)(() => [user_1.User]),
    __param(0, (0, type_graphql_1.Arg)("id_institution", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "getLaboratoristsByInstitution", null);
__decorate([
    (0, type_graphql_1.Query)(() => [user_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "getStudents", null);
__decorate([
    (0, type_graphql_1.Query)(() => [user_1.User]),
    __param(0, (0, type_graphql_1.Arg)("id_institution", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "getStudentsByInstitution", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => User_errors_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("data", () => UserInput_1.UserInput)),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput_1.UserInput,
        type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => user_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("cedula", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data", () => UserUpdateInput_1.UserUpdateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UserUpdateInput_1.UserUpdateInput]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "updateUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("cedula", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegisterResolver.prototype, "deleteUser", null);
RegisterResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RegisterResolver);
exports.RegisterResolver = RegisterResolver;
//# sourceMappingURL=RegisterResolver.js.map