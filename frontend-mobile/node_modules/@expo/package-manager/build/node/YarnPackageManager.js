"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "YarnPackageManager", {
    enumerable: true,
    get: function() {
        return YarnPackageManager;
    }
});
const _nodeManagers = require("../utils/nodeManagers");
const _spawn = require("../utils/spawn");
const _yarn = require("../utils/yarn");
const _BasePackageManager = require("./BasePackageManager");
class YarnPackageManager extends _BasePackageManager.BasePackageManager {
    name = 'yarn';
    bin = 'yarnpkg';
    lockFile = _nodeManagers.YARN_LOCK_FILE;
    /** Check if Yarn is running in offline mode, and add the `--offline` flag */ async withOfflineFlagAsync(namesOrFlags) {
        return await (0, _yarn.isYarnOfflineAsync)() ? [
            ...namesOrFlags,
            '--offline'
        ] : namesOrFlags;
    }
    workspaceRoot() {
        const root = (0, _nodeManagers.resolveWorkspaceRoot)(this.ensureCwdDefined('workspaceRoot'));
        if (root) {
            return new YarnPackageManager({
                ...this.options,
                silent: this.silent,
                log: this.log,
                cwd: root
            });
        }
        return null;
    }
    installAsync(flags = []) {
        return (0, _spawn.createPendingSpawnAsync)(()=>this.withOfflineFlagAsync([
                'install'
            ]), (args)=>this.runAsync([
                ...args,
                ...flags
            ]));
    }
    addAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return (0, _spawn.createPendingSpawnAsync)(()=>this.withOfflineFlagAsync([
                'add',
                ...namesOrFlags
            ]), (args)=>this.runAsync(args));
    }
    addDevAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return (0, _spawn.createPendingSpawnAsync)(()=>this.withOfflineFlagAsync([
                'add',
                '--dev',
                ...namesOrFlags
            ]), (args)=>this.runAsync(args));
    }
    addGlobalAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return (0, _spawn.createPendingSpawnAsync)(()=>this.withOfflineFlagAsync([
                'global',
                'add',
                ...namesOrFlags
            ]), (args)=>this.runAsync(args));
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
            'global',
            'remove',
            ...namesOrFlags
        ]);
    }
}

//# sourceMappingURL=YarnPackageManager.js.map
