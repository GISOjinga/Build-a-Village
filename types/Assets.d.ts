type Assets = Folder & {
	UI: Folder & {
		GameUI: ScreenGui & {
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
	};
	Villagers: Folder & {
		Blacksmith: Model & {
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
			Station: Model & {
				Particles: Model;
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
		};
	};
	Animations: Folder;
}
