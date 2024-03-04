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
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupData = exports.LoginData = void 0;
const class_validator_1 = require("class-validator");
class LoginData {
}
exports.LoginData = LoginData;
__decorate([
    (0, class_validator_1.ValidateIf)(o => !o.userName),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginData.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginData.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)(o => !o.email),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginData.prototype, "userName", void 0);
class signupData {
}
exports.signupData = signupData;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(40, { message: 'lastName must be at most 16 characters long' }),
    __metadata("design:type", String)
], signupData.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.MinLength)(2, { message: 'lastName must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(20, { message: 'lastName must be at most 16 characters long' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], signupData.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.MinLength)(2, { message: 'firstName must be at least 2 characters long' }),
    (0, class_validator_1.MaxLength)(20, { message: 'firstName must be at most 16 characters long' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], signupData.prototype, "firstName", void 0);
//# sourceMappingURL=form.js.map