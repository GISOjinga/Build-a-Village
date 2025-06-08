import { TransformResult, TypeBuilder } from "@rbxts/centurion";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { getPlayingCharacters } from "shared/utils/functions/characterFunctions";


export default TypeBuilder.create<Character<R6>>("character")
    .transform((text, executor) => {
        const allCharacters = getPlayingCharacters()

        if (text === "@me" && executor.Character) {
            return TransformResult.ok(executor.Character);
        }

        const character = allCharacters.find((character) => character.Name === text);
        if (!character) {
            return TransformResult.err("Character not found");
        } else {
            return TransformResult.ok(character);
        }
    })
    .suggestions(() => getPlayingCharacters().map((character) => character.Name))
    .markForRegistration()
    .build();