"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BasePackageManager", {
    enumerable: true,
    get: function() {
        return BasePackageManager;
    }
});
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _assert() {
    const data = /*#__PURE__*/ _interop_require_default(require("assert"));
    _assert = function() {
        return data;
    };
    return data;
}
function _fs() {
    const data = /*#__PURE__*/ _interop_require_default(require("fs"));
    _fs = function() {
        return data;
    };
    return data;
}
function _path() {
    const data = /*#__PURE__*/ _interop_require_default(require("path"));
    _path = function() {
        return data;
    };
    return data;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class BasePackageManager {
    silent;
    log;
    options;
    constructor({ silent, log, env = process.env, ...options } = {}){
        this.silent = !!silent;
        this.log = log ?? (!silent ? console.log : undefined);
        this.options = {
            stdio: silent ? undefined : 'inherit',
            ...options,
            env: {
                ...this.getDefaultEnvironment(),
                ...env
            }
        };
    }
    /** Get the default environment variables used when running the package manager. */ getDefaultEnvironment() {
        return {
            ADBLOCK: '1',
            DISABLE_OPENCOLLECTIVE: '1'
        };
    }
    /** Ensure the CWD is set to a non-empty string */ ensureCwdDefined(method) {
        const cwd = this.options.cwd?.toString();
        const className = this.constructor.name;
        const methodName = method ? `.${method}` : '';
        (0, _assert().default)(cwd, `cwd is required for ${className}${methodName}`);
        return cwd;
    }
    runAsync(command, options = {}) {
        this.log?.(`> ${this.name} ${command.join(' ')}`);
        return (0, _spawnasync().default)(this.bin, command, {
            ...this.options,
            ...options
        });
    }
    runBinAsync(command, options = {}) {
        this.log?.(`> ${this.name} ${command.join(' ')}`);
        return (0, _spawnasync().default)(this.bin, command, {
            ...this.options,
            ...options
        });
    }
    async versionAsync() {
        const { stdout } = await this.runAsync([
            '--version'
        ], {
            stdio: undefined
        });
        return stdout.trim();
    }
    async getConfigAsync(key) {
        const { stdout } = await this.runAsync([
            'config',
            'get',
            key
        ]);
        return stdout.trim();
    }
    async removeLockfileAsync() {
        const cwd = this.ensureCwdDefined('removeLockFile');
        const filePath = _path().default.join(cwd, this.lockFile);
        await _fs().default.promises.rm(filePath, {
            force: true
        });
    }
    installAsync(flags = []) {
        return this.runAsync([
            'install',
            ...flags
        ]);
    }
    async uninstallAsync() {
        const cwd = this.ensureCwdDefined('uninstallAsync');
        const modulesPath = _path().default.join(cwd, 'node_modules');
        await _fs().default.promises.rm(modulesPath, {
            force: true,
            recursive: true
        });
    }
}

//# sourceMappingURL=BasePackageManager.js.map
