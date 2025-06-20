type Assets = Folder & {
	UI: Folder & {
		GameUI: ScreenGui & {
			GiftList: CanvasGroup & {
				Strokes: LocalScript;
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
						SampleName: TextLabel & {
							TextLabel: TextLabel & {
								UIAspectRatioConstraint: UIAspectRatioConstraint;
								UIStroke: UIStroke;
							};
							UIAspectRatioConstraint: UIAspectRatioConstraint;
						};
						UIStroke: UIStroke;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						Strokes: LocalScript;
					};
				};
				bg: ImageLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			Viewports: Folder & {
				mason: ViewportFrame;
			};
			PlaceFrame: Frame & {
				LocalScript: LocalScript;
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
			Playercash: TextLabel & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				UIStroke: UIStroke;
			};
			RobuxStore: Frame & {
				Strokes: LocalScript;
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
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ScrollingFrame: ScrollingFrame & {
					Purchase1: Frame & {
						purchaseoptions: Frame & {
							giftx1: ImageButton & {
								UIStroke: UIStroke;
							};
							Strokes: LocalScript;
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
						items: Frame & {
							m2: ViewportFrame;
							m1: ViewportFrame;
							b2: ViewportFrame;
							s1: ViewportFrame;
							b1: ViewportFrame;
							s3: ViewportFrame;
							s2: ViewportFrame;
						};
						Strokes: LocalScript;
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
							Strokes: LocalScript;
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
						Strokes: LocalScript;
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
			};
			Wall: CanvasGroup & {
				Strokes: LocalScript;
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
						SampleName: TextLabel & {
							UIStroke: UIStroke;
						};
						Strokes: LocalScript;
						Multiplier: TextLabel & {
							UIStroke: UIStroke;
						};
						Price: TextLabel & {
							UIStroke: UIStroke;
						};
						WallViewPort: ViewportFrame & {
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
				Strokes: LocalScript;
				bg: ImageLabel;
				Close: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
				};
				["bg header"]: ImageLabel & {
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ReStock: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
				};
				ScrollingFrame: ScrollingFrame & {
					UIPadding: UIPadding;
					UIListLayout: UIListLayout;
					Sample: ImageButton & {
						Stock: TextLabel & {
							UIStroke: UIStroke;
						};
						Price: TextLabel & {
							UIStroke: UIStroke;
						};
						RarityMythic: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityLegendary: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityUncommon: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityEpic: ImageLabel & {
							UIStroke: UIStroke;
						};
						Strokes: LocalScript;
						VillagerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Tier: TextLabel & {
							UIStroke: UIStroke;
						};
						RarityRare: ImageLabel & {
							UIStroke: UIStroke;
						};
						RarityCommon: ImageLabel & {
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						VillagerViewPort: ViewportFrame & {
							UIStroke: UIStroke;
						};
					};
					ScrollThickness: LocalScript;
					Buy: ImageButton & {
						Normal: TextButton & {
							UIStroke2: UIStroke;
							UIStroke1: UIStroke;
						};
						Strokes: LocalScript;
						Robux: TextButton & {
							UIStroke2: UIStroke;
							UIStroke1: UIStroke;
						};
						Gift: ImageButton & {
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
					};
				};
			};
			Introtext: Frame & {
				text: TextLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
				};
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				Strokes: LocalScript;
			};
			HUD: Frame & {
				Shop: TextButton & {
					UIStroke2: UIStroke;
					UIStroke1: UIStroke;
					bg: ImageLabel;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Strokes: LocalScript;
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
		HoverBox: BillboardGui & {
			LocalScript: LocalScript;
			Frame: Frame & {
				UIGradient: UIGradient;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
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
	};
	StandModels: Folder & {
		Gathererend: Model & {
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
		Merchantend: Model & {
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
		Masonend: Model & {
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
		Bakerend: Model & {
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
		Gathererstart: Model & {
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
		Farmerstart: Model & {
			Station: Model & {
				Particles: Model;
				Parts: Model & {
					Resources: Model;
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
			Accessories: Model & {
				Pot: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
				Hat: Model;
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
		};
		Bakerstart: Model & {
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
		Woodsmanstart: Model & {
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
		Minerend: Model & {
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
		Sculptorstart: Model & {
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
		Woodsmanend: Model & {
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
		Blacksmithstart: Model & {
			Station: Model & {
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
					ProgressFull: Model;
					InProgress: Model & {
						["1"]: Model;
					};
					StationParts: Model & {
						Rack: Model & {
							Part3: Part;
							Part2: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part7: Part;
							Part8: Part;
							Part4: Part;
						};
						Anvil: Model & {
							Part3: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part8: Part;
							Part4: Part;
							Part2: Part;
							Part11: Part;
							Part13: Part;
							Part7: Part;
							Part12: Part;
							Part10: Part;
							Part9: Part;
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
		Blacksmithend: Model & {
			Station: Model & {
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
					ProgressFull: Model;
					StationParts: Model & {
						Rack: Model & {
							Part3: Part;
							Part2: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part7: Part;
							Part8: Part;
							Part4: Part;
						};
						Anvil: Model & {
							Part3: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part8: Part;
							Part4: Part;
							Part2: Part;
							Part11: Part;
							Part13: Part;
							Part7: Part;
							Part12: Part;
							Part10: Part;
							Part9: Part;
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
		Minerstart: Model & {
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
		Stewardend: Model & {
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
		Masonstart: Model & {
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
		Sculptorend: Model & {
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
		Tailorstart: Model & {
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
		Shepherdend: Model & {
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
		Tailorend: Model & {
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
		Carpenterstart: Model & {
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
		Merchantstart: Model & {
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
		Shepherdstart: Model & {
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
		Carpenterend: Model & {
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
		Herbaliststart: Model & {
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
		Stewardstart: Model & {
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
		Herbalistend: Model & {
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
		Farmerend: Model & {
			Station: Model & {
				Particles: Model;
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
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
					ProgressFull: Model & {
						["1"]: Model;
					};
				};
			};
			Accessories: Model & {
				Pot: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
				Hat: Model;
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
		};
	};
	Villagers: Folder & {
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
					StationParts: Model & {
						Rack: Model & {
							Part3: Part;
							Part2: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part7: Part;
							Part8: Part;
							Part4: Part;
						};
						Anvil: Model & {
							Part3: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part8: Part;
							Part4: Part;
							Part2: Part;
							Part11: Part;
							Part13: Part;
							Part7: Part;
							Part12: Part;
							Part10: Part;
							Part9: Part;
						};
					};
					ProgressFull: Model;
					InProgress: Model & {
						["1"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
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
		VillagerExample: Model & {
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
					StationParts: Model & {
						Rack: Model & {
							Part3: Part;
							Part2: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part7: Part;
							Part8: Part;
							Part4: Part;
						};
						Anvil: Model & {
							Part3: Part;
							Part1: Part;
							Part5: Part;
							Part6: Part;
							Part8: Part;
							Part4: Part;
							Part2: Part;
							Part11: Part;
							Part13: Part;
							Part7: Part;
							Part12: Part;
							Part10: Part;
							Part9: Part;
						};
					};
					ProgressFull: Model;
					InProgress: Model & {
						["1"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
						["4"]: Model;
						["3"]: Model;
						["2"]: Model;
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
		Farmer: Model & {
			Accessories: Model & {
				Pot: Model;
				Hat: Model;
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
		};
	};
	Animations: Folder;
}
