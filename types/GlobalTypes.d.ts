type FirstParam<T extends (...args: any[]) => any> = T extends (first: infer U, ...args: any[]) => any ? U : never;

//* combat stae
type CombatStates = "Ground" | "AirX1" | "AirX2"

//* camera states
type CameraStates = "Customization" | "None" | "Clashing"

//* react use state
type UseState<T> = LuaTuple<[T, (value: T | ((prevState: T) => T)) => void]>


//* dashing keycodes
type DashingKeycodes = "W" | "A" | "S" | "D"

//* remove keys of U from T
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

//* exclusive-or: either T or U
type XOR<T, U> =
    (T | U) extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;



//* R15 character
interface R15 {
    RightUpperArm: BasePart;
    RightLowerArm: BasePart;
    LeftUpperArm: BasePart;
    LeftLowerArm: BasePart;
    RightUpperLeg: BasePart;
    RightLowerLeg: BasePart;
    LeftUpperLeg: BasePart;
    LeftLowerLeg: BasePart;
    UpperTorso: BasePart;
    LowerTorso: BasePart;
}

//* R6 character
interface R6 {
    ["Right Arm"]: BasePart;
    ["Left Arm"]: BasePart;
    ["Right Leg"]: BasePart;
    ["Left Leg"]: BasePart;
    Torso: BasePart;
}

//* creates a character model
type Character<RigType extends R15 | R6> = Model & {
    Head: BasePart;
    Skin: Folder;
    HumanoidRootPart: BasePart & { RootAttachment: Attachment };
    Humanoid: Humanoid & {
        Animator: Animator
    };
} & RigType


type BodyComponent = {
    Model: Character<R6>,
    Humanoid: Humanoid,
    RootPart: BasePart,
    Animator: Animator,
}

//* workspace
interface Workspace {
    Camera: Camera;
}

//* effect states
type ClientEffectStates = "Start" | "Stop"

// event types
type BindedFunctionAnimation = {
    onComplete?: <v>(...args: v[]) => void,
    onStarted?: <v>(...args: v[]) => void,
    activated?: () => void,
    mouseExit?: () => void,
    mouseEnter?: () => void,
}

//* Define a type for player settings
type PlayerSettings = {
    toggleMusic: boolean,
    toggleGFX: boolean,
    toggleSFX: boolean,
}


type MoverStup<T> = {
    affected: BasePart,
    mover?: T,
    responsiveness: number,
    duration: number,
}



//* server info
type IpConfigResponse = {
    asn: string;
    asn_org: string;
    city: string;
    country: string;
    country_eu: boolean;
    country_iso: string;
    ip: string;
    ip_decimal: number;
    latitude: number;
    longitude: number;
    metro_code: number;
    region_code: string;
    region_name: string;
    time_zone: string;
zip_code: string;
}

//* different fence names
type FenceNames = keyof Omit<PlatformExample["Fences"], keyof Model>

//* game ui
type GameUI = Assets["UI"]["GameUI"]

//* DialogueSell
type DialogueSellUI = Assets["UI"]["DialogueSell"]

//* hover Box UI
type HoverBoxUI = Assets["UI"]["HoverBox"]

//* villager box info
type VillagerInfo = {
    Name: VillagerNames;
    Description: string;
    Image: string;
    Price: number;
    Robux: number;
    Rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
    Tier: number;
    InStock: number;
}

//* limited time shop
type LimitedPrice = ({Robux:number, Amount:number})
type LimitedTimePack = {
    Pack1: LimitedPrice,
    Pack3: LimitedPrice,
    Pack10: LimitedPrice,
}

//* wall info
type WallInfo = {
    Name: WallNames;
    Description: string;
    Image: string;
    Price: number;
    CashMultiplier: number;
    Rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
}

//* villager progress
type VillagerProgress = {
    Progression: {
        Time: {
            RequiredTimePerResource: number;
            StartTime: number;
        }
        Resources: {
            Amount:number;
        }
    };
    Building: {
        StartTime: number;
        EndTime: number;
    };
}

//* villager data
type VillagerData = { Name: VillagerNames, UniqueId: number, RelativeLocation: CFrame | undefined, Progress: VillagerProgress }

//* villager model
type VillagerModel = Assets["Villagers"]["VillagerExample"];

//* tool type
type ToolType = "Villager" | "Commodity";

//* tool info
type ToolInfo = ReturnType<<A extends ToolType>()=> A extends "Villager" ? {ItemName: VillagerNames, ToolType: A} : { ItemName: ItemName, ToolType: A }>

//* villager names
type VillagerNames = keyof Omit<Omit<Assets["Villagers"], keyof Folder>, "VillagerExample">;

//* wall names
type WallNames = "Stone Wall" | "Wooden Wall" | "Metal Wall" | "Brick Wall" | "Glass Wall";

//* item name
type ItemName = VillagerNames | "Bread";