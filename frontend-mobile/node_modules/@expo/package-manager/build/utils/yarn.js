"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getNpmProxy: null,
    isYarnOfflineAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getNpmProxy () {
        return getNpmProxy;
    },
    get isYarnOfflineAsync () {
        return isYarnOfflineAsync;
    }
});
function _child_process() {
    const data = require("child_process");
    _child_process = function() {
        return data;
    };
    return data;
}
function _dns() {
    const data = /*#__PURE__*/ _interop_require_default(require("dns"));
    _dns = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function isYarnOfflineAsync() {
    if (await isUrlAvailableAsync('registry.yarnpkg.com')) {
        return false;
    }
    const proxy = getNpmProxy();
    if (!proxy) {
        return true;
    }
    const hostname = URL.parse(proxy, 'file:')?.hostname;
    if (!hostname) {
        return true;
    }
    return !await isUrlAvailableAsync(hostname);
}
function getNpmProxy() {
    if (process.env.https_proxy) {
        return process.env.https_proxy ?? null;
    }
    try {
        const httpsProxy = (0, _child_process().execSync)('npm config get https-proxy').toString().trim();
        return httpsProxy !== 'null' ? httpsProxy : null;
    } catch  {
        return null;
    }
}
function isUrlAvailableAsync(url) {
    return new Promise((resolve)=>{
        _dns().default.lookup(url, (err)=>{
            resolve(!err);
        });
    });
}

//# sourceMappingURL=yarn.js.map
