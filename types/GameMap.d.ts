type GameMap = Folder & {
	Paths: Model;
	Shops: Folder & {
		Extra: Model & {
			Model: Model;
		};
		Sell: Model & {
			Noob: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					Attachment: Attachment;
					HairAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				Torso: Part & {
					["Left Shoulder"]: Motor6D;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					WaistBackAttachment: Attachment;
					roblox: Decal;
					LeftCollarAttachment: Attachment;
					NeckAttachment: Attachment;
					RightCollarAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					WaistFrontAttachment: Attachment;
				};
				HumanoidRootPart: Part & {
					ProximityPrompt: ProximityPrompt;
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
			};
			SpawnLocation: SpawnLocation;
			TalkBox: Part;
		};
		Buy: Model & {
			SpawnLocation: SpawnLocation;
			Noob: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					Attachment: Attachment;
					HairAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				Torso: Part & {
					["Left Shoulder"]: Motor6D;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					WaistBackAttachment: Attachment;
					roblox: Decal;
					LeftCollarAttachment: Attachment;
					NeckAttachment: Attachment;
					RightCollarAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					WaistFrontAttachment: Attachment;
				};
				HumanoidRootPart: Part & {
					ProximityPrompt: ProximityPrompt;
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
			};
			Parts: Model;
		};
	};
	Floor: Part;
	Platforms: Folder & {
		Platform3: Folder & {
			Earth: Model;
			Fences: Model & {
				["Evil Wall"]: Model;
				["Castle Wall"]: Model;
				["Wooden Fence"]: Model;
				["Stone Wall"]: Model;
				["Log Wall"]: Model;
				["Ironwood Fence"]: Model;
			};
			Floor: Part;
			Villagers: Folder;
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
			NameSign: Model & {
				Thumbnail: Part;
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
		};
		Platform6: Folder & {
			Earth: Model;
			Fences: Model & {
				["Evil Wall"]: Model;
				["Castle Wall"]: Model;
				["Wooden Fence"]: Model;
				["Stone Wall"]: Model;
				["Log Wall"]: Model;
				["Ironwood Fence"]: Model;
			};
			Floor: Part;
			Villagers: Folder;
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
			NameSign: Model & {
				Thumbnail: Part;
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
		};
		Platform5: Folder & {
			Earth: Model;
			Fences: Model & {
				["Evil Wall"]: Model;
				["Castle Wall"]: Model;
				["Wooden Fence"]: Model;
				["Stone Wall"]: Model;
				["Log Wall"]: Model;
				["Ironwood Fence"]: Model;
			};
			Floor: Part;
			Villagers: Folder;
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
			NameSign: Model & {
				Thumbnail: Part;
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
		};
		Platform4: Folder & {
			Earth: Model;
			Fences: Model & {
				["Evil Wall"]: Model;
				["Castle Wall"]: Model;
				["Wooden Fence"]: Model;
				["Stone Wall"]: Model;
				["Log Wall"]: Model;
				["Ironwood Fence"]: Model;
			};
			Floor: Part;
			Villagers: Folder;
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
			NameSign: Model & {
				Thumbnail: Part;
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
		};
		Platform1: Folder & {
			Earth: Model;
			Fences: Model & {
				["Evil Wall"]: Model;
				["Castle Wall"]: Model;
				["Wooden Fence"]: Model;
				["Stone Wall"]: Model;
				["Log Wall"]: Model;
				["Ironwood Fence"]: Model;
			};
			Floor: Part;
			Villagers: Folder;
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
			NameSign: Model & {
				Thumbnail: Part;
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
		};
		Platform2: Folder & {
			Earth: Model;
			Fences: Model & {
				["Evil Wall"]: Model;
				["Castle Wall"]: Model;
				["Wooden Fence"]: Model;
				["Stone Wall"]: Model;
				["Log Wall"]: Model;
				["Ironwood Fence"]: Model;
			};
			Floor: Part;
			Villagers: Folder;
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
			NameSign: Model & {
				Thumbnail: Part;
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
		};
	};
}
