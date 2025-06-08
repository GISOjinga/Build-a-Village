type PlatformExample = Model & {
	NameSign: Model & {
		Container: Part & {
			SurfaceGui: SurfaceGui & {
				Title: TextLabel & {
					UIStroke: UIStroke;
				};
				PlayerName: TextLabel & {
					UIStroke: UIStroke;
				};
			};
		};
	};
	Fences: Model & {
		["Evil Wall"]: Model;
		["Castle Wall"]: Model;
		["Wooden Fence"]: Model;
		["Stone Wall"]: Model;
		["Log Wall"]: Model;
		["Ironwood Fence"]: Model;
	};
	Floor: Model;
	BuySign: Model & {
		Container: Part & {
			SurfaceGui: SurfaceGui & {
				Price: TextLabel & {
					UIStroke: UIStroke;
				};
				SubTitle: TextLabel & {
					UIStroke: UIStroke;
				};
				None: TextLabel & {
					UIStroke: UIStroke;
				};
			};
		};
	};
	SpawnLocation: SpawnLocation & {
		Texture: Texture;
		t: Texture;
	};
}
