import { Entity, pair, World } from "@rbxts/jecs";
import { $line } from "rbxts-transformer-inline";
import { addComponent, ComponentValue, getEntity, printTS, removeComponent, warnTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Body, ModelDebugger, PlatformOccupied, Platform, Player, Removed, TargetEntity, Data } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";


// to toggle fence visibility
function toggleFenceVisibility(fence: Model, visible: boolean) {
    fence.GetDescendants().forEach((fence) => {
        if (fence.IsA("BasePart")) {
            fence.Transparency = visible ? 0 : 1
            fence.CanCollide = visible
            fence.CastShadow = visible
            fence.CanQuery = visible
            fence.CanTouch = false
            fence.Anchored = true
        }
    })
}

// set up the gui containers
function setUpSignGuiContainers(platform: PlatformExample, playerName?: string) {
    const buyGui = platform.BuySign.Container.SurfaceGui
    const nameGui = platform.NameSign.Container.SurfaceGui

    // set up the buy sign
    buyGui.Price.Visible = playerName ? true : false
    buyGui.SubTitle.Visible = playerName ? true : false
    buyGui.None.Visible = !playerName ? true : false

    // set up the name sign
    nameGui.Title.Visible = true
    nameGui.PlayerName.Visible = true
    nameGui.PlayerName.Text = playerName ? playerName : "No Ones"
}

// to claim maps
function claimPlatform(platformEntity: Entity, playerEntity: Entity, body: ComponentValue<typeof Body>, platform: PlatformExample) {
    // sets the platform as occupied
    addComponent(platformEntity, PlatformOccupied, playerEntity)
    addComponent(platformEntity, pair(TargetEntity, Player), playerEntity)
    addComponent(playerEntity, pair(TargetEntity, Platform), platformEntity)

    // pivots the character to the platform
    body.rootPart.CFrame = platform.SpawnLocation.CFrame.add(Vector3.yAxis.mul(5))
}


export default (world: World) => {
    const platformContainer = paths.Map.Platforms

    // when player is removed from the world then remove the platform from the player
    for (const [_, playerEntity] of world.query(TargetEntity, Removed(Player))) {
        const platformEntity = world.get(playerEntity, pair(TargetEntity, Platform))

        // if platform entity exists then the occupied and tags
        if (platformEntity !== undefined) {
            removeComponent(platformEntity, PlatformOccupied)
            removeComponent(platformEntity, pair(TargetEntity, Player))
            removeComponent(playerEntity, pair(TargetEntity, Platform))
        }
    }

    // when ever platform occupied is removed then hides all of the fences
    for (const [_, platformEntity, playerOccupyingEntity] of world.query(TargetEntity, Removed(PlatformOccupied))) {
        const platform = world.get(platformEntity, Platform)

        // if platform exists then hides the fences
        if (platform) {
            toggleFenceVisibility(platform.Fences, false)
            setUpSignGuiContainers(platform)
        }
    }

    // for all players added chooses an un occupied platform
    for (const [_, playerEntity, player] of world.query(TargetEntity, Added(Player))) {
        const body = world.get(playerEntity, Body)
        const data = world.get(playerEntity, Data)
        const platformsSorted: [Entity, PlatformExample][] = []

        if (body && data) {
            // adds then into the list
            for (const [platformEntity, platform] of world.query(Platform).without(PlatformOccupied)) platformsSorted.push([platformEntity, platform])

            // sorts them by name
            platformsSorted.sort((a, b) => a[1].Name < b[1].Name)

            // if the first platform exist then
            if (platformsSorted.size() > 0) {
                const [platformEntity, platform] = platformsSorted[0]

                // claims the platform and sets it up
                claimPlatform(platformEntity, playerEntity, body, platform)
                toggleFenceVisibility(platform.Fences[data.Fence], true)
                setUpSignGuiContainers(platform, player.Name)
                addComponent(playerEntity, Body, { ...body, platform: platform })
            } else {
                warnTS($line, "No platforms available for player: " + player.Name)
            }
        }
    }


    // for each platform makes sure that it has a entity attached
    platformContainer.GetChildren<PlatformExample>().forEach((platform) => {
        if (!getEntity.fromInstance(platform)) {
            const platformEntity = world.entity()

            // sets up the components
            addComponent(platformEntity, Platform, platform)
            addComponent(platformEntity, ModelDebugger, platform.Floor)
            platform.SetAttribute("ServerId", platformEntity)

            // hides the fences
            if (platform) {
                toggleFenceVisibility(platform.Fences, false)
                setUpSignGuiContainers(platform)
            }
        }
    })
}