type GameMap = Folder & {
	Paths: Model;
	Shops: Folder & {
		Extra: Model & {
			Model: Model;
		};
		Sell: Model & {
			SpawnLocation: SpawnLocation;
			Noob: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
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
			Model: Model;
		};
		Buy: Model & {
			SpawnLocation: SpawnLocation;
			Noob: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
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
	Platforms: Model & {
		Platform3: Model & {
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
		};
		Platform6: Model & {
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
		};
		Platform5: Model & {
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
		};
		Platform4: Model & {
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
		};
		Platform1: Model & {
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
		};
		Platform2: Model & {
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
		};
	};
}
