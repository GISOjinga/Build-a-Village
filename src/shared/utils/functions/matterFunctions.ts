import { Entity, Name, World } from "@rbxts/jecs";
import { Body, Debug, systemQueue, world, Changed } from "shared/utils/jecs/jecsComponents";
import { Widgets } from "@rbxts/plasma";
import { useMemo, useState, useEvent, useThrottle } from "shared/Plugin-Hook";
import { addComponent } from "./jecsHelpFunctions";


// This function handles the alignment of the enemy to face the user
export const faceEnemy = (world: World, entity: Entity, userBodyComp: ReturnType<typeof Body>, duration: number) => {
    // const enemyMoverId = world.set(world.entity(),);
    // const enemyBody = world.get(entity, Body);

    // if (enemyBody) {
    //     // // Align the enemy to face the user
    //     // world.set(enemyMoverId, AlignOrientation({
    //     //     affected: enemyBody.rootPart,
    //     //     responsiveness: 200,
    //     //     duration: duration,
    //     // }))

    //     // // Set the enemy to face the user
    //     // world.set(enemyMoverId, Target({
    //     //     goal: userBodyComp.rootPart,
    //     //     ignoreYAxis: true,
    //     // }))

    //     // // Disable auto-rotation for the enemy
    //     // world.set(entity, DisableAutoRotate({
    //     //     humanoid: enemyBody.humanoid,
    //     //     duration: duration,
    //     // }));
    // }
};


// registered print debug
const printDebugRegistry = new Map<string, Entity>()
export const createDebugger = (systemName: string, initial?: boolean) => {
    const debugEntity = printDebugRegistry.get(systemName)
    const debugInfo = debugEntity && world.get(debugEntity, Debug)

    // if the debug entity already exists, return the current state
    if (!printDebugRegistry.has(systemName)) {
        const debugEntity = world.entity()

        world.set(debugEntity, Debug, { name: systemName, debug: initial !== undefined ? initial : false })
        world.set(debugEntity, Name, systemName)
        printDebugRegistry.set(systemName, debugEntity)
    }

    // returns the current state of the print debug for the system
    return debugInfo?.debug || false
}