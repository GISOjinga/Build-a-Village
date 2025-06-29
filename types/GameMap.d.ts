type GameMap = Folder & {
	Paths: Model;
	Shops: Folder & {
		Extra: Folder & {
			["grass:2"]: Part;
			Model: Model;
			["grass:3"]: Part;
			["grass:1"]: Part;
		};
		King: Model & {
			SpawnLocation: SpawnLocation;
			Accessories: Model & {
				Crown: Model & {
					["Grid.001"]: MeshPart & {
						Weld: ManualWeld;
					};
				};
				Throne: Model & {
					["Cube.007"]: MeshPart & {
						Weld: ManualWeld;
					};
					Cube: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.008"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.003"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.004"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.001"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.002"]: MeshPart & {
						Weld: ManualWeld;
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part & {
					LeftFootAttachment: Attachment;
				};
				Humanoid: Humanoid & {
					Animator: Animator;
					HumanoidDescription: HumanoidDescription;
				};
				["Right Leg"]: Part & {
					RightFootAttachment: Attachment;
				};
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				Torso: Part & {
					RightCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					["Left Hip"]: Motor6D;
					roblox: Decal;
					["Right Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					NeckAttachment: Attachment;
				};
				HumanoidRootPart: Part & {
					ProximityPrompt: ProximityPrompt;
					RootJoint: Motor6D;
					RootAttachment: Attachment;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
					RightGripAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftGripAttachment: Attachment;
					LeftShoulderAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
			};
		};
		Merchant: Model & {
			Npc: Model & {
				["Left Leg"]: Part & {
					LeftFootAttachment: Attachment;
				};
				Humanoid: Humanoid & {
					Animator: Animator;
					HumanoidDescription: HumanoidDescription;
				};
				["Right Leg"]: Part & {
					RightFootAttachment: Attachment;
				};
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				Torso: Part & {
					RightCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					["Left Hip"]: Motor6D;
					roblox: Decal;
					["Right Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					NeckAttachment: Attachment;
				};
				HumanoidRootPart: Part & {
					ProximityPrompt: ProximityPrompt;
					RootJoint: Motor6D;
					RootAttachment: Attachment;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
					RightGripAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftGripAttachment: Attachment;
					LeftShoulderAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
			};
			SpawnLocation: SpawnLocation;
			Accessories: Model & {
				Cart: Model & {
					["Grid.002"]: MeshPart;
					["Cube.005"]: MeshPart;
					["Grid.005"]: MeshPart;
					["Cube.016"]: MeshPart;
				};
				Hat: Model & {
					["Grid.003"]: MeshPart & {
						Weld: ManualWeld;
					};
				};
				Props: Model;
			};
			TalkBox: Part;
		};
		Architect: Model & {
			SpawnLocation: SpawnLocation;
			Accessories: Model & {
				Crane: Model & {
					["Cube.022"]: MeshPart;
					["Cube.021"]: MeshPart;
					["Cube.014"]: MeshPart;
					["Cube.027"]: MeshPart;
					["Cube.010"]: MeshPart;
					["Cube.006"]: MeshPart;
					["Cube.028"]: MeshPart;
					["Cube.013"]: MeshPart;
					["Cube.019"]: MeshPart;
					["Cube.023"]: MeshPart;
					["Cube.024"]: MeshPart;
					["Cube.015"]: MeshPart;
					["Cube.011"]: MeshPart;
					["Cube.012"]: MeshPart;
					["Cube.030"]: MeshPart;
					["Cube.029"]: MeshPart;
					["Cube.025"]: MeshPart;
					["Cube.018"]: MeshPart;
					["Cube.026"]: MeshPart;
					["Cube.020"]: MeshPart;
					["Cube.017"]: MeshPart;
					["Cube.009"]: MeshPart;
				};
				Hat: Model & {
					["Cube.033"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.032"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.031"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Grid.003"]: MeshPart & {
						Weld: ManualWeld;
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part & {
					LeftFootAttachment: Attachment;
				};
				Humanoid: Humanoid & {
					Animator: Animator;
					HumanoidDescription: HumanoidDescription;
				};
				["Right Leg"]: Part & {
					RightFootAttachment: Attachment;
				};
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				Torso: Part & {
					RightCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					["Left Hip"]: Motor6D;
					roblox: Decal;
					["Right Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					NeckAttachment: Attachment;
				};
				HumanoidRootPart: Part & {
					ProximityPrompt: ProximityPrompt;
					RootJoint: Motor6D;
					RootAttachment: Attachment;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
					RightGripAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftGripAttachment: Attachment;
					LeftShoulderAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
			};
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
						UIPadding: UIPadding;
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
				Thumbnail: Part & {
					PlayerThumbnail: SurfaceGui & {
						Frame: Frame & {
							CanvasGroup: CanvasGroup & {
								UICorner: UICorner;
								image: ImageLabel;
							};
							bgin: ImageLabel;
							PlayerThumbnail: LocalScript;
							bgout: ImageLabel;
						};
					};
				};
				Container: Part & {
					SurfaceGui: SurfaceGui & {
						PlayerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Title: TextLabel & {
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
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
						UIPadding: UIPadding;
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
				Thumbnail: Part & {
					PlayerThumbnail: SurfaceGui & {
						Frame: Frame & {
							CanvasGroup: CanvasGroup & {
								UICorner: UICorner;
								image: ImageLabel;
							};
							bgin: ImageLabel;
							PlayerThumbnail: LocalScript;
							bgout: ImageLabel;
						};
					};
				};
				Container: Part & {
					SurfaceGui: SurfaceGui & {
						PlayerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Title: TextLabel & {
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
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
						UIPadding: UIPadding;
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
				Thumbnail: Part & {
					PlayerThumbnail: SurfaceGui & {
						Frame: Frame & {
							CanvasGroup: CanvasGroup & {
								UICorner: UICorner;
								image: ImageLabel;
							};
							bgin: ImageLabel;
							PlayerThumbnail: LocalScript;
							bgout: ImageLabel;
						};
					};
				};
				Container: Part & {
					SurfaceGui: SurfaceGui & {
						PlayerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Title: TextLabel & {
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
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
						UIPadding: UIPadding;
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
				Thumbnail: Part & {
					PlayerThumbnail: SurfaceGui & {
						Frame: Frame & {
							CanvasGroup: CanvasGroup & {
								UICorner: UICorner;
								image: ImageLabel;
							};
							bgin: ImageLabel;
							PlayerThumbnail: LocalScript;
							bgout: ImageLabel;
						};
					};
				};
				Container: Part & {
					SurfaceGui: SurfaceGui & {
						PlayerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Title: TextLabel & {
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
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
						UIPadding: UIPadding;
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
				Thumbnail: Part & {
					PlayerThumbnail: SurfaceGui & {
						Frame: Frame & {
							CanvasGroup: CanvasGroup & {
								UICorner: UICorner;
								image: ImageLabel;
							};
							bgin: ImageLabel;
							PlayerThumbnail: LocalScript;
							bgout: ImageLabel;
						};
					};
				};
				Container: Part & {
					SurfaceGui: SurfaceGui & {
						PlayerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Title: TextLabel & {
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
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
						UIPadding: UIPadding;
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
				Thumbnail: Part & {
					PlayerThumbnail: SurfaceGui & {
						Frame: Frame & {
							CanvasGroup: CanvasGroup & {
								UICorner: UICorner;
								image: ImageLabel;
							};
							bgin: ImageLabel;
							PlayerThumbnail: LocalScript;
							bgout: ImageLabel;
						};
					};
				};
				Container: Part & {
					SurfaceGui: SurfaceGui & {
						PlayerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Title: TextLabel & {
							UIStroke: UIStroke;
						};
						UIPadding: UIPadding;
					};
				};
			};
		};
	};
}
