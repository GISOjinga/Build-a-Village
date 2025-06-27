type Assets = Folder & {
	Tools: Folder & {
		Produce: Folder & {
			Wheat: Tool & {
				Handle: Part;
			};
			Log: Tool & {
				Handle: Part;
			};
			["Iron Bar"]: Tool & {
				Handle: Part;
			};
			Sword: Tool & {
				Handle: Part;
			};
			Basket: Tool & {
				Handle: Part;
			};
			Clothing: Tool & {
				Handle: Part;
			};
			Potion: Tool & {
				Handle: Part;
			};
			Wool: Tool & {
				Handle: Part;
			};
			Bricks: Tool & {
				Handle: Part;
			};
			Bread: Tool & {
				Handle: Part;
			};
			Planks: Tool & {
				Handle: Part;
			};
			Statue: Tool & {
				Handle: Part;
			};
		};
	};
	UI: Folder & {
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
		WallRenders: ScreenGui & {
			["Evil Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Castle Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Ironwood Fence"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Stone Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Log Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Wooden Fence"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
		};
		HoverBox: BillboardGui & {
			LocalScript: LocalScript;
			Frame: Frame & {
				UIGradient: UIGradient;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
			};
		};
		ProduceInfo: BillboardGui & {
			Frame: Frame & {
				UIListLayout: UIListLayout;
				Rarity: TextLabel & {
					Rainbow: UIGradient;
					Stroke: UIStroke;
					Normal: UIGradient;
					Gold: UIGradient;
				};
				ProduceName: TextLabel & {
					Rainbow: UIGradient;
					Stroke: UIStroke;
					Normal: UIGradient;
					Gold: UIGradient;
				};
			};
		};
		Icon: ModuleScript & {
			Packages: Folder & {
				Janitor: ModuleScript;
				GoodSignal: ModuleScript;
			};
			Utility: ModuleScript;
			Elements: Folder & {
				Notice: ModuleScript;
				Dropdown: ModuleScript;
				Menu: ModuleScript;
				Selection: ModuleScript;
				Caption: ModuleScript;
				Indicator: ModuleScript;
				Widget: ModuleScript;
				Container: ModuleScript;
			};
			Features: Folder & {
				Gamepad: ModuleScript;
				Themes: ModuleScript & {
					Classic: ModuleScript;
					Default: ModuleScript;
				};
				Overflow: ModuleScript;
			};
			VERSION: ModuleScript;
			Reference: ModuleScript;
			Attribute: ModuleScript;
			PackageLink: PackageLink;
		};
		VillagerRenders: ScreenGui & {
			Woodsman: ViewportFrame & {
				script: LocalScript;
			};
			Merchant: ViewportFrame & {
				script: LocalScript;
			};
			Carpenter: ViewportFrame & {
				script: LocalScript;
			};
			Baker: ViewportFrame & {
				script: LocalScript;
			};
			Farmer: ViewportFrame & {
				script: LocalScript;
			};
			Miner: ViewportFrame & {
				script: LocalScript;
			};
			LocalScript: LocalScript;
			Mason: ViewportFrame & {
				script: LocalScript;
			};
			Gatherer: ViewportFrame & {
				script: LocalScript;
			};
			Tailor: ViewportFrame & {
				script: LocalScript;
			};
			Sculptor: ViewportFrame & {
				script: LocalScript;
			};
			Blacksmith: ViewportFrame & {
				script: LocalScript;
			};
			Steward: ViewportFrame & {
				script: LocalScript;
			};
			Shepherd: ViewportFrame & {
				script: LocalScript;
			};
			Alchemist: ViewportFrame & {
				script: LocalScript;
			};
		};
		NpcDialogues: BillboardGui & {
			Buy: Frame & {
				UIGradient: UIGradient;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
			};
			Sell: Frame & {
				UIGradient: UIGradient;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
			};
		};
		GameUI: ScreenGui & {
			GiftToPlayer: Frame & {
				Decline: TextButton & {
					TextBox: TextBox & {
						UIStroke: UIStroke;
					};
					UIStroke: UIStroke;
					bg: ImageLabel;
				};
				UIStroke: UIStroke;
				Accept: TextButton & {
					TextBox: TextBox & {
						UIStroke: UIStroke;
					};
					UIStroke: UIStroke;
					bg: ImageLabel;
				};
				["bg header"]: ImageLabel & {
					UIStroke: UIStroke;
				};
				GiftFrom: TextLabel & {
					UIStroke: UIStroke;
				};
				bg: ImageLabel;
				ItemDetail: TextLabel & {
					UIStroke: UIStroke;
				};
			};
			GiftList: CanvasGroup & {
				Header: TextLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
				};
				Close: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				["bg header"]: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ScrollingFrame: ScrollingFrame & {
					UIListLayout: UIListLayout;
					UIPadding: UIPadding;
					Sample: ImageButton & {
						UIStroke: UIStroke;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						SampleName: TextLabel & {
							TextLabel: TextLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								UIStroke: UIStroke;
							};
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
					};
				};
				bg: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			Viewports: Folder & {
				mason: ViewportFrame;
			};
			Playercash: TextLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				UIStroke: UIStroke;
			};
			Introtext: Frame & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				text: TextLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
				};
			};
			RobuxStore: Frame & {
				Header: TextLabel & {
					UIStroke: UIStroke;
				};
				Close: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
				};
				["bg header"]: ImageLabel & {
					UIStroke: UIStroke;
				};
				bg: ImageLabel;
				ScrollingFrame: ScrollingFrame & {
					Purchase1: Frame & {
						packname: TextLabel & {
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						items: Frame & {
							m2: ViewportFrame;
							m1: ViewportFrame;
							b2: ViewportFrame;
							s1: ViewportFrame;
							b1: ViewportFrame;
							s3: ViewportFrame;
							s2: ViewportFrame;
						};
						CountDown: TextLabel & {
							UIStroke: UIStroke;
						};
						purchaseoptions: Frame & {
							giftx1: ImageButton & {
								UIStroke: UIStroke;
							};
							giftx10: ImageButton & {
								UIStroke: UIStroke;
							};
							buyx10: TextButton & {
								UIStroke2: UIStroke;
								UIStroke1: UIStroke;
								packquantity: TextLabel & {
									UIStroke: UIStroke;
								};
								bg: ImageLabel;
							};
							giftx3: ImageButton & {
								UIStroke: UIStroke;
							};
							buyx1: TextButton & {
								UIStroke2: UIStroke;
								UIStroke1: UIStroke;
								packquantity: TextLabel & {
									UIStroke: UIStroke;
								};
								bg: ImageLabel;
							};
							buyx3: TextButton & {
								UIStroke2: UIStroke;
								UIStroke1: UIStroke;
								packquantity: TextLabel & {
									UIStroke: UIStroke;
								};
								bg: ImageLabel;
							};
						};
						UIStroke: UIStroke;
						LimitedTime: TextLabel & {
							UIStroke: UIStroke;
						};
						["new"]: TextLabel & {
							UIStroke: UIStroke;
						};
					};
					UIPadding: UIPadding;
					UIListLayout: UIListLayout;
					PurchaseForever: Frame & {
						bg: ImageLabel;
						UIStroke: UIStroke;
						name: TextLabel & {
							UIStroke: UIStroke;
						};
						ScrollingFrame: ScrollingFrame & {
							UIAspectRatioConstraint: UIAspectRatioConstraint;
							UIStroke: UIStroke;
							Icon: ImageLabel & {
								TextButton: TextButton;
								UIStroke: UIStroke;
							};
							Arrow: ImageLabel;
						};
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					Purchase2: Frame & {
						purchaseoptions: Frame & {
							giftx1: ImageButton & {
								UIStroke: UIStroke;
							};
							giftx10: ImageButton & {
								UIStroke: UIStroke;
							};
							buyx10: TextButton & {
								UIStroke2: UIStroke;
								UIStroke1: UIStroke;
								packquantity: TextLabel & {
									UIStroke: UIStroke;
								};
								bg: ImageLabel;
							};
							giftx3: ImageButton & {
								UIStroke: UIStroke;
							};
							buyx1: TextButton & {
								UIStroke2: UIStroke;
								UIStroke1: UIStroke;
								packquantity: TextLabel & {
									UIStroke: UIStroke;
								};
								bg: ImageLabel;
							};
							buyx3: TextButton & {
								UIStroke2: UIStroke;
								UIStroke1: UIStroke;
								packquantity: TextLabel & {
									UIStroke: UIStroke;
								};
								bg: ImageLabel;
							};
						};
						LimitedTime: TextLabel & {
							UIStroke: UIStroke;
						};
						packname: TextLabel & {
							UIStroke: UIStroke;
						};
						UIGradient: UIGradient;
						items: Frame & {
							m2: ViewportFrame;
							m1: ViewportFrame;
							b2: ViewportFrame;
							s1: ViewportFrame;
							b1: ViewportFrame;
							s3: ViewportFrame;
							s2: ViewportFrame;
						};
						CountDown: TextLabel & {
							UIStroke: UIStroke;
						};
						UIStroke: UIStroke & {
							UIGradient: UIGradient;
						};
						bg: ImageLabel & {
							UIGradient: UIGradient;
						};
						["new"]: TextLabel & {
							UIStroke: UIStroke;
						};
					};
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			Wall: CanvasGroup & {
				Header: TextLabel & {
					UIStroke: UIStroke;
				};
				Close: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
				};
				["bg header"]: ImageLabel & {
					UIStroke: UIStroke;
				};
				bg: ImageLabel;
				ScrollingFrame: ScrollingFrame & {
					UIListLayout: UIListLayout;
					Sample: Frame & {
						WallViewPort: Frame & {
							UIStroke: UIStroke;
						};
						robux: ImageButton & {
							UIStroke: UIStroke;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
						};
						Price: TextLabel & {
							UIStroke: UIStroke;
						};
						Multiplier: TextLabel & {
							UIStroke: UIStroke;
						};
						unequip: ImageButton & {
							UIStroke: UIStroke;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
						};
						RobuxPrice: TextLabel & {
							UIStroke: UIStroke;
						};
						equip: ImageButton & {
							UIStroke: UIStroke;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
						};
						SampleName: TextLabel & {
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						buy: ImageButton & {
							UIStroke: UIStroke;
							text: TextLabel & {
								UIStroke: UIStroke;
							};
						};
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIPadding: UIPadding;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			Village: CanvasGroup & {
				Countdown: TextLabel & {
					UIStroke: UIStroke;
				};
				ScrollingFrame: ScrollingFrame & {
					UIListLayout: UIListLayout;
					Sample: ImageButton & {
						Stock: TextLabel & {
							UIStroke: UIStroke;
						};
						Price: TextLabel & {
							UIStroke: UIStroke;
						};
						RarityCommon: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityUncommon: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityEpic: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityMythic: ImageLabel & {
							UIStroke: UIStroke;
						};
						VillagerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Tier: TextLabel & {
							UIStroke: UIStroke;
						};
						RarityRare: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityLegendary: ImageLabel & {
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						VillagerViewPort: Frame & {
							UIStroke: UIStroke;
						};
					};
					UIPadding: UIPadding;
					Buy: ImageButton & {
						Normal: TextButton & {
							UIStroke2: UIStroke;
							UIStroke1: UIStroke;
						};
						bg: ImageLabel;
						Gift: ImageButton & {
							UIStroke: UIStroke;
						};
						Robux: TextButton & {
							UIStroke2: UIStroke;
							UIStroke1: UIStroke;
						};
					};
				};
				Close: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
				};
				["bg header"]: ImageLabel & {
					UIStroke: UIStroke;
				};
				bg: ImageLabel;
				ReStock: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
			};
			PlaceFrame: Frame & {
				Placetext: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
				};
				LeftPress: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
				};
				RightPress: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
				};
			};
			HUD: Frame & {
				Shop: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Walls: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Village: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Sell: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Buy: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
		};
		DialogueSell: BillboardGui & {
			Stuff: LocalScript;
			Frame: Frame & {
				Option3: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					UIGradient: UIGradient;
					HoverDetect: TextButton;
				};
				Option4: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					UIGradient: UIGradient;
					HoverDetect: TextButton;
				};
				Option2: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					UIGradient: UIGradient;
					HoverDetect: TextButton;
				};
				Option1: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					UIGradient: UIGradient;
					HoverDetect: TextButton;
				};
			};
		};
	};
	Villagers: Folder & {
		Carpenter: Model & {
			Accessories: Model & {
				Hat: Model & {
					Model: Model;
				};
				Chisel: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
			};
			Npc: Model & {
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
				["Body Colors"]: BodyColors;
				HumanoidRootPart: Part & {
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Torso: Part & {
					RightCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					["Right Hip"]: Motor6D;
					roblox: Decal;
					["Left Hip"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					NeckAttachment: Attachment;
					WaistFrontAttachment: Attachment;
				};
			};
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model;
				Parts: Model & {
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
					ProgressFull: Model & {
						["1"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
					StationParts: Model;
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
				};
			};
		};
		Baker: Model & {
			Npc: Model & {
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
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
					roblox: Decal;
					WaistBackAttachment: Attachment;
					LeftCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					RightCollarAttachment: Attachment;
					NeckAttachment: Attachment;
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
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model & {
					Part: Part & {
						Weld: ManualWeld;
						Attachment: Attachment & {
							Fire1: ParticleEmitter;
							Spec1: ParticleEmitter;
							Fire2: ParticleEmitter;
						};
					};
				};
				Parts: Model & {
					StationParts: Model;
					ProgressFull: Model & {
						["1"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
					InProgress: Model & {
						["1"]: Model;
						["3"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
						["2"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
					Resources: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
				};
			};
			Accessories: Model & {
				Hat: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
			};
		};
		Alchemist: Model & {
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model & {
					Particles: Part & {
						Weld: ManualWeld;
						Bubble: ParticleEmitter;
					};
				};
				Parts: Model & {
					InProgress: Model;
					Resources: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					StationParts: Model & {
						Table: Model;
						Spoon: Model;
						Cauldron: Model;
					};
					ProgressFull: Model;
				};
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid & {
					Animator: Animator;
				};
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
			Accessories: Model & {
				Spoon: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
				Hat: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
					Model: Model;
				};
			};
		};
		Farmer: Model & {
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						WeldConstraint: WeldConstraint;
					};
				};
				Particles: Model & {
					Part: Part & {
						Water: ParticleEmitter;
					};
				};
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
					};
					ProgressFull: Model & {
						["1"]: Model;
					};
					StationParts: Model & {
						PlotOfGrass: Model & {
							Part3: Part;
							Part1: Part;
							Center: Part;
							Part2: Part;
							Part4: Part;
						};
						Container: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid & {
					Animator: Animator;
				};
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					Part: Weld;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
				HumanoidRootPart: Part & {
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Torso: Part & {
					RightCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					roblox: Decal;
					["Right Shoulder"]: Motor6D;
					WaistBackAttachment: Attachment;
					LeftCollarAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
					NeckAttachment: Attachment;
				};
				Animate: Script & {
					idle: StringValue & {
						Animation2: Animation & {
							Weight: NumberValue;
						};
						Animation1: Animation & {
							Weight: NumberValue;
						};
					};
					climb: StringValue & {
						ClimbAnim: Animation;
					};
					sit: StringValue & {
						SitAnim: Animation;
					};
					run: StringValue & {
						RunAnim: Animation;
					};
					ScaleDampeningPercent: NumberValue;
					toolnone: StringValue & {
						ToolNoneAnim: Animation;
					};
					fall: StringValue & {
						FallAnim: Animation;
					};
					jump: StringValue & {
						JumpAnim: Animation;
					};
					walk: StringValue & {
						WalkAnim: Animation;
					};
				};
			};
			Accessories: Model & {
				Pot: Model;
				Hat: Model;
			};
		};
		Mason: Model & {
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
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
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					WaistBackAttachment: Attachment;
					roblox: Decal;
					["Right Hip"]: Motor6D;
					WaistCenterAttachment: Attachment;
					["Left Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
					NeckAttachment: Attachment;
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
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model;
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					ProgressFull: Model & {
						["1"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
					StationParts: Model;
				};
			};
			Accessories: Model & {
				Hat: Model;
				Trowel: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
			};
		};
		Gatherer: Model & {
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
				HumanoidRootPart: Part & {
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Torso: Part & {
					["Left Shoulder"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					["Right Hip"]: Motor6D;
					roblox: Decal;
					RightCollarAttachment: Attachment;
					NeckAttachment: Attachment;
					WaistBackAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistCenterAttachment: Attachment;
					WaistFrontAttachment: Attachment;
				};
			};
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model;
				Parts: Model & {
					StationParts: Model & {
						Bush: Model;
						Container: Model;
					};
					Resources: Model & {
						["1"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
					ProgressFull: Model & {
						["1"]: Model;
					};
				};
			};
			Accessories: Model & {
				Hat: Model;
			};
		};
		VillagerExample: Model & {
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						WeldConstraint: WeldConstraint;
					};
				};
				Particles: Model & {
					Part: Part & {
						Water: ParticleEmitter;
						Part: Weld;
					};
				};
				Parts: Model & {
					ProgressFull: Model & {
						["1"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					StationParts: Model & {
						PlotOfGrass: Model & {
							Part3: Part;
							Part2: Part;
							Center: Part;
							Part1: Part;
							Part4: Part;
						};
						Container: Model;
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					Part: Weld;
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
					Part: Weld;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Animate: Script & {
					idle: StringValue & {
						Animation2: Animation & {
							Weight: NumberValue;
						};
						Animation1: Animation & {
							Weight: NumberValue;
						};
					};
					climb: StringValue & {
						ClimbAnim: Animation;
					};
					sit: StringValue & {
						SitAnim: Animation;
					};
					run: StringValue & {
						RunAnim: Animation;
					};
					ScaleDampeningPercent: NumberValue;
					jump: StringValue & {
						JumpAnim: Animation;
					};
					fall: StringValue & {
						FallAnim: Animation;
					};
					toolnone: StringValue & {
						ToolNoneAnim: Animation;
					};
					walk: StringValue & {
						WalkAnim: Animation;
					};
				};
				["Body Colors"]: BodyColors;
			};
			Accessories: Model & {
				Pot: Model;
				Hat: Model;
			};
		};
		Tailor: Model & {
			Accessories: Model & {
				Scissors: Model;
				Hat: Model;
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
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
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					roblox: Decal;
					["Right Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					WaistCenterAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistBackAttachment: Attachment;
					NeckAttachment: Attachment;
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
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model;
				Parts: Model & {
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
					ProgressFull: Model & {
						["2"]: Model;
					};
					StationParts: Model;
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
				};
			};
		};
		Blacksmith: Model & {
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						WeldConstraint: WeldConstraint;
					};
				};
				Particles: Model & {
					ImpactBlacksmith: Part & {
						Attachment: Attachment & {
							Spark3: ParticleEmitter;
							Spark1: ParticleEmitter;
							Spark2: ParticleEmitter;
						};
					};
				};
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					ProgressFull: Model;
					InProgress: Model & {
						["1"]: Model;
					};
					StationParts: Model & {
						Anvil: Model & {
							Part3: Part;
							Part1: Part;
							Part5: Part;
							Part13: Part;
							Part8: Part;
							Part4: Part;
							Part2: Part;
							Part11: Part;
							Part10: Part;
							Part7: Part;
							Part12: Part;
							Part9: Part;
							Part6: Part;
						};
						Rack: Model & {
							Part3: Part;
							Part1: Part;
							Part2: Part;
							Part5: Part;
							Part7: Part;
							Part6: Part;
							Part8: Part;
							Part4: Part;
						};
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid & {
					Animator: Animator;
				};
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
				HumanoidRootPart: Part & {
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Torso: Part & {
					RightCollarAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					["Right Hip"]: Motor6D;
					roblox: Decal;
					WaistFrontAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistBackAttachment: Attachment;
					NeckAttachment: Attachment;
				};
				Animate: Script & {
					idle: StringValue & {
						Animation2: Animation & {
							Weight: NumberValue;
						};
						Animation1: Animation & {
							Weight: NumberValue;
						};
					};
					climb: StringValue & {
						ClimbAnim: Animation;
					};
					sit: StringValue & {
						SitAnim: Animation;
					};
					toolnone: StringValue & {
						ToolNoneAnim: Animation;
					};
					ScaleDampeningPercent: NumberValue;
					run: StringValue & {
						RunAnim: Animation;
					};
					fall: StringValue & {
						FallAnim: Animation;
					};
					jump: StringValue & {
						JumpAnim: Animation;
					};
					walk: StringValue & {
						WalkAnim: Animation;
					};
				};
			};
			Accessories: Model & {
				Googles: Model & {
					Center: Part & {
						Head: Weld;
					};
				};
				Malet: Model & {
					Part: Part;
					Center: Part & {
						Part: Weld;
						["Right Arm"]: Weld;
					};
				};
			};
		};
		Sculptor: Model & {
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model;
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
					};
					ProgressFull: Model & {
						["1"]: Model;
					};
					StationParts: Model;
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
				};
			};
			Accessories: Model & {
				Hammer: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
					Part: Part & {
						Weld: ManualWeld;
					};
				};
				Hat: Model & {
					Model: Model;
				};
				Chisel: Model & {
					Model: Model & {
						handle: Part & {
							Weld: ManualWeld;
						};
					};
				};
			};
			Npc: Model & {
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
					LeftCollarAttachment: Attachment;
					WaistBackAttachment: Attachment;
					roblox: Decal;
					WaistFrontAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					RightCollarAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					["Right Hip"]: Motor6D;
					NeckAttachment: Attachment;
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
		};
		Shepherd: Model & {
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model;
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
					};
					ProgressFull: Model & {
						["1"]: Model;
					};
					StationParts: Model & {
						Container: Model & {
							Union: UnionOperation & {
								Weld: ManualWeld;
							};
						};
					};
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
				};
			};
			Accessories: Model & {
				Scissors: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
				Hat: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid & {
					Animator: Animator;
				};
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
					LeftCollarAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					roblox: Decal;
					["Left Hip"]: Motor6D;
					RightCollarAttachment: Attachment;
					["Right Hip"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					NeckAttachment: Attachment;
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
		};
		Miner: Model & {
			Accessories: Model & {
				["Miner's Hat"]: Model;
				Pickaxe: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
			};
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					FaceFrontAttachment: Attachment;
					HairAttachment: Attachment;
					face: Decal;
					Mesh: SpecialMesh;
					FaceCenterAttachment: Attachment;
				};
				["Body Colors"]: BodyColors;
				HumanoidRootPart: Part & {
					RootJoint: Motor6D;
				};
				["Right Arm"]: Part & {
					RightShoulderAttachment: Attachment;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Torso: Part & {
					["Left Shoulder"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					roblox: Decal;
					WaistCenterAttachment: Attachment;
					WaistBackAttachment: Attachment;
					["Right Hip"]: Motor6D;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					RightCollarAttachment: Attachment;
					NeckAttachment: Attachment;
				};
			};
			Station: Model & {
				Interaction: Model & {
					Collect: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model & {
					ImpactMiner: Part & {
						Weld: ManualWeld;
						Attachment: Attachment & {
							Spark3: ParticleEmitter;
							Spark1: ParticleEmitter;
							Spark2: ParticleEmitter;
						};
					};
				};
				Parts: Model & {
					InProgress: Model & {
						["1"]: Model;
					};
					ProgressFull: Model;
					StationParts: Model & {
						Rock: Model;
					};
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
				};
			};
		};
	};
	villagerviewports: Folder & {
		Produce: Folder & {
			Wheat: Model;
			Log: Model;
			Coin: Model;
			["Iron Bar"]: Model;
			Statue: Model;
			Basket: Model;
			Chest: Model;
			Sword: Model;
			Bricks: Model;
			Wool: Model;
			Planks: Model;
			Bread: Model;
			Potion: Model;
			Clothing: Model;
		};
		Villager: Folder & {
			Woodsman: Model & {
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
			Merchant: Model & {
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
				Model: Model;
				["Body Colors"]: BodyColors;
			};
			Carpenter: Model & {
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
			Baker: Model & {
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
				Model: Model;
				["Body Colors"]: BodyColors;
			};
			Tailor: Model & {
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
				Model: Model;
				["Body Colors"]: BodyColors;
			};
			Steward: Model & {
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
			Mason: Model & {
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
			Gatherer: Model & {
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
				Model: Model;
				["Body Colors"]: BodyColors;
			};
			Shepherd: Model & {
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
			Farmer: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid;
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					Part: Weld;
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
					Part: Weld;
				};
				["Left Arm"]: Part & {
					LeftShoulderAttachment: Attachment;
				};
				Accessories: Model & {
					Pot: Model & {
						handle: Part & {
							Weld: ManualWeld;
						};
					};
					Hat: Model;
				};
				Animate: Script & {
					idle: StringValue & {
						Animation2: Animation & {
							Weight: NumberValue;
						};
						Animation1: Animation & {
							Weight: NumberValue;
						};
					};
					climb: StringValue & {
						ClimbAnim: Animation;
					};
					sit: StringValue & {
						SitAnim: Animation;
					};
					run: StringValue & {
						RunAnim: Animation;
					};
					ScaleDampeningPercent: NumberValue;
					jump: StringValue & {
						JumpAnim: Animation;
					};
					fall: StringValue & {
						FallAnim: Animation;
					};
					toolnone: StringValue & {
						ToolNoneAnim: Animation;
					};
					walk: StringValue & {
						WalkAnim: Animation;
					};
				};
				["Body Colors"]: BodyColors;
			};
			Blacksmith: Model & {
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
				Accessories: Model & {
					Googles: Model & {
						Center: Part & {
							Head: Weld;
						};
					};
					Malet: Model & {
						Part: Part;
						Center: Part & {
							Part: Weld;
							["Right Arm"]: Weld;
						};
					};
				};
				Animate: Script & {
					idle: StringValue & {
						Animation2: Animation & {
							Weight: NumberValue;
						};
						Animation1: Animation & {
							Weight: NumberValue;
						};
					};
					climb: StringValue & {
						ClimbAnim: Animation;
					};
					sit: StringValue & {
						SitAnim: Animation;
					};
					run: StringValue & {
						RunAnim: Animation;
					};
					ScaleDampeningPercent: NumberValue;
					jump: StringValue & {
						JumpAnim: Animation;
					};
					fall: StringValue & {
						FallAnim: Animation;
					};
					toolnone: StringValue & {
						ToolNoneAnim: Animation;
					};
					walk: StringValue & {
						WalkAnim: Animation;
					};
				};
				["Body Colors"]: BodyColors;
			};
			Sculptor: Model & {
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
			Miner: Model & {
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
				Model: Model;
				["Body Colors"]: BodyColors;
			};
			Alchemist: Model & {
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
				Model: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
					Model: Model;
				};
				["Body Colors"]: BodyColors;
			};
		};
	};
	Animations: Folder & {
		Shop: Folder & {
			Idle: Animation;
		};
		Villager: Folder & {
			Woodsman: Folder & {
				Production: Animation;
			};
			Carpenter: Folder & {
				Production: Animation;
			};
			Baker: Folder & {
				Production: Animation;
			};
			Sleep: Animation;
			Sculptor: Folder & {
				Production: Animation;
			};
			Alchemist: Folder & {
				Production: Animation;
			};
			Gatherer: Folder & {
				Production: Animation;
			};
			Tailor: Folder & {
				Production: Animation;
			};
			Farmer: Folder & {
				Production: Animation;
			};
			Blacksmith: Folder & {
				Production: Animation;
			};
			Mason: Folder & {
				Production: Animation;
			};
			Miner: Folder & {
				Production: Animation;
			};
			Shepherd: Folder & {
				Production: Animation;
			};
		};
	};
	ProximityPrompts: Folder & {
		ProduceAll: ProximityPrompt;
		GiftingProximityPrompt: ProximityPrompt;
		ResourcesPrompt: ProximityPrompt;
	};
	Particles: Part & {
		Rainbow: Attachment & {
			Glare: ParticleEmitter;
			Star: ParticleEmitter;
			Glow: ParticleEmitter;
		};
		Gold: Attachment & {
			Glow: ParticleEmitter;
			Star: ParticleEmitter;
		};
	};
	Walls: Folder & {
		["Evil Wall"]: Model;
		["Castle Wall"]: Model;
		["Log Wall"]: Model;
		["Wooden Fence"]: Model;
		["Stone Wall"]: Model;
		["Ironwood Fence"]: Model;
	};
}
