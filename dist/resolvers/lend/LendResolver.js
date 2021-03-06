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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LendResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const lend_1 = require("../../entity/lend");
const lend_input_1 = require("../../inputs/lend/lend.input");
const lend_update_input_1 = require("../../inputs/lend/lend.update.input");
const Lend_errors_1 = require("../../errors/Lend.errors");
let LendResolver = class LendResolver {
    async hello() {
        return "hello";
    }
    async getLends() {
        const lend = await (0, typeorm_1.getRepository)(lend_1.Lend)
            .createQueryBuilder("lend")
            .innerJoinAndSelect("lend.reservation", "reservation")
            .innerJoinAndSelect("lend.institution", "institution")
            .innerJoinAndSelect("reservation.material", "material")
            .innerJoinAndSelect("reservation.user", "user")
            .innerJoinAndSelect("lend.laboratorist", "laboratorist")
            .where("lend.laboratoristCedula")
            .getMany();
        return lend;
    }
    async getLendsByInstitution(id_institution) {
        const lends = await (0, typeorm_1.getRepository)(lend_1.Lend)
            .createQueryBuilder("lend")
            .innerJoinAndSelect("lend.reservation", "reservation")
            .innerJoinAndSelect("lend.institution", "institution")
            .innerJoinAndSelect("reservation.material", "material")
            .innerJoinAndSelect("reservation.user", "user")
            .innerJoinAndSelect("lend.laboratorist", "laboratorist")
            .where("lend.institution.id_institution = :institutionId", {
            institutionId: id_institution,
        })
            .getMany();
        return lends;
    }
    async getUserLends(cedula) {
        const lends = await (0, typeorm_1.getRepository)(lend_1.Lend)
            .createQueryBuilder("lend")
            .innerJoinAndSelect("lend.reservation", "reservation")
            .innerJoinAndSelect("lend.institution", "institution")
            .innerJoinAndSelect("reservation.material", "material")
            .innerJoinAndSelect("reservation.user", "user")
            .innerJoinAndSelect("lend.laboratorist", "laboratorist")
            .where("reservation.user.cedula = :cedula", { cedula: cedula })
            .getMany();
        return lends;
    }
    async getLendsCount() {
        const { count } = await (0, typeorm_1.createQueryBuilder)("lend")
            .select("COUNT(*)", "count")
            .getRawOne();
        return count;
    }
    async createLend(data, pubsub) {
        const lend = await lend_1.Lend.create(Object.assign({}, data)).save();
        pubsub.publish("CREATE_LEND", lend);
        return lend;
    }
    async updateLend(id_lend, fecha_hora_presta, data) {
        await (0, typeorm_1.getRepository)(lend_1.Lend)
            .createQueryBuilder("lend")
            .update(lend_1.Lend)
            .set(Object.assign({}, data))
            .where("lend.id_lend = :id", { id: id_lend })
            .andWhere("lend.fecha_hora_presta = :fecha_hora", {
            fecha_hora: fecha_hora_presta,
        })
            .execute();
        const lend = await (0, typeorm_1.getRepository)(lend_1.Lend)
            .createQueryBuilder("lend")
            .innerJoinAndSelect("lend.reservation", "reservation")
            .innerJoinAndSelect("lend.institution", "institution")
            .innerJoinAndSelect("reservation.material", "material")
            .innerJoinAndSelect("reservation.user", "user")
            .innerJoinAndSelect("lend.laboratorist", "laboratorist")
            .where("lend.id_lend = :id", { id: id_lend })
            .andWhere("lend.fecha_hora_presta = :fecha_hora", {
            fecha_hora: fecha_hora_presta,
        })
            .getOne();
        if (!lend) {
            return null;
        }
        return lend;
    }
    async deleteLend(id_lend, fecha_hora_presta) {
        await lend_1.Lend.delete({ id_lend, fecha_hora_presta });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Query)(() => [lend_1.Lend]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "getLends", null);
__decorate([
    (0, type_graphql_1.Query)(() => [lend_1.Lend]),
    __param(0, (0, type_graphql_1.Arg)("id_institution", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "getLendsByInstitution", null);
__decorate([
    (0, type_graphql_1.Query)(() => [lend_1.Lend]),
    __param(0, (0, type_graphql_1.Arg)("cedula", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "getUserLends", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_1.Int),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "getLendsCount", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => lend_1.Lend),
    __param(0, (0, type_graphql_1.Arg)("data", () => lend_input_1.LendInput)),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lend_input_1.LendInput,
        type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "createLend", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Lend_errors_1.LendResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id_lend", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("fecha_hora_presta", () => String)),
    __param(2, (0, type_graphql_1.Arg)("data", () => lend_update_input_1.LendUpdateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        lend_update_input_1.LendUpdateInput]),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "updateLend", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id_lend", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("fecha_hora_presta", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LendResolver.prototype, "deleteLend", null);
LendResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LendResolver);
exports.LendResolver = LendResolver;
//# sourceMappingURL=LendResolver.js.map