type SFXFolder = Folder & {
	GameMusic: Folder & {
		SongC: Folder & {
			Sound1: Sound;
		};
		SongB: Folder & {
			Sound1: Sound;
		};
		SongD: Folder & {
			Sound1: Sound;
		};
		SongE: Folder & {
			Sound1: Sound;
		};
		SongA: Folder & {
			Sound2: Sound;
			Sound1: Sound;
		};
		SongG: Folder & {
			Sound1: Sound;
		};
		SongF: Folder & {
			Sound1: Sound;
		};
	};
	UI: Folder & {
		singletype: Sound;
		presssfx: Sound;
		purchasepass: Sound;
		hoversfx: Sound;
		purchasefail: Sound;
	};
	Effects: Folder & {
		Bubble: Sound;
		Teleport: Sound;
	};
}
