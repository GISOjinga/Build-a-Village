import { Entity, pair, World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { $line } from "rbxts-transformer-inline";
import { addComponent, ComponentValue, getEntity, printJecs, printTS, removeComponent, warnTS } from "shared/utils/functions/jecsHelpFunctions";
import { Added, Body, ModelDebugger, PlatformOccupied, Platform, Player, Removed, TargetEntity, Data } from "shared/utils/jecs/jecsComponents";
import paths from "shared/utils/paths";




// set up the gui containers
function setUpSignGuiContainers(platform: PlatformExample, playerName?: string) {
    const buyGui = platform.BuySign.Container.SurfaceGui
    const nameGui = platform.NameSign.Container.SurfaceGui
    const player = Players.GetPlayers().find((p) => p.Name === playerName)

    // set up the buy sign
    buyGui.Price.Visible = playerName ? true : false
    buyGui.SubTitle.Visible = playerName ? true : false
    buyGui.None.Visible = !playerName ? true : false

    // set up the name sign
    nameGui.Title.Visible = true
    nameGui.Title.Text = playerName ? "Village" : "village"
    nameGui.PlayerName.Visible = true
    nameGui.PlayerName.Text = playerName ? playerName + "'s" : "empty"
    if (player) platform.NameSign.Thumbnail.SetAttribute("UserId", player.UserId)
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
            printJecs($line, "Removing platform from player: ", playerEntity, "Platform Entity: ", platformEntity)
            removeComponent(platformEntity, PlatformOccupied)
            removeComponent(platformEntity, pair(TargetEntity, Player))
            removeComponent(playerEntity, pair(TargetEntity, Platform))
        }

        // removes the player from the platform
        for (const [platformEntity, platform, playerEntityOccupying] of world.query(Platform, PlatformOccupied)) {
            if (playerEntityOccupying === playerEntity) {
                printJecs($line, "Removing player from platform: ", platformEntity, "Player Entity: ", playerEntity, "Platform: ", platform)
                removeComponent(platformEntity, PlatformOccupied)
                removeComponent(platformEntity, pair(TargetEntity, Player))
                removeComponent(playerEntity, pair(TargetEntity, Platform))

                // hides the fences
                setUpSignGuiContainers(platform)
                break
            }
        }
    }

    // when ever platform occupied is removed then hides all of the fences
    for (const [_, platformEntity, playerOccupyingEntity] of world.query(TargetEntity, Removed(PlatformOccupied))) {
        const platform = world.get(platformEntity, Platform)

        // if platform exists then hides the fences
        if (platform) setUpSignGuiContainers(platform)
    }

    // for all players added chooses an un occupied platform
    for (const [playerEntity, player] of world.query(Player).without(pair(TargetEntity, Platform))) {
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
                printJecs($line, "Claiming platform for player: ", player.Name, "Platform: ", platformEntity, platform)
                claimPlatform(platformEntity, playerEntity, body, platform)
                setUpSignGuiContainers(platform, player.Name)
                addComponent(playerEntity, Body, { ...body, platform: platform })
            } else {
                warnTS($line, "No platforms available for player: " + player.Name)
            }
        }
    }

    // if body gets added and you have a platform then pivots you to the platform
    for (const [_, bodyEntity, body] of world.query(TargetEntity, Added(Body))) {
        const platformEntity = world.get(bodyEntity, pair(TargetEntity, Platform))

        // if platform entity exists then the occupied and tags
        if (platformEntity !== undefined) {
            const platform = world.get(platformEntity, Platform)

            // if platform exists then pivots the character to the platform
            if (platform) body.rootPart.CFrame = platform.SpawnLocation.CFrame.add(Vector3.yAxis.mul(5))
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
            if (platform) setUpSignGuiContainers(platform)
        }
    })
}