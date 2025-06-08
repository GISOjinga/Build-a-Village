import Object from "@rbxts/object-utils";

// Define types for combat responses and nodes
type CombatTypes = "M1" | "M2";
type CombatStates = "Ground" | "AirX1" | "AirX2";

type CombatResultType = "End" | "NewContext" | "Reset" | "Continue" | "Action";

type PossibleResponses =
    | "Stun"
    | "KB"
    | "KD"
    | "AirX1"
    | "AirX2"
    | "Rm1"
    | "Rm2"
    | "CDm1"
    | "CDm2"
    | "SCDm1"
    | "SCDm2"
    | "ST1"
    | "ST2"
    | "LA"
    | "2LA"
    | "FTS"
    | "LStun"
    | "MStun"
    | "HStun"
    | "M3"; // added M3 for the m3 result

interface CombatResult {
    type: CombatResultType;
    action: PossibleResponses[];
    context?: CombatStates; // For transitions
}

type CombatNode = {
    M1?: CombatNode | { Result: CombatResult, ResetIfDidntHit?: boolean };
    M2?: CombatNode | { Result: CombatResult, ResetIfDidntHit?: boolean };
};

type CombatRoutesTable = {
    Ground: CombatNode;
    AirX1: CombatNode;
    AirX2: CombatNode;
};

const combatRoutesTable: CombatRoutesTable = {
    Ground: {
        M1: {
            M1: {
                M1: {
                    M1: {
                        M1: { Result: { type: "Reset", action: ["Rm1", "CDm1", "KB"] } },
                        M2: { Result: { type: "NewContext", action: ["LA"], context: "AirX1" } },
                        ResetIfDidntHit: true,
                    },
                    M2: {
                        Result: { type: "NewContext", action: ["LA"], context: "AirX1" },
                        ResetIfDidntHit: true,
                    },
                },
            },
            // Changed M2 from a terminal node to one that supports an M1 branch for the m3 result.
            M2: {
                M1: { Result: { type: "Reset", action: ["M3", "Stun"] } },
            },
        },
        M2: {
            M2: {
                M2: {
                    M2: {
                        M2: { Result: { type: "Reset", action: ["Rm2", "CDm2", "KB"] } },
                    },
                },
            },
        },
    },
    AirX1: {
        M1: {
            M1: {
                // This branch now returns only the m3 result.
                M2: { Result: { type: "NewContext", action: ["2LA"], context: "AirX2" } },
                M1: {
                    M2: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
                    M1: {
                        M1: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
                    },
                },
            },
            M2: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
        },
        M2: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
    },
    AirX2: {
        M1: {
            M1: {
                M2: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
                M1: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
            },
            M2: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
        },
        M2: { Result: { type: "Reset", action: ["KD"], context: "Ground" } },
    },
};

// Updated calculate function
function calculate(
    sequence: CombatTypes[],
    nextKey: CombatTypes,
    context: CombatStates,
    isChakraWallWalking: boolean = false
): CombatResult {
    // Initialize at the root of the table for the current context
    let currentNode: CombatNode = combatRoutesTable[context];

    // Traverse the table following the sequence
    for (const key of sequence) {
        if (!currentNode[key]) {
            return { type: "Reset", action: ["Rm1"], context: "Ground" }; // Reset if sequence can't continue
        }
        currentNode = currentNode[key] as CombatNode;
    }

    // Look for the next key in the current node
    if (!currentNode[nextKey]) {
        return { type: "Reset", action: ["Rm1"], context: "Ground" }; // Reset if no valid next key
    }

    const resultNode = currentNode[nextKey] as { Result: CombatResult };
    if (resultNode.Result) {
        return (resultNode.Result.context !== "Ground" && isChakraWallWalking) ? { type: "Reset", action: ["Rm1", "CDm1", "KB"], context: "Ground" } : resultNode.Result // Reset if sequence can't continue;
    }

    // Return "Continue" if traversal is possible but no explicit result is reached
    return { type: "Continue", action: ["ST1"] };
}

export default calculate;
