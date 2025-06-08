import { Entity } from "@rbxts/jecs";
import paths from "../paths";
import { isPointInView } from "./vector3Functions";
import { NoBodyCollisions, world } from "../jecs/jecsComponents";
import { addComponent, removeComponent } from "./jecsHelpFunctions";


export function getCharacterFromPart(part: BasePart): Character<R6> | undefined {
    const characters = [
        ...paths.Characters.Players.GetChildren(),
        ...paths.Characters.Npcs.GetChildren(),
        ...paths.Characters.Mobs.GetChildren(),
    ] as Array<Character<R6>>;

    return characters.find(character => part.IsDescendantOf(character));
}

// switch body collisions
export const switchBodyCollisions = (bodyEntity: Entity, collideWithPlayers: boolean) => {
    if (world.has(bodyEntity)) {
        if (collideWithPlayers) {
            removeComponent(bodyEntity, NoBodyCollisions)
        } else {
            addComponent(bodyEntity, NoBodyCollisions)
        }
    }
}




// is point in block vie
export function isInBlockView(blockerCFrame: CFrame, target: Vector3, maxDistance?: number): boolean {
    return isPointInView(
        blockerCFrame.Position,
        target,
        blockerCFrame.LookVector,
        maxDistance || 5,
        145
    )
}


// returns the players humanoid, rootPart and animator
export function getCharacterParts(body?: Model) {
    const humanoid = body?.FindFirstChild<Humanoid>("Humanoid")
    const rootPart = body?.FindFirstChild<BasePart>("HumanoidRootPart")
    const head = body?.FindFirstChild<BasePart>("Head")
    const animator = humanoid?.FindFirstChild<Animator>("Animator")
    const rootAttachment = rootPart?.FindFirstChild<Attachment>("RootAttachment")

    // if all parts exist then return them all
    return $tuple(humanoid, rootPart, head, animator, rootAttachment)
}

// clears out appearance
export function clearAppearanceForCharacter(character: Character<R6>) {
    // destroys the facial aspects
    character.Head.FindFirstChild("Eyes")?.Destroy()
    character.Head.FindFirstChild("Nose")?.Destroy()
    character.Head.FindFirstChild("Mouth")?.Destroy()
    character.Head.FindFirstChild("Blink")?.Destroy()
    character.Head.FindFirstChild("Eyebrows")?.Destroy()

    // destroys the wearable/welded aspects
    character.FindFirstChild("Shirt")?.Destroy()
    character.FindFirstChild("Pant")?.Destroy()
    character.FindFirstChild("Shoes")?.Destroy()
    character.FindFirstChild("Hair")?.Destroy()
    character.FindFirstChild("HeadBand")?.Destroy()
}



// loads in skin
export function loadInSkinForCharacter(character: Character<R6>, newSkin?: Model) {
    const skinsFolder = character.Skin
    const characterCFrame = character.GetPivot()

    // clears out skins folder
    skinsFolder.ClearAllChildren()

    // hides characters base parts
    character.GetDescendants().forEach((instance) => {
        if ((instance.IsA("BasePart") || instance.IsA("Decal")) && instance.Name !== "HumanoidRootPart") instance.Transparency = newSkin ? 1 : 0
    })

    // if skin then
    if (newSkin) {
        // setup: clears all children & pivots the new skin & parents it to the skins folder & welds all the body parts to the character
        newSkin.PivotTo(character.GetPivot())
        newSkin.Parent = skinsFolder

        // loops through the new skin
        newSkin.GetChildren().forEach((instance) => {
            if (instance.IsA("BasePart")) {
                const respectiveLimb = character.WaitForChild(instance.Name)

                // if instances matches and instances is a base part then create a weld parented to instances welded to both parts
                if (respectiveLimb && respectiveLimb.IsA("BasePart")) {
                    const weld = new Instance("Weld")
                    instance.PivotTo(respectiveLimb.GetPivot())
                    weld.Part0 = respectiveLimb
                    weld.Part1 = instance
                    weld.Parent = instance
                }
            }
        })
    }

    // pivots the character back
    character.PivotTo(characterCFrame)
    return character
}

// helps you get all characters
export function getPlayingCharacters(): Array<Character<R6>> {
    return [
        ...paths.Characters.Players.GetChildren(),
        ...paths.Characters.Mobs.GetChildren(),
    ] as Array<Character<R6>>;
}