"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BunPackageManager", {
    enumerable: true,
    get: function() {
        return BunPackageManager;
    }
});
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
const _nodeManagers = require("../utils/nodeManagers");
const _BasePackageManager = require("./BasePackageManager");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class BunPackageManager extends _BasePackageManager.BasePackageManager {
    name = 'bun';
    bin = 'bun';
    get lockFile() {
        const cwd = this.options.cwd?.toString() || process.cwd();
        return _fs().default.existsSync(_path().default.join(cwd, _nodeManagers.BUN_LOCK_FILE)) ? _nodeManagers.BUN_LOCK_FILE : _nodeManagers.BUN_TEXT_LOCK_FILE;
    }
    workspaceRoot() {
        const root = (0, _nodeManagers.resolveWorkspaceRoot)(this.ensureCwdDefined('workspaceRoot'));
        if (root) {
            return new BunPackageManager({
                ...this.options,
                silent: this.silent,
                log: this.log,
                cwd: root
            });
        }
        return null;
    }
    installAsync(namesOrFlags = []) {
        return this.runAsync([
            'install',
            ...namesOrFlags
        ]);
    }
    addAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return this.runAsync([
            'add',
            ...namesOrFlags
        ]);
    }
    addDevAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return this.runAsync([
            'add',
            '--dev',
            ...namesOrFlags
        ]);
    }
    addGlobalAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return this.runAsync([
            'add',
            '--global',
            ...namesOrFlags
        ]);
    }
    removeAsync(namesOrFlags) {
        return this.runAsync([
            'remove',
            ...namesOrFlags
        ]);
    }
    removeDevAsync(namesOrFlags) {
        return this.runAsync([
            'remove',
            ...namesOrFlags
        ]);
    }
    removeGlobalAsync(namesOrFlags) {
        return this.runAsync([
            'remove',
            '--global',
            ...namesOrFlags
        ]);
    }
}

//# sourceMappingURL=BunPackageManager.js.map
