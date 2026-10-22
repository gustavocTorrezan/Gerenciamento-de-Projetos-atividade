/**
 * Note that instances of this class do NOT pass `instanceof JsonFileError`.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EmptyJsonFileError: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get EmptyJsonFileError () {
        return EmptyJsonFileError;
    },
    get default () {
        return JsonFileError;
    }
});
class JsonFileError extends Error {
    cause;
    code;
    fileName;
    isJsonFileError;
    constructor(message, cause, code, fileName){
        let fullMessage = message;
        if (fileName) {
            fullMessage += `\n${cause ? '├' : '└'}─ File: ${fileName}`;
        }
        if (cause) {
            fullMessage += `\n└─ Cause: ${cause.name}: ${cause.message}`;
        }
        super(fullMessage);
        this.name = this.constructor.name;
        this.cause = cause;
        this.code = code;
        this.fileName = fileName;
        this.isJsonFileError = true;
    }
}
class EmptyJsonFileError extends JsonFileError {
    constructor(fileName){
        super(`Cannot parse an empty JSON string`, undefined, 'EJSONEMPTY', fileName);
    }
}

//# sourceMappingURL=JsonFileError.js.map
