"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    BUN_LOCK_FILE: null,
    BUN_TEXT_LOCK_FILE: null,
    NPM_LOCK_FILE: null,
    NUB_LOCK_FILE: null,
    PNPM_LOCK_FILE: null,
    RESOLUTION_ORDER: null,
    YARN_LOCK_FILE: null,
    createForProject: null,
    resolvePackageManager: null,
    resolveWorkspaceRoot: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get BUN_LOCK_FILE () {
        return BUN_LOCK_FILE;
    },
    get BUN_TEXT_LOCK_FILE () {
        return BUN_TEXT_LOCK_FILE;
    },
    get NPM_LOCK_FILE () {
        return NPM_LOCK_FILE;
    },
    get NUB_LOCK_FILE () {
        return NUB_LOCK_FILE;
    },
    get PNPM_LOCK_FILE () {
        return PNPM_LOCK_FILE;
    },
    get RESOLUTION_ORDER () {
        return RESOLUTION_ORDER;
    },
    get YARN_LOCK_FILE () {
        return YARN_LOCK_FILE;
    },
    get createForProject () {
        return createForProject;
    },
    get resolvePackageManager () {
        return resolvePackageManager;
    },
    get resolveWorkspaceRoot () {
        return _resolveworkspaceroot().resolveWorkspaceRoot;
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
function _resolveworkspaceroot() {
    const data = require("resolve-workspace-root");
    _resolveworkspaceroot = function() {
        return data;
    };
    return data;
}
const _BunPackageManager = require("../node/BunPackageManager");
const _NpmPackageManager = require("../node/NpmPackageManager");
const _NubPackageManager = require("../node/NubPackageManager");
const _PnpmPackageManager = require("../node/PnpmPackageManager");
const _YarnPackageManager = require("../node/YarnPackageManager");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const NPM_LOCK_FILE = 'package-lock.json';
const YARN_LOCK_FILE = 'yarn.lock';
const PNPM_LOCK_FILE = 'pnpm-lock.yaml';
const BUN_LOCK_FILE = 'bun.lockb';
const BUN_TEXT_LOCK_FILE = 'bun.lock';
const NUB_LOCK_FILE = 'nub.lock';
const RESOLUTION_ORDER = [
    'bun',
    'nub',
    'yarn',
    'npm',
    'pnpm'
];
function resolvePackageManager(projectRoot, preferredManager) {
    const root = (0, _resolveworkspaceroot().resolveWorkspaceRoot)(projectRoot) ?? projectRoot;
    const lockFiles = {
        npm: [
            NPM_LOCK_FILE
        ],
        pnpm: [
            PNPM_LOCK_FILE
        ],
        yarn: [
            YARN_LOCK_FILE
        ],
        bun: [
            BUN_TEXT_LOCK_FILE,
            BUN_LOCK_FILE
        ],
        nub: [
            NUB_LOCK_FILE
        ]
    };
    if (preferredManager) {
        return lockFiles[preferredManager].some((file)=>_fs().default.existsSync(_path().default.join(root, file))) ? preferredManager : null;
    }
    for (const managerName of RESOLUTION_ORDER){
        if (lockFiles[managerName].some((file)=>_fs().default.existsSync(_path().default.join(root, file)))) {
            return managerName;
        }
    }
    return null;
}
function createForProject(projectRoot, options = {}) {
    if (options.npm) {
        return new _NpmPackageManager.NpmPackageManager({
            cwd: projectRoot,
            ...options
        });
    } else if (options.yarn) {
        return new _YarnPackageManager.YarnPackageManager({
            cwd: projectRoot,
            ...options
        });
    } else if (options.pnpm) {
        return new _PnpmPackageManager.PnpmPackageManager({
            cwd: projectRoot,
            ...options
        });
    } else if (options.bun) {
        return new _BunPackageManager.BunPackageManager({
            cwd: projectRoot,
            ...options
        });
    } else if (options.nub) {
        return new _NubPackageManager.NubPackageManager({
            cwd: projectRoot,
            ...options
        });
    }
    switch(resolvePackageManager(projectRoot)){
        case 'pnpm':
            return new _PnpmPackageManager.PnpmPackageManager({
                cwd: projectRoot,
                ...options
            });
        case 'yarn':
            return new _YarnPackageManager.YarnPackageManager({
                cwd: projectRoot,
                ...options
            });
        case 'bun':
            return new _BunPackageManager.BunPackageManager({
                cwd: projectRoot,
                ...options
            });
        case 'nub':
            return new _NubPackageManager.NubPackageManager({
                cwd: projectRoot,
                ...options
            });
        case 'npm':
        default:
            return new _NpmPackageManager.NpmPackageManager({
                cwd: projectRoot,
                ...options
            });
    }
}

//# sourceMappingURL=nodeManagers.js.map
