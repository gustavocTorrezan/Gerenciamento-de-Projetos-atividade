"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    writeFileAtomic: null,
    writeFileAtomicSync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get writeFileAtomic () {
        return writeFileAtomic;
    },
    get writeFileAtomicSync () {
        return writeFileAtomicSync;
    }
});
function _nodecrypto() {
    const data = require("node:crypto");
    _nodecrypto = function() {
        return data;
    };
    return data;
}
function _nodefs() {
    const data = /*#__PURE__*/ _interop_require_wildcard(require("node:fs"));
    _nodefs = function() {
        return data;
    };
    return data;
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function getTarget(filename, data) {
    const hash = (0, _nodecrypto().createHash)('sha256').update(data).digest('base64url');
    return `${filename}.${hash}`;
}
function writeFileAtomicSync(filename, data, options = {}) {
    const tmpfile = getTarget(filename, data);
    _nodefs().writeFileSync(tmpfile, data, options.mode !== undefined ? {
        mode: options.mode
    } : undefined);
    _nodefs().renameSync(tmpfile, filename);
    // rename preserves any pre-existing destination mode; chmod after to enforce the requested mode.
    if (options.mode !== undefined) {
        _nodefs().chmodSync(filename, options.mode);
    }
}
async function writeFileAtomic(filename, data, options = {}) {
    const tmpfile = getTarget(filename, data);
    await _nodefs().promises.writeFile(tmpfile, data, options.mode !== undefined ? {
        mode: options.mode
    } : undefined);
    await _nodefs().promises.rename(tmpfile, filename);
    if (options.mode !== undefined) {
        await _nodefs().promises.chmod(filename, options.mode);
    }
}

//# sourceMappingURL=writeAtomic.js.map
