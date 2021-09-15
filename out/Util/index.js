"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNameSpaceObjByFile = void 0;
const NAME_SPECE = {};
function getMembers(data, target) {
    var _a, _b, _c, _d, _e, _f;
    for (let j = 0; j < data.length; j += 1) {
        const current = data[j];
        const name = data[j].name.escapedText;
        if ((_a = current === null || current === void 0 ? void 0 : current.type) === null || _a === void 0 ? void 0 : _a.members) {
            const curTypeMembers = current.type.members;
            target[name] = {};
            getMembers(curTypeMembers, target[name]);
        }
        else if ((_b = current === null || current === void 0 ? void 0 : current.type) === null || _b === void 0 ? void 0 : _b.typeArguments) {
            const typeArguments = (_c = current === null || current === void 0 ? void 0 : current.type) === null || _c === void 0 ? void 0 : _c.typeArguments;
            const curArgument = (target[name] = {});
            const typeName = current.type.typeName.escapedText;
            curArgument[typeName] = {};
            getMembers((_d = typeArguments[0]) === null || _d === void 0 ? void 0 : _d.members, curArgument[typeName]);
        }
        else if ((_e = current === null || current === void 0 ? void 0 : current.type) === null || _e === void 0 ? void 0 : _e.elementType) {
            const curElementType = (_f = current === null || current === void 0 ? void 0 : current.type) === null || _f === void 0 ? void 0 : _f.elementType;
            const curElement = target[name] = {};
            curElement['Array'] = {};
            getMembers(curElementType === null || curElementType === void 0 ? void 0 : curElementType.members, curElement['Array']);
        }
        else {
            target[name] = {};
        }
    }
}
function getNameSpace(data) {
    for (let i = 0; i < data.length; i += 1) {
        const current = data[i].compilerNode;
        const currentName = current.name.escapedText;
        if (!NAME_SPECE[currentName]) {
            NAME_SPECE[currentName] = {};
            const members = current.members;
            getMembers(members, NAME_SPECE[currentName]);
        }
    }
}
function getNameSpaceObjByFile(files) {
    for (let n = 0; n < files.length; n += 1) {
        const interfaces = files[n].getInterfaces();
        getNameSpace(interfaces);
    }
    return NAME_SPECE;
}
exports.getNameSpaceObjByFile = getNameSpaceObjByFile;
//# sourceMappingURL=index.js.map