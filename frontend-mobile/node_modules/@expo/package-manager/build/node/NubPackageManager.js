"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NubPackageManager", {
    enumerable: true,
    get: function() {
        return NubPackageManager;
    }
});
const _nodeManagers = require("../utils/nodeManagers");
const _BasePackageManager = require("./BasePackageManager");
class NubPackageManager extends _BasePackageManager.BasePackageManager {
    name = 'nub';
    bin = 'nub';
    lockFile = _nodeManagers.NUB_LOCK_FILE;
    workspaceRoot() {
        const root = (0, _nodeManagers.resolveWorkspaceRoot)(this.ensureCwdDefined('workspaceRoot'));
        if (root) {
            return new NubPackageManager({
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

//# sourceMappingURL=NubPackageManager.js.map
