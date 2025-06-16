type ProgressMap = ReturnType<<A extends VillagerNames>() => Map<A, VillagerProgress>>


export default new Map<VillagerNames, VillagerProgress>([
    ["Blacksmith", {
        Produce: "Sword",
        Progression: {
            Time: {
                RequiredTimePerResource: 3,
                StartTime: 0,
            },
            Resources: {
                Amount:0,
            },
        },
        Building: {
            StartTime: 0,
            EndTime: 0,
        },
    }],
    ["Farmer", {
        Produce: "Bread",
        Progression: {
            Time: {
                RequiredTimePerResource: 20,
                StartTime: 0,
            },
            Resources: {
                Amount:0,
            },
        },
        Building: {
            StartTime: 0,
            EndTime: 0,
        },
    }],
]) 