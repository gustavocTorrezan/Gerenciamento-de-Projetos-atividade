"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PnpmPackageManager", {
    enumerable: true,
    get: function() {
        return PnpmPackageManager;
    }
});
const _env = /*#__PURE__*/ _interop_require_default(require("../utils/env"));
const _nodeManagers = require("../utils/nodeManagers");
const _BasePackageManager = require("./BasePackageManager");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class PnpmPackageManager extends _BasePackageManager.BasePackageManager {
    name = 'pnpm';
    bin = 'pnpm';
    lockFile = _nodeManagers.PNPM_LOCK_FILE;
    workspaceRoot() {
        const root = (0, _nodeManagers.resolveWorkspaceRoot)(this.ensureCwdDefined('workspaceRoot'));
        if (root) {
            return new PnpmPackageManager({
                ...this.options,
                silent: this.silent,
                log: this.log,
                cwd: root
            });
        }
        return null;
    }
    installAsync(namesOrFlags = []) {
        if (_env.default.CI && !namesOrFlags.join(' ').includes('frozen-lockfile')) {
            namesOrFlags.unshift('--no-frozen-lockfile');
        }
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
            '--save-dev',
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
            '--save-dev',
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

//# sourceMappingURL=PnpmPackageManager.js.map
