type GameSettingsConfig = Configuration & {
	Shop: Configuration & {
		VillagerShop: Configuration & {
			RarityAppearChance: Configuration;
			StockWeights: Configuration & {
				Legendary: Configuration;
				Common: Configuration;
				Mythic: Configuration;
				Epic: Configuration;
				Uncommon: Configuration;
				Rare: Configuration;
			};
		};
	};
}
