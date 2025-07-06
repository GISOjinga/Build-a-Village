type GameUI = ScreenGui & {
	PromoCode: Frame & {
		Title: TextLabel & {
			UIStroke: UIStroke;
		};
		RedeemButton: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		Close: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		TextBox: TextBox & {
			UIStrokeBG: UIStroke;
			UIStrokeText: UIStroke;
		};
		UIStroke: UIStroke;
		bg: ImageLabel;
		["bg header"]: ImageLabel & {
			UIStroke: UIStroke;
		};
	};
	DailyQuestsTab: Frame & {
		UIGradient: UIGradient;
		Quest1: TextButton & {
			text: TextLabel & {
				UIStrokeText: UIStroke;
			};
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		Quest3: TextButton & {
			text: TextLabel & {
				UIStrokeText: UIStroke;
			};
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		UICorner: UICorner;
		Quest2: TextButton & {
			text: TextLabel & {
				UIStrokeText: UIStroke;
			};
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
	};
	ConfirmationPrompt: Frame & {
		message: TextLabel & {
			UIStroke: UIStroke;
		};
		Decline: TextButton & {
			bg: ImageLabel;
			TextLabel: TextLabel & {
				UIStrokeText: UIStroke;
			};
			UIStrokeBG: UIStroke;
		};
		title: TextLabel & {
			UIStroke: UIStroke;
		};
		Accept: TextButton & {
			bg: ImageLabel;
			TextLabel: TextLabel & {
				UIStrokeText: UIStroke;
			};
			UIStrokeBG: UIStroke;
		};
		["bg header"]: ImageLabel & {
			UIStroke: UIStroke;
		};
		UIStroke: UIStroke;
		bg: ImageLabel;
	};
	GiftList: Frame & {
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
		ScrollingFrame: ScrollingFrame & {
			UIListLayout: UIListLayout;
			UIPadding: UIPadding;
			Sample: ImageButton & {
				UIStroke: UIStroke;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				SampleName: TextLabel & {
					UIStroke: UIStroke;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIPadding: UIPadding;
				};
			};
		};
		UIAspectRatioConstraint: UIAspectRatioConstraint;
		bg: ImageLabel & {
			UIAspectRatioConstraint: UIAspectRatioConstraint;
		};
	};
	Viewports: Folder & {
		mason: ViewportFrame;
	};
	DailyRewards: Frame & {
		Prize1: ImageLabel & {
			UIStroke: UIStroke;
		};
		Close: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		Prize4: ImageLabel & {
			UIStroke: UIStroke;
		};
		ClaimButton: TextButton & {
			UIStrokeText: UIStroke;
			bg: ImageLabel;
			UIStrokeBG: UIStroke;
		};
		bg: ImageLabel;
		["bg header"]: ImageLabel & {
			UIStroke: UIStroke;
		};
		Prize3: ImageLabel & {
			UIStroke: UIStroke;
		};
		Prize5: ImageLabel & {
			UIStroke: UIStroke;
		};
		TimeTillNext: TextButton & {
			bg: ImageLabel;
			UIStrokeText: UIStroke;
			UIPadding: UIPadding;
			UIStrokeBG: UIStroke;
		};
		UIStroke: UIStroke;
		Prize2: ImageLabel & {
			UIStroke: UIStroke;
		};
		TextLabel: TextLabel & {
			UIStroke: UIStroke;
		};
	};
	InviteIncentive: Frame & {
		InviteIncentive: TextLabel & {
			UIStroke: UIStroke;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			InviteIncentiveSuccess: LocalScript;
		};
	};
	Inventory: Frame & {
		Hotbar: Frame & {
			UIListLayout: UIListLayout;
			SlotExample: ImageButton & {
				UICorner: UICorner;
				Key: TextLabel & {
					UICorner: UICorner;
					UIPadding: UIPadding;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ToolName: TextLabel & {
					UICorner: UICorner;
					UIPadding: UIPadding;
				};
			};
		};
		Container: Frame & {
			SortCategory: Frame & {
				ByName: ImageButton & {
					UICorner: UICorner;
					TextLabel: TextLabel & {
						UIPadding: UIPadding;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				ByRarity: ImageButton & {
					UICorner: UICorner;
					TextLabel: TextLabel & {
						UIPadding: UIPadding;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				UIListLayout: UIListLayout;
				Mutations: ImageButton & {
					UICorner: UICorner;
					TextLabel: TextLabel & {
						UIPadding: UIPadding;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Villagers: ImageButton & {
					UICorner: UICorner;
					TextLabel: TextLabel & {
						UIPadding: UIPadding;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Produce: ImageButton & {
					UICorner: UICorner;
					TextLabel: TextLabel & {
						UIPadding: UIPadding;
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			UICorner: UICorner;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			TopBar: Frame & {
				SearchBox: TextBox & {
					UICorner: UICorner;
				};
				Title: TextLabel;
				Close: TextButton & {
					UICorner: UICorner;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			Grid: ScrollingFrame & {
				ContainerFrame: Frame & {
					UIGridLayout: UIGridLayout & {
						UIAspectRatioConstraint: UIAspectRatioConstraint;
					};
					UIPadding: UIPadding;
					ContainerExample: Frame & {
						Clickable: TextButton & {
							UICorner: UICorner;
							UIPadding: UIPadding;
						};
					};
				};
				UICorner: UICorner;
			};
		};
	};
	Introtext: Frame & {
		UIAspectRatioConstraint: UIAspectRatioConstraint;
		text: TextLabel & {
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UIStroke: UIStroke;
		};
	};
	PlaceFrame: Frame & {
		Placetext: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		LeftPress: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		RightPress: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
	};
	RobuxStore: Frame & {
		bg: ImageLabel;
		Header: TextLabel & {
			UIStroke: UIStroke;
		};
		Close: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		["bg header"]: ImageLabel & {
			UIStroke: UIStroke;
		};
		UIStroke: UIStroke;
		ScrollingFrame: ScrollingFrame & {
			UIPadding: UIPadding;
			UIListLayout: UIListLayout;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			StarterPack: Frame & {
				purchaseoptions: Frame & {
					gift: ImageButton & {
						UIStroke: UIStroke;
					};
					buy: TextButton & {
						UIStrokeBG: UIStroke;
						bg: ImageLabel;
						UIStrokeText: UIStroke;
					};
				};
				LimitedTime: TextLabel & {
					UIStroke: UIStroke;
				};
				items: Frame & {
					m2: ViewportFrame & {
						UIStroke: UIStroke;
					};
					b1: ViewportFrame & {
						UIStroke: UIStroke;
					};
					m1: ViewportFrame & {
						UIStroke: UIStroke;
					};
					cash: TextLabel & {
						UIStroke: UIStroke;
					};
				};
				decor: Frame & {
					King: ViewportFrame & {
						script: LocalScript;
						King: Model & {
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
							["Body Colors"]: BodyColors;
						};
					};
					rotate: LocalScript;
					title: TextLabel & {
						UIStroke: UIStroke;
					};
					desc: TextLabel & {
						UIStroke: UIStroke;
					};
				};
				packname: TextLabel & {
					UIStroke: UIStroke;
				};
				CountDown: TextLabel & {
					UIStroke: UIStroke;
				};
				UIStroke: UIStroke;
				bg: ImageLabel;
				["new"]: TextLabel & {
					UIStroke: UIStroke;
				};
			};
			LaunchPack: Frame & {
				purchaseoptions: Frame & {
					gift: ImageButton & {
						UIStroke: UIStroke;
					};
					buy: TextButton & {
						price: TextLabel & {
							UIStroke: UIStroke;
						};
						UIStroke: UIStroke;
						bg: ImageLabel;
						markdown: TextLabel & {
							Frame: Frame;
							UIStroke: UIStroke;
						};
					};
				};
				LimitedTime: TextLabel & {
					UIStroke: UIStroke;
				};
				LocalScript: LocalScript;
				items: Frame & {
					s3: ViewportFrame & {
						UIGradient: UIGradient;
						UIStroke: UIStroke & {
							UIGradient: UIGradient;
						};
					};
					s1: ViewportFrame & {
						UIGradient: UIGradient;
						UIStroke: UIStroke & {
							UIGradient: UIGradient;
						};
					};
					b1: ViewportFrame & {
						UIGradient: UIGradient;
						UIStroke: UIStroke & {
							UIGradient: UIGradient;
						};
					};
					s4: ViewportFrame & {
						UIGradient: UIGradient;
						UIStroke: UIStroke & {
							UIGradient: UIGradient;
						};
					};
					s2: ViewportFrame & {
						UIGradient: UIGradient;
						UIStroke: UIStroke & {
							UIGradient: UIGradient;
						};
					};
				};
				decor: ViewportFrame;
				timeleft: TextLabel & {
					UIStroke: UIStroke;
				};
				packname: TextLabel & {
					UIStroke: UIStroke;
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
	Wall: Frame & {
		Header: TextLabel & {
			UIStroke: UIStroke;
		};
		Close: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		["bg header"]: ImageLabel & {
			UIStroke: UIStroke;
		};
		UIAspectRatioConstraint: UIAspectRatioConstraint;
		bg: ImageLabel;
		ScrollingFrame: ScrollingFrame & {
			UIListLayout: UIListLayout;
			UIPadding: UIPadding;
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
				RobuxPrice: TextLabel & {
					UIStroke: UIStroke;
				};
				unequip: ImageButton & {
					UIStroke: UIStroke;
					text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
				SampleName: TextLabel & {
					UIStroke: UIStroke;
				};
				equip: ImageButton & {
					UIStroke: UIStroke;
					text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
				Multiplier: TextLabel & {
					UIStroke: UIStroke;
				};
				bg: ImageLabel & {
					UIStroke: UIStroke;
				};
				buy: ImageButton & {
					UIStroke: UIStroke;
					text: TextLabel & {
						UIStroke: UIStroke;
					};
				};
			};
		};
	};
	Village: Frame & {
		Countdown: TextLabel & {
			UIStroke: UIStroke;
		};
		ReStock: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		bg: ImageLabel;
		Close: TextButton & {
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		["bg header"]: ImageLabel & {
			UIStroke: UIStroke;
		};
		UIStroke: UIStroke;
		UIAspectRatioConstraint: UIAspectRatioConstraint;
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
				bg: ImageLabel & {
					UIStroke: UIStroke;
				};
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
	};
	Playercash: TextLabel & {
		subtract: TextLabel & {
			UIStroke: UIStroke;
		};
		logics: LocalScript;
		UIStroke: UIStroke;
		UIAspectRatioConstraint: UIAspectRatioConstraint;
		add: TextLabel & {
			UIStroke: UIStroke;
		};
	};
	HUD: Frame & {
		Shop: TextButton & {
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		Walls: TextButton & {
			bg: ImageLabel;
			UIStrokeBG: UIStroke;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UIStrokeText: UIStroke;
		};
		Sell: TextButton & {
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		DailyRewards: TextButton & {
			UIPadding: UIPadding;
			UIStrokeBG: UIStroke;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		Village: TextButton & {
			UIStrokeBG: UIStroke;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			bg: ImageLabel;
			UIStrokeText: UIStroke;
		};
		Quests: TextButton & {
			UIPadding: UIPadding;
			UIStrokeBG: UIStroke;
			bg: ImageLabel;
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UIStrokeText: UIStroke;
		};
		Buy: TextButton & {
			UIAspectRatioConstraint: UIAspectRatioConstraint;
			UIStrokeText: UIStroke;
			bg: ImageLabel;
			UIStrokeBG: UIStroke;
		};
	};
}
