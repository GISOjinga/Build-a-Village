import { Entity } from "@rbxts/jecs";
import Signal from "@rbxts/signal";


// signal to give abilities to character
export const spawnLightningWebSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnMudWallSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>

// fire
export const spawnFireBreathSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnCrimsonNailSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnFlameTornadoSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnFireBallSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnGreatFireBallSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnPhoenixFlowerSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>


// water
export const spawnWaterBreathSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnSeveringWaveSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>
export const spawnRisingWaterSlicerSignal = new Instance("BindableFunction") as BindableFunction<(entity: Entity) => void>


print("Justus Command Signals Loaded")
