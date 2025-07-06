type Assets = Folder & {
	Tutorial: Folder & {
		ArrowTutorial: Part & {
			Attachment0: Attachment & {
				Beam: Beam;
			};
			Attachment1: Attachment;
		};
	};
	Animations: Folder & {
		Shop: Folder & {
			King: Animation;
			Merchant: Animation;
			Architect: Animation;
		};
		Villager: Folder & {
			Woodsman: Folder & {
				Production: Animation;
			};
			Witch: Folder & {
				Production: Animation;
			};
			Carpenter: Folder & {
				Production: Animation;
			};
			Beekeeper: Folder & {
				Production: Animation;
			};
			Baker: Folder & {
				Production: Animation;
			};
			Sleep: Animation;
			Scribe: Folder & {
				Production: Animation;
			};
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
		AddFriend: ProximityPrompt;
		GiftingProximityPrompt: ProximityPrompt;
		ResourcesPrompt: ProximityPrompt;
	};
	Walls: Folder & {
		["Evil Wall"]: Model;
		["Castle Wall"]: Model;
		["Log Palisade"]: Model;
		["Ironwood Fence"]: Model;
		["Stone Wall"]: Model;
		["Wooden Fence"]: Model;
	};
	villagerviewports: Folder & {
		Produce: Folder & {
			Wheat: Tool & {
				Handle: Part;
			};
			Log: Tool & {
				Handle: Part;
			};
			Honeycomb: Tool & {
				Handle: Part;
			};
			Clothing: Tool & {
				Handle: Part;
			};
			Sword: Tool & {
				Handle: Part;
			};
			Statue: Tool & {
				Handle: Part;
			};
			Basket: Tool & {
				Handle: Part;
			};
			Planks: Tool & {
				Handle: Part;
			};
			["Iron Bar"]: Tool & {
				Handle: Part;
			};
			Bricks: Tool & {
				Handle: Part;
			};
			Wool: Tool & {
				Handle: Part;
			};
			Crystal: Tool & {
				Handle: MeshPart & {
					Attachment: Attachment & {
						Glare: ParticleEmitter;
						Star: ParticleEmitter;
						Glow: ParticleEmitter;
					};
				};
			};
			Bread: Tool & {
				Handle: Part;
			};
			Book: Tool & {
				Handle: Part;
			};
			Potion: Tool & {
				Handle: Part;
			};
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
			Beekeeper: Model & {
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
					Smoker: Model & {
						Particle: Model & {
							Particle: Part & {
								Weld: ManualWeld;
								TBD: ParticleEmitter;
							};
						};
					};
					Hat: Model;
				};
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
			Scribe: Model & {
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
					Glasses: Model;
					Pen: Model;
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
			Witch: Model & {
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
					Orb: Model & {
						Icosphere: MeshPart & {
							Weld: ManualWeld;
							Attachment: Attachment & {
								Glare: ParticleEmitter;
								Star: ParticleEmitter;
								Glow: ParticleEmitter;
							};
						};
					};
					Hat: Model & {
						Grid: MeshPart & {
							Weld: ManualWeld;
						};
						["Cube.011"]: MeshPart & {
							Weld: ManualWeld;
						};
					};
					Staff: Model & {
						["Cube.007"]: MeshPart & {
							Weld: ManualWeld;
						};
						["Cube.008"]: MeshPart & {
							Weld: ManualWeld;
						};
						["Cube.009"]: MeshPart & {
							Weld: ManualWeld;
							Attachment: Attachment & {
								Glare: ParticleEmitter;
								Star: ParticleEmitter;
								Glow: ParticleEmitter;
							};
						};
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
		};
	};
	Tools: Folder & {
		Produce: Folder & {
			Wheat: Tool & {
				Handle: Part;
			};
			Log: Tool & {
				Handle: Part;
			};
			Iron: Tool & {
				Handle: Part;
			};
			Crystal: Tool & {
				Handle: MeshPart & {
					Attachment: Attachment & {
						Glare: ParticleEmitter;
						Star: ParticleEmitter;
						Glow: ParticleEmitter;
					};
				};
			};
			Sword: Tool & {
				Handle: Part;
			};
			Honey: Tool & {
				Handle: Part;
			};
			Berries: Tool & {
				Handle: Part;
			};
			Book: Tool & {
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
			Figurine: Tool & {
				Handle: Part;
			};
			Planks: Tool & {
				Handle: Part;
			};
		};
	};
	Villagers: Folder & {
		Woodsman: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model;
				Parts: Model & {
					StationParts: Model;
					ProgressFull: Model & {
						["1"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
						["5"]: Model;
						["4"]: Model;
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
				Axe: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
				Hat: Model;
			};
		};
		Carpenter: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model;
				Parts: Model & {
					ProgressFull: Model & {
						["1"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
					StationParts: Model;
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
					RightCollarAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
					roblox: Decal;
					["Left Hip"]: Motor6D;
					WaistCenterAttachment: Attachment;
					["Left Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					LeftCollarAttachment: Attachment;
					NeckAttachment: Attachment;
				};
			};
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
		};
		Scribe: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model;
				Parts: Model & {
					StationParts: Model;
					ProgressFull: Model & {
						["1"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
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
				Glasses: Model;
				Pen: Model;
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
					RightCollarAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					WaistCenterAttachment: Attachment;
					roblox: Decal;
					["Left Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					LeftCollarAttachment: Attachment;
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
			Accessories: Model & {
				Hat: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
			};
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model & {
					Part: Part & {
						Attachment: Attachment & {
							Fire1: ParticleEmitter;
							Spec1: ParticleEmitter;
							Fire2: ParticleEmitter;
						};
						Weld: ManualWeld;
					};
				};
				Parts: Model & {
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
					StationParts: Model;
					ProgressFull: Model & {
						["1"]: Model & {
							Part: Part & {
								Weld: ManualWeld;
							};
						};
					};
				};
			};
		};
		Witch: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model & {
					["1"]: Model & {
						["Cube.008"]: MeshPart & {
							Weld: ManualWeld;
							Attachment: Attachment & {
								Glare: ParticleEmitter;
								Star: ParticleEmitter;
								Glow: ParticleEmitter;
							};
						};
					};
				};
				Parts: Model & {
					StationParts: Model;
					Resources: Model & {
						["1"]: Model & {
							["Cube.008"]: MeshPart & {
								Weld: ManualWeld;
							};
						};
					};
					InProgress: Model & {
						["1"]: Model;
					};
					ProgressFull: Model & {
						["1"]: Model;
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
				Orb: Model & {
					Icosphere: MeshPart & {
						Weld: ManualWeld;
						Attachment: Attachment & {
							Glare: ParticleEmitter;
							Star: ParticleEmitter;
							Glow: ParticleEmitter;
						};
					};
				};
				Hat: Model & {
					Grid: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.011"]: MeshPart & {
						Weld: ManualWeld;
					};
				};
				Staff: Model & {
					["Cube.007"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.008"]: MeshPart & {
						Weld: ManualWeld;
					};
					["Cube.009"]: MeshPart & {
						Weld: ManualWeld;
						Attachment: Attachment & {
							Glare: ParticleEmitter;
							Star: ParticleEmitter;
							Glow: ParticleEmitter;
						};
					};
				};
			};
		};
		Beekeeper: Model & {
			Accessories: Model & {
				Smoker: Model & {
					Particle: Model & {
						Particle: Part & {
							Weld: ManualWeld;
							TBD: ParticleEmitter;
						};
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
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model & {
					Particle: Part & {
						Weld: ManualWeld;
					};
				};
				Parts: Model & {
					ProgressFull: Model & {
						["1"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					StationParts: Model;
				};
			};
		};
		Shepherd: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model;
				Parts: Model & {
					ProgressFull: Model & {
						["2"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
					};
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
					StationParts: Model & {
						Container: Model & {
							Union: UnionOperation & {
								Weld: ManualWeld;
							};
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
					["Left Shoulder"]: Motor6D;
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					WaistCenterAttachment: Attachment;
					roblox: Decal;
					LeftCollarAttachment: Attachment;
					RightCollarAttachment: Attachment;
					WaistBackAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					NeckAttachment: Attachment;
					WaistFrontAttachment: Attachment;
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
		};
		Alchemist: Model & {
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
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model & {
					Particles: Part & {
						Weld: ManualWeld;
						Bubble: ParticleEmitter;
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
					InProgress: Model;
					StationParts: Model & {
						Cauldron: Model;
						Spoon: Model;
						Table: Model;
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
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					["Left Hip"]: Motor6D;
					roblox: Decal;
					RightCollarAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					NeckAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					LeftCollarAttachment: Attachment;
					WaistFrontAttachment: Attachment;
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
					RightCollarAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					["Right Hip"]: Motor6D;
					LeftCollarAttachment: Attachment;
					roblox: Decal;
					["Left Shoulder"]: Motor6D;
					WaistBackAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
					NeckAttachment: Attachment;
				};
			};
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
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
						["2"]: Model;
					};
					StationParts: Model & {
						Container: Model;
						Bush: Model;
					};
				};
			};
			Accessories: Model & {
				Hat: Model;
			};
		};
		Tailor: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						Weld: ManualWeld;
					};
				};
				Particles: Model;
				Parts: Model & {
					ProgressFull: Model & {
						["2"]: Model;
					};
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					StationParts: Model;
					InProgress: Model & {
						["1"]: Model;
						["2"]: Model;
					};
				};
			};
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
					["Left Shoulder"]: Motor6D;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					NeckAttachment: Attachment;
					roblox: Decal;
					WaistBackAttachment: Attachment;
					["Right Shoulder"]: Motor6D;
					["Right Hip"]: Motor6D;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					RightCollarAttachment: Attachment;
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
		Farmer: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						ProximityPrompt: ProximityPrompt;
						WeldConstraint: WeldConstraint;
					};
				};
				SFX: Model & {
					Sleeping: Part & {
						Weld: Weld;
					};
					InProduction: Part & {
						Weld: Weld;
					};
					Impact: Part & {
						Weld: Weld;
					};
				};
				Particles: Model & {
					Sleeping: Model;
					Impact: Model & {
						Part: Part & {
							Water: ParticleEmitter;
						};
					};
					InProduction: Model;
				};
				Parts: Model & {
					Resources: Model & {
						["1"]: Model;
					};
					ProgressFull: Model & {
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
				Humanoid: Humanoid & {
					Animator: Animator;
				};
				["Right Leg"]: Part;
				Head: Part & {
					HatAttachment: Attachment;
					HairAttachment: Attachment;
					Part: Weld;
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
					LeftCollarAttachment: Attachment;
					roblox: Decal;
					RightCollarAttachment: Attachment;
					WaistBackAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistCenterAttachment: Attachment;
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
				Animate: Script & {
					idle: StringValue & {
						Animation2: Animation & {
							Weight: NumberValue;
						};
						Animation1: Animation & {
							Weight: NumberValue;
						};
					};
					jump: StringValue & {
						JumpAnim: Animation;
					};
					sit: StringValue & {
						SitAnim: Animation;
					};
					run: StringValue & {
						RunAnim: Animation;
					};
					ScaleDampeningPercent: NumberValue;
					climb: StringValue & {
						ClimbAnim: Animation;
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
		Blacksmith: Model & {
			Npc: Model & {
				["Left Leg"]: Part;
				Humanoid: Humanoid & {
					Animator: Animator;
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
					jump: StringValue & {
						JumpAnim: Animation;
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
					climb: StringValue & {
						ClimbAnim: Animation;
					};
					walk: StringValue & {
						WalkAnim: Animation;
					};
				};
				Head: Part & {
					HatAttachment: Attachment;
					HairAttachment: Attachment;
					FaceFrontAttachment: Attachment;
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
					NeckAttachment: Attachment;
					roblox: Decal;
					["Right Shoulder"]: Motor6D;
					["Left Hip"]: Motor6D;
					["Left Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					["Right Hip"]: Motor6D;
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
				["Right Leg"]: Part;
				["Body Colors"]: BodyColors;
			};
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
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
					StationParts: Model & {
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
						Anvil: Model & {
							Part3: Part;
							Part1: Part;
							Part5: Part;
							Part13: Part;
							Part8: Part;
							Part9: Part;
							Part2: Part;
							Part11: Part;
							Part6: Part;
							Part7: Part;
							Part12: Part;
							Part4: Part;
							Part10: Part;
						};
					};
					InProgress: Model & {
						["1"]: Model;
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
					Center: Part & {
						Part: Weld;
						["Right Arm"]: Weld;
					};
					Part: Part;
				};
			};
		};
		Mason: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
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
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					StationParts: Model;
					ProgressFull: Model & {
						["1"]: Model;
					};
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
					["Right Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
					roblox: Decal;
					["Right Shoulder"]: Motor6D;
					LeftCollarAttachment: Attachment;
					["Left Shoulder"]: Motor6D;
					BodyFrontAttachment: Attachment;
					["Left Hip"]: Motor6D;
					WaistBackAttachment: Attachment;
					NeckAttachment: Attachment;
				};
			};
		};
		Miner: Model & {
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
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
					Resources: Model & {
						["1"]: Model;
						["3"]: Model;
						["2"]: Model;
					};
					StationParts: Model & {
						Rock: Model;
					};
					ProgressFull: Model;
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
					["Right Hip"]: Motor6D;
					["Left Hip"]: Motor6D;
					roblox: Decal;
					LeftCollarAttachment: Attachment;
					WaistFrontAttachment: Attachment;
					RightCollarAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					WaistCenterAttachment: Attachment;
					NeckAttachment: Attachment;
				};
			};
			Accessories: Model & {
				Pickaxe: Model & {
					handle: Part & {
						Weld: ManualWeld;
					};
				};
				["Miner's Hat"]: Model;
			};
		};
		Sculptor: Model & {
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
					["Left Shoulder"]: Motor6D;
					WaistCenterAttachment: Attachment;
					BodyBackAttachment: Attachment;
					Neck: Motor6D;
					LeftCollarAttachment: Attachment;
					RightCollarAttachment: Attachment;
					roblox: Decal;
					["Right Shoulder"]: Motor6D;
					["Left Hip"]: Motor6D;
					NeckAttachment: Attachment;
					BodyFrontAttachment: Attachment;
					WaistBackAttachment: Attachment;
					["Right Hip"]: Motor6D;
					WaistFrontAttachment: Attachment;
				};
			};
			Station: Model & {
				Interaction: Model & {
					SupplyProduce: Part & {
						Weld: ManualWeld;
						ProximityPrompt: ProximityPrompt;
					};
				};
				Particles: Model;
				Parts: Model & {
					StationParts: Model;
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
				Hammer: Model & {
					Part: Part & {
						Weld: ManualWeld;
					};
					handle: Part & {
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
		};
	};
	Particles: Part & {
		WalkingEffects: Attachment & {
			ParticleEmitter: ParticleEmitter;
		};
		CollectionRainbow: Attachment & {
			Spark2: ParticleEmitter;
		};
		CollectionNormal: Attachment & {
			Spark2: ParticleEmitter;
		};
		Gold: Attachment & {
			Glow: ParticleEmitter;
			Star: ParticleEmitter;
		};
		Rainbow: Attachment & {
			Glare: ParticleEmitter;
			Star: ParticleEmitter;
			Glow: ParticleEmitter;
		};
		CollectionGold: Attachment & {
			Spark2: ParticleEmitter;
		};
		Surprise: Attachment;
		Poof: Attachment & {
			Frost: ParticleEmitter;
		};
	};
	UI: Folder & {
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
		HoverBox: BillboardGui & {
			Frame: Frame & {
				QueueLabel: TextLabel;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
				UIGradient: UIGradient;
			};
		};
		GameUI: ScreenGui & {
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
			InviteIncentive: Frame & {
				InviteIncentive: TextLabel & {
					UIStroke: UIStroke;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					InviteIncentiveSuccess: LocalScript;
				};
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
			DailyQuests: Frame & {
				UIGradient: UIGradient;
				Quest1: TextButton & {
					UIStrokeText: UIStroke;
				};
				Quest3: TextButton & {
					UIStrokeText: UIStroke;
				};
				UICorner: UICorner;
				Quest2: TextButton & {
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
			Introtext: Frame & {
				UIAspectRatioConstraint: UIAspectRatioConstraint;
				text: TextLabel & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStroke: UIStroke;
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
				Village: TextButton & {
					UIStrokeBG: UIStroke;
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					bg: ImageLabel;
					UIStrokeText: UIStroke;
				};
				Sell: TextButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStrokeBG: UIStroke;
					bg: ImageLabel;
					UIStrokeText: UIStroke;
				};
				Buy: TextButton & {
					UIAspectRatioConstraint: UIAspectRatioConstraint;
					UIStrokeText: UIStroke;
					bg: ImageLabel;
					UIStrokeBG: UIStroke;
				};
			};
		};
		NpcDialogues: BillboardGui & {
			Wall: Frame & {
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
			Buy: Frame & {
				UIGradient: UIGradient;
				TextLabel: TextLabel & {
					UIStroke: UIStroke;
				};
			};
		};
		VillagerRenders: ScreenGui & {
			Woodsman: ViewportFrame & {
				script: LocalScript;
			};
			Merchant: ViewportFrame & {
				script: LocalScript;
			};
			LocalScript: LocalScript;
			Beekeeper: ViewportFrame & {
				script: LocalScript;
			};
			Alchemist: ViewportFrame & {
				script: LocalScript;
			};
			Tailor: ViewportFrame & {
				script: LocalScript;
			};
			Steward: ViewportFrame & {
				script: LocalScript;
			};
			Miner: ViewportFrame & {
				script: LocalScript;
			};
			Carpenter: ViewportFrame & {
				script: LocalScript;
			};
			Scribe: ViewportFrame & {
				script: LocalScript;
			};
			Witch: ViewportFrame & {
				script: LocalScript;
			};
			Gatherer: ViewportFrame & {
				script: LocalScript;
			};
			Baker: ViewportFrame & {
				script: LocalScript;
			};
			Sculptor: ViewportFrame & {
				script: LocalScript;
			};
			Farmer: ViewportFrame & {
				script: LocalScript;
			};
			Mason: ViewportFrame & {
				script: LocalScript;
			};
			Shepherd: ViewportFrame & {
				script: LocalScript;
			};
			Blacksmith: ViewportFrame & {
				script: LocalScript;
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
					bg: ImageLabel;
					HoverDetect: TextButton;
				};
				Option4: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					bg: ImageLabel;
					HoverDetect: TextButton;
				};
				Option2: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					bg: ImageLabel;
					HoverDetect: TextButton;
				};
				Option1: Frame & {
					number: TextLabel & {
						UIStroke: UIStroke;
					};
					text: TextLabel & {
						UIStroke: UIStroke;
					};
					bg: ImageLabel;
					HoverDetect: TextButton;
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
		WallRenders: ScreenGui & {
			["Evil Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Castle Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Log Palisade"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Ironwood Fence"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Stone Wall"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
			["Wooden Fence"]: ViewportFrame & {
				LocalScript: LocalScript;
			};
		};
	};
}
