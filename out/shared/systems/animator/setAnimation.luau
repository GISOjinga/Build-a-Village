-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local _jecsComponents = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "jecs", "jecsComponents")
local Body = _jecsComponents.Body
local StopAnimationsExcept = _jecsComponents.StopAnimationsExcept
local paths = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "utils", "paths").default
local default = function(world)
	-- stop all other animations
	for bodyEntity, body, exceptions in world:query(Body, StopAnimationsExcept) do
		-- Remove the StopAnimations component after processing
		world:remove(bodyEntity, StopAnimationsExcept)
		-- Stop all animations except for the specified exceptions if any
		for index, track in pairs(body.animator:GetPlayingAnimationTracks()) do
			local _result = track.Animation
			if _result ~= nil then
				_result = _result:IsDescendantOf(paths.Assets.Animations)
			end
			local _condition = not _result
			if not _condition then
				local _result_1 = exceptions
				if _result_1 ~= nil then
					_result_1 = table.find(_result_1, track) ~= nil
				end
				_condition = _result_1
			end
			if _condition then
				continue
			end
			print("Stopping ALL")
			track:Stop()
		end
	end
	-- Play animations based on SetAnimation component
	-- for (const [entity, body, { state, transition, stopAllOtherAnimations, path, speed, weight, timePosition }] of world.query(Body, SetAnimation, LoadedAnimations)) {
	--     const animations = savedAnimationTracks.get(body.animator)!;
	--     const animationTrack = animations.get(path)
	--     // Remove the SetAnimation component after processing
	--     world.remove(entity, SetAnimation);
	--     if (!animationTrack) {
	--         warn(`Missing animation track for ${path} on ${body.model.Name}`);
	--         return;
	--     } else {
	--         // Adjust animation properties
	--         animationTrack.AdjustSpeed(speed || animationTrack.Speed);
	--         animationTrack.AdjustWeight(weight || animationTrack.WeightTarget);
	--         animationTrack.TimePosition = timePosition || animationTrack.TimePosition;
	--         // Stop all other animations if specified
	--         if (stopAllOtherAnimations) {
	--             for (const track of body.animator.GetPlayingAnimationTracks()) {
	--                 if (track !== animationTrack) {
	--                     track.Stop();
	--                 }
	--             }
	--         }
	--         // Play or stop the animation
	--         if (state === "Play") {
	--             animationTrack.Play(transition || 0);
	--         } else if (state === "Stop") {
	--             animationTrack.Stop(transition || 0);
	--         }
	--     }
	-- }
end
return {
	default = default,
}
