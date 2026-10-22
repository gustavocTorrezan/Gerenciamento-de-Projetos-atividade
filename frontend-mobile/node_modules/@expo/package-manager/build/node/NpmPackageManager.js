"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NpmPackageManager", {
    enumerable: true,
    get: function() {
        return NpmPackageManager;
    }
});
function _jsonfile() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/json-file"));
    _jsonfile = function() {
        return data;
    };
    return data;
}
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
        return data;
    };
    return data;
}
function _npmpackagearg() {
    const data = /*#__PURE__*/ _interop_require_default(require("npm-package-arg"));
    _npmpackagearg = function() {
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
const _spawn = require("../utils/spawn");
const _BasePackageManager = require("./BasePackageManager");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class NpmPackageManager extends _BasePackageManager.BasePackageManager {
    name = 'npm';
    bin = 'npm';
    lockFile = _nodeManagers.NPM_LOCK_FILE;
    workspaceRoot() {
        const root = (0, _nodeManagers.resolveWorkspaceRoot)(this.ensureCwdDefined('workspaceRoot'));
        if (root) {
            return new NpmPackageManager({
                ...this.options,
                silent: this.silent,
                log: this.log,
                cwd: root
            });
        }
        return null;
    }
    addAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        const { flags, versioned, unversioned } = this.parsePackageSpecs(namesOrFlags);
        return (0, _spawn.createPendingSpawnAsync)(()=>this.updatePackageFileAsync(versioned, 'dependencies'), ()=>!unversioned.length ? this.runAsync([
                'install',
                ...flags
            ]) : this.runAsync([
                'install',
                '--save',
                ...flags,
                ...unversioned.map((spec)=>spec.raw)
            ]));
    }
    addDevAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        const { flags, versioned, unversioned } = this.parsePackageSpecs(namesOrFlags);
        return (0, _spawn.createPendingSpawnAsync)(()=>this.updatePackageFileAsync(versioned, 'devDependencies'), ()=>!unversioned.length ? this.runAsync([
                'install',
                ...flags
            ]) : this.runAsync([
                'install',
                '--save-dev',
                ...flags,
                ...unversioned.map((spec)=>spec.raw)
            ]));
    }
    addGlobalAsync(namesOrFlags = []) {
        if (!namesOrFlags.length) {
            return this.installAsync();
        }
        return this.runAsync([
            'install',
            '--global',
            ...namesOrFlags
        ]);
    }
    removeAsync(namesOrFlags) {
        return this.runAsync([
            'uninstall',
            ...namesOrFlags
        ]);
    }
    removeDevAsync(namesOrFlags) {
        return this.runAsync([
            'uninstall',
            '--save-dev',
            ...namesOrFlags
        ]);
    }
    removeGlobalAsync(namesOrFlags) {
        return this.runAsync([
            'uninstall',
            '--global',
            ...namesOrFlags
        ]);
    }
    runBinAsync(command, options = {}) {
        this.log?.(`> npx ${command.join(' ')}`);
        return (0, _spawnasync().default)('npx', command, {
            ...this.options,
            ...options
        });
    }
    /**
   * Parse all package specifications from the names or flag list.
   * The result from this method can be used for `.updatePackageFileAsync`.
   */ parsePackageSpecs(namesOrFlags) {
        const result = {
            flags: [],
            versioned: [],
            unversioned: []
        };
        namesOrFlags.map((name)=>{
            if (name.trim().startsWith('-')) {
                result.flags.push(name);
                return null;
            }
            return (0, _npmpackagearg().default)(name);
        }).forEach((spec)=>{
            // When using a dist-tag version of a library, we need to consider it as "unversioned".
            // Doing so will install that version with `npm install --save(-dev)`, and resolve the dist-tag properly.
            const hasExactSpec = !!spec && spec.rawSpec !== '' && spec.rawSpec !== '*';
            if (spec && hasExactSpec && spec.type !== 'tag') {
                result.versioned.push(spec);
            } else if (spec) {
                result.unversioned.push(spec);
            }
        });
        return result;
    }
    /** Sort dependencies by keys (case-insensitive, stable). Sorting algorithm is taken from https://github.com/npm/package-json/blob/f5db81bdfbba5e9d3bfc0732f8bfe511825a20aa/lib/update-dependencies.js#L9 */ orderDependencies(deps) {
        if (!deps) {
            return {};
        }
        const sorted = Object.keys(deps).sort((a, b)=>a.localeCompare(b, 'en')).reduce((res, key)=>{
            const dep = deps[key];
            if (dep != null) {
                res[key] = dep;
            }
            return res;
        }, {});
        return sorted;
    }
    /**
   * Older npm versions have issues with mismatched nested dependencies when adding exact versions.
   * This propagates as issues like mismatched `@expo/config-plugins` versions.
   * As a workaround, we update the `package.json` directly and run `npm install`.
   */ async updatePackageFileAsync(packageSpecs, packageType) {
        if (!packageSpecs.length) {
            return;
        }
        const pkgPath = _path().default.join(this.options.cwd?.toString() || '.', 'package.json');
        const pkg = await _jsonfile().default.readAsync(pkgPath);
        packageSpecs.forEach((spec)=>{
            pkg[packageType] = pkg[packageType] || {};
            pkg[packageType][spec.name] = spec.rawSpec;
        });
        pkg[packageType] = this.orderDependencies(pkg[packageType]);
        await _jsonfile().default.writeAsync(pkgPath, pkg, {
            json5: false
        });
    }
}

//# sourceMappingURL=NpmPackageManager.js.map
