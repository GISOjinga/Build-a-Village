-- Compiled with roblox-ts v3.0.0
-- Define types for combat responses and nodes
local combatRoutesTable = {
	Ground = {
		M1 = {
			M1 = {
				M1 = {
					M1 = {
						M1 = {
							Result = {
								type = "Reset",
								action = { "Rm1", "CDm1", "KB" },
							},
						},
						M2 = {
							Result = {
								type = "NewContext",
								action = { "LA" },
								context = "AirX1",
							},
						},
						ResetIfDidntHit = true,
					},
					M2 = {
						Result = {
							type = "NewContext",
							action = { "LA" },
							context = "AirX1",
						},
						ResetIfDidntHit = true,
					},
				},
			},
			M2 = {
				M1 = {
					Result = {
						type = "Reset",
						action = { "M3", "Stun" },
					},
				},
			},
		},
		M2 = {
			M2 = {
				M2 = {
					M2 = {
						M2 = {
							Result = {
								type = "Reset",
								action = { "Rm2", "CDm2", "KB" },
							},
						},
					},
				},
			},
		},
	},
	AirX1 = {
		M1 = {
			M1 = {
				M2 = {
					Result = {
						type = "NewContext",
						action = { "2LA" },
						context = "AirX2",
					},
				},
				M1 = {
					M2 = {
						Result = {
							type = "Reset",
							action = { "KD" },
							context = "Ground",
						},
					},
					M1 = {
						M1 = {
							Result = {
								type = "Reset",
								action = { "KD" },
								context = "Ground",
							},
						},
					},
				},
			},
			M2 = {
				Result = {
					type = "Reset",
					action = { "KD" },
					context = "Ground",
				},
			},
		},
		M2 = {
			Result = {
				type = "Reset",
				action = { "KD" },
				context = "Ground",
			},
		},
	},
	AirX2 = {
		M1 = {
			M1 = {
				M2 = {
					Result = {
						type = "Reset",
						action = { "KD" },
						context = "Ground",
					},
				},
				M1 = {
					Result = {
						type = "Reset",
						action = { "KD" },
						context = "Ground",
					},
				},
			},
			M2 = {
				Result = {
					type = "Reset",
					action = { "KD" },
					context = "Ground",
				},
			},
		},
		M2 = {
			Result = {
				type = "Reset",
				action = { "KD" },
				context = "Ground",
			},
		},
	},
}
-- Updated calculate function
local function calculate(sequence, nextKey, context, isChakraWallWalking)
	if isChakraWallWalking == nil then
		isChakraWallWalking = false
	end
	-- Initialize at the root of the table for the current context
	local currentNode = combatRoutesTable[context]
	-- Traverse the table following the sequence
	for _, key in sequence do
		if not currentNode[key] then
			return {
				type = "Reset",
				action = { "Rm1" },
				context = "Ground",
			}
		end
		currentNode = currentNode[key]
	end
	-- Look for the next key in the current node
	if not currentNode[nextKey] then
		return {
			type = "Reset",
			action = { "Rm1" },
			context = "Ground",
		}
	end
	local resultNode = currentNode[nextKey]
	if resultNode.Result then
		return if (resultNode.Result.context ~= "Ground" and isChakraWallWalking) then {
			type = "Reset",
			action = { "Rm1", "CDm1", "KB" },
			context = "Ground",
		} else resultNode.Result
	end
	-- Return "Continue" if traversal is possible but no explicit result is reached
	return {
		type = "Continue",
		action = { "ST1" },
	}
end
local default = calculate
return {
	default = default,
}
