type Assets = Folder & {
	UI: Folder & {
		HoverBox: BillboardGui & {
			LocalScript: LocalScript;
			Frame: Frame & {
				UIGradient: UIGradient;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
			};
		};
		GameUIOld: ScreenGui & {
			HUD: Frame & {
				Shop: ImageButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Village: ImageButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Sell: ImageButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
				Buy: ImageButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
				};
			};
			Villagers: Frame & {
				Countdown: TextLabel & {
					UIStroke: UIStroke;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStrokeThickness: LocalScript;
				};
				Content: ScrollingFrame & {
					BUY: ImageButton & {
						BasicBuy: ImageButton & {
							Cost: TextLabel & {
								UIStroke: UIStroke;
							};
						};
						Gift: ImageButton;
						bg: ImageLabel;
						RobuxBuy: ImageButton & {
							Cost: TextLabel & {
								UIStroke: UIStroke;
							};
							Robux: ImageLabel;
						};
					};
					UIPadding: UIPadding;
					UIListLayout: UIListLayout;
					Example: ImageButton & {
						rarity: ImageLabel;
						item: ImageLabel;
						Tier: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						Price: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						StockCount: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						VillagerName: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					ScrollbarThickness: LocalScript;
				};
				Close: ImageButton;
				MainBG: ImageLabel;
				HeaderBG: ImageLabel;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				ReStock: ImageButton;
			};
			RobuxStore: Frame & {
				HeaderBg: ImageLabel;
				HeaderText: TextLabel & {
					UIStrokeThickness: LocalScript;
					UIStroke: UIStroke;
				};
				Close: ImageButton;
				Bg: ImageLabel;
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				Content: ScrollingFrame & {
					Purchase1: Frame & {
						items: Frame & {
							m2: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							m1: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							s3: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							s1: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							b1: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							b2: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							s2: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
						};
						LimitedTime: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						CountDown: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						purchaseoptions: Frame & {
							robuxPurchasex1: ImageButton & {
								packquantity: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								logo: ImageLabel;
								slash: ImageLabel;
								Text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								MarkUp: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							robuxPurchasex3: ImageButton & {
								packquantity: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								logo: ImageLabel;
								slash: ImageLabel;
								Text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								MarkUp: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							giftx10: ImageButton;
							giftx3: ImageButton;
							robuxPurchasex10: ImageButton & {
								packquantity: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								logo: ImageLabel;
								slash: ImageLabel;
								Text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								MarkUp: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							giftx1: ImageButton;
						};
						PackName: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						New: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
					};
					Purchase2: Frame & {
						items: Frame & {
							m2: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							m1: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							s3: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							s1: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							b1: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							b2: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							s2: ImageLabel & {
								text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
						};
						LimitedTime: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						CountDown: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						purchaseoptions: Frame & {
							robuxPurchasex1: ImageButton & {
								packquantity: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								logo: ImageLabel;
								slash: ImageLabel;
								Text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								MarkUp: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							robuxPurchasex3: ImageButton & {
								packquantity: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								logo: ImageLabel;
								slash: ImageLabel;
								Text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								MarkUp: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							giftx10: ImageButton;
							giftx3: ImageButton;
							robuxPurchasex10: ImageButton & {
								packquantity: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								logo: ImageLabel;
								slash: ImageLabel;
								Text: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
								MarkUp: TextLabel & {
									UIStrokeThickness: LocalScript;
									UIStroke: UIStroke;
								};
							};
							giftx1: ImageButton;
						};
						PackName: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						New: TextLabel & {
							UIStrokeThickness: LocalScript;
							UIStroke: UIStroke;
						};
					};
					ScrollbarThickness: LocalScript;
				};
			};
		};
		GameUI: ScreenGui & {
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
						VillagerName: TextLabel & {
							UIStroke: UIStroke;
						};
						Strokes: LocalScript;
						Stock: TextLabel & {
							UIStroke: UIStroke;
						};
						Tier: TextLabel & {
							UIStroke: UIStroke;
						};
						Price: TextLabel & {
							UIStroke: UIStroke;
						};
						bg: ImageLabel;
						RarityCommon: ImageLabel & {
							UIStroke: UIStroke;
						};
						VillagerViewPort: ViewportFrame & {
							UIStroke: UIStroke;
						};
					};
					UIAspectRatioConstraint: UIAspectRatioConstraint;
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
						Strokes: LocalScript;
						UIStroke: UIStroke;
						UIAspectRatioConstraint: UIAspectRatioConstraint;
						SampleName: TextButton & {
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
