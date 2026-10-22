"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    findGemfile: null,
    isUsingBundlerAsync: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get findGemfile () {
        return findGemfile;
    },
    get isUsingBundlerAsync () {
        return isUsingBundlerAsync;
    }
});
function _spawnasync() {
    const data = /*#__PURE__*/ _interop_require_default(require("@expo/spawn-async"));
    _spawnasync = function() {
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
function _os() {
    const data = /*#__PURE__*/ _interop_require_default(require("os"));
    _os = function() {
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
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const maybeStat = (targetPath)=>_fs().default.promises.stat(_path().default.resolve(targetPath)).catch(()=>null);
async function getGitTopLevelAsync(root = process.cwd()) {
    try {
        const output = await (0, _spawnasync().default)('git', [
            'rev-parse',
            '--show-toplevel'
        ], {
            cwd: root
        });
        const gitRoot = _path().default.resolve(output.stdout.trim());
        return (await maybeStat(gitRoot))?.isDirectory() ? gitRoot : null;
    } catch  {
        return null;
    }
}
async function getGitRootPathAsync(root = process.cwd()) {
    const homeDir = _path().default.normalize(_os().default.homedir());
    for(let dir = root; _path().default.dirname(dir) !== dir; dir = _path().default.dirname(dir)){
        if ((await maybeStat(_path().default.join(dir, '.git')))?.isDirectory()) {
            return dir;
        }
        if (dir === homeDir) break;
    }
    return null;
}
async function getRootPathAsync(root = process.cwd()) {
    const rootPath = await getGitTopLevelAsync(root) || await getGitRootPathAsync(root) || await (0, _resolveworkspaceroot().resolveWorkspaceRootAsync)(root) || process.cwd();
    return rootPath;
}
async function findGemfile(root = process.cwd()) {
    const rootBoundary = _path().default.normalize(await getRootPathAsync(root));
    for(let dir = root; _path().default.dirname(dir) !== dir; dir = _path().default.dirname(dir)){
        const candidate = _path().default.join(dir, 'Gemfile');
        if ((await maybeStat(candidate))?.isFile()) {
            return candidate;
        }
        if (dir === rootBoundary) break;
    }
    return null;
}
async function isUsingBundlerAsync(projectRoot) {
    const gemfilePath = await findGemfile(projectRoot);
    if (!gemfilePath) {
        return false;
    }
    const [gemfileContents, podExec] = await Promise.allSettled([
        _fs().default.promises.readFile(gemfilePath, 'utf8'),
        (0, _spawnasync().default)('bundle', [
            'exec',
            'pod',
            '--version'
        ], {
            cwd: projectRoot,
            stdio: 'ignore'
        })
    ]);
    if (gemfileContents.status === 'rejected' || podExec.status === 'rejected') {
        return false;
    } else {
        return /gem\s*\(?\s*(?:'cocoapods'|"cocoapods")/.test(gemfileContents.value);
    }
}

//# sourceMappingURL=gemfile.js.map
