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
exports.IncidentResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const incident_input_1 = require("../../inputs/incident/incident.input");
const incident_1 = require("../../entity/incident");
const incident_update_input_1 = require("../../inputs/incident/incident.update.input");
let IncidentResolver = class IncidentResolver {
    async getIncidents() {
        const incident = await (0, typeorm_1.getRepository)(incident_1.Incident)
            .createQueryBuilder("incident")
            .innerJoinAndSelect("incident.material", "material")
            .innerJoinAndSelect("material.institution", "institution")
            .getMany();
        return incident;
    }
    async newIncident(data, pubsub) {
        const incident = await incident_1.Incident.create(Object.assign({}, data)).save();
        pubsub.publish("CREATE_INCIDENT", incident);
        return incident;
    }
    async updateIncident(id_incident, data) {
        await incident_1.Incident.update({ id_incident }, data);
        const updatedIncident = await incident_1.Incident.findOne({ id_incident });
        if (!updatedIncident) {
            throw new Error();
        }
        return updatedIncident;
    }
    async deleteIncident(id_incident) {
        await incident_1.Incident.delete({ id_incident });
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [incident_1.Incident]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "getIncidents", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => incident_1.Incident),
    __param(0, (0, type_graphql_1.Arg)("data")),
    __param(1, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incident_input_1.IncidentInput,
        type_graphql_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "newIncident", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => incident_1.Incident, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id_incident", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("data", () => incident_update_input_1.UpdateIncidentInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, incident_update_input_1.UpdateIncidentInput]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "updateIncident", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)("id_incident", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IncidentResolver.prototype, "deleteIncident", null);
IncidentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], IncidentResolver);
exports.IncidentResolver = IncidentResolver;
//# sourceMappingURL=IncidentResolver.js.map