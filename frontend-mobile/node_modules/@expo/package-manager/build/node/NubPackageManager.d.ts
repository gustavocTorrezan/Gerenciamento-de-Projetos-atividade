import { BasePackageManager } from './BasePackageManager';
export declare class NubPackageManager extends BasePackageManager {
    readonly name = "nub";
    readonly bin = "nub";
    readonly lockFile = "nub.lock";
    workspaceRoot(): NubPackageManager | null;
    installAsync(namesOrFlags?: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
    addAsync(namesOrFlags?: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
    addDevAsync(namesOrFlags?: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
    addGlobalAsync(namesOrFlags?: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
    removeAsync(namesOrFlags: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
    removeDevAsync(namesOrFlags: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
    removeGlobalAsync(namesOrFlags: string[]): import("@expo/spawn-async").SpawnPromise<import("@expo/spawn-async").SpawnResult>;
}
