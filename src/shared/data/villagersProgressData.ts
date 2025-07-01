import paths from "shared/utils/paths"

type ProgressMap = ReturnType<<A extends VillagerNames>() => Map<A, VillagerProgress>>
const villagersProgressData = new Map<VillagerNames, VillagerProgress>()

// This is a placeholder for the villagers data.
paths.Assets.Villagers.GetChildren<VillagerModel>().forEach((villager) => {
    const requiredProduceName = villager.GetAttribute<string>("RequiredProduceName")
    const requiredAmount = villager.GetAttribute<number>("RequiredProduceAmount") || 0
	villagersProgressData.set(villager.Name as VillagerNames, {
		Produce: villager.GetAttribute("Produce") as ProduceNames || "Bread", // fallback to "Bread"
        Required: (requiredProduceName && requiredProduceName !== "" && requiredAmount > 0) ? {
            Produce: requiredProduceName as ProduceNames,
            Amount: 0,
            Max: requiredAmount,
        } : undefined,
		Progression: {
			Time: {
				RequiredTimePerResource: villager.GetAttribute("RequiredTimePerResource") as number || 10,
				StartTime: 0,
			},
			Resources: [],
		},
		Building: {
			StartTime: 0,
			TotalTime: 0,
		},
	} satisfies VillagerProgress)
})

export default villagersProgressData