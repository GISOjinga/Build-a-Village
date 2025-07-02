-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local RunService = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").RunService
-- table of intervals to run through
local intervals = {}
local timeOuts = {}
local function createInterval(run, delay, extra)
	if extra == nil then
		extra = {}
	end
	local _exp = run
	local _object = {
		Init = tick(),
		Delta = tick(),
		Delay = delay,
		Time = if extra.immediate then 0 else tick() + delay,
		Run = run,
	}
	local _left = "DeleteAfter"
	local _value = extra.deleteAfter
	_object[_left] = if _value ~= 0 and _value == _value and _value then tick() + extra.deleteAfter else nil
	intervals[_exp] = _object
	-- returns a function to destroy it 
	return function()
		local _run = run
		intervals[_run] = nil
	end
end
-- creates a time out
local function createTimeout(run, delay)
	local _run = run
	local _arg1 = {
		Init = tick(),
		Delta = tick(),
		EndTime = tick() + delay,
		Run = run,
	}
	timeOuts[_run] = _arg1
	return function()
		local _run_1 = run
		if timeOuts[_run_1] ~= nil then
			local _run_2 = run
			timeOuts[_run_2] = nil
		end
	end
end
-- on heartbeat
RunService.Heartbeat:Connect(function()
	-- ▼ ReadonlyMap.forEach ▼
	local _callback = function(timeOut, key)
		local tickTime = tick()
		-- if the time is greater than the delay
		if timeOut.EndTime <= tick() then
			task.spawn(timeOut.Run, tickTime - timeOut.Delta, tickTime - timeOut.Init)
			local _key = key
			timeOuts[_key] = nil
		end
	end
	for _k, _v in timeOuts do
		_callback(_v, _k, timeOuts)
	end
	-- ▲ ReadonlyMap.forEach ▲
	-- ▼ ReadonlyMap.forEach ▼
	local _callback_1 = function(interval)
		local tickTime = tick()
		-- if the time is greater than the delay
		if interval.Time < tickTime then
			task.spawn(interval.Run, tickTime - interval.Delta, tickTime - interval.Init)
			interval.Time = tickTime + interval.Delay
			interval.Delta = tickTime
			-- if delete after is not -1
			local _condition = interval.DeleteAfter
			if _condition ~= 0 and _condition == _condition and _condition then
				_condition = interval.DeleteAfter < tickTime
			end
			if _condition ~= 0 and _condition == _condition and _condition then
				local _run = interval.Run
				intervals[_run] = nil
			end
		end
	end
	for _k, _v in intervals do
		_callback_1(_v, _k, intervals)
	end
	-- ▲ ReadonlyMap.forEach ▲
end)
return {
	createInterval = createInterval,
	createTimeout = createTimeout,
}
