local bufferWriter = require(script.Parent.Parent.process.bufferWriter)
local types = require(script.Parent.Parent.types)

local writef32NoAlloc = bufferWriter.writef32NoAlloc
local writeu8NoAlloc = bufferWriter.writeu8NoAlloc
local alloc = bufferWriter.alloc

local COMPRESSION_TYPES = {
	EULER = 0,           -- 오일러 각 회전 (25바이트)
	IDENTITY = 1,        -- 회전 없음 (13바이트)
	AXIS_ALIGNED = 2,    -- 축 정렬 회전 (16바이트)
	SINGLE_AXIS = 3,     -- 단일 축 회전 (18바이트)
}
local EPSILON = 1e-5

-- Identity 회전 체크 (최적화: 인라인 가능한 간결한 함수)
local function isIdentityRotation(cf)
	local rx, ry, rz = cf:ToEulerAnglesXYZ()

	return math.abs(rx) < EPSILON and 
		math.abs(ry) < EPSILON and 
		math.abs(rz) < EPSILON
end

-- 축 정렬 회전 체크 및 압축
local function getAxisAlignedRotation(cf)
	local xVector = cf.XVector
	local yVector = cf.YVector
	local zVector = cf.ZVector

	local m00, m01, m02 = xVector.X, yVector.X, zVector.X
	local m10, m11, m12 = xVector.Y, yVector.Y, zVector.Y  
	local m20, m21, m22 = xVector.Z, yVector.Z, zVector.Z

	local values = {m00, m01, m02, m10, m11, m12, m20, m21, m22}
	local packed = table.create(9)

	for i, v in values do
		if math.abs(v - 1) < EPSILON then
			packed[i] = 1      -- 값 1
		elseif math.abs(v + 1) < EPSILON then
			packed[i] = 2      -- 값 -1
		elseif math.abs(v) < EPSILON then
			packed[i] = 0      -- 값 0
		else
			return false, nil  -- 축 정렬 아님
		end
	end

	return true, packed
end

-- 단일 축 회전 감지 (최적화: 불필요한 오일러 각 계산 방지)
local function getSingleAxisRotation(cf)
	local rx, ry, rz = cf:ToEulerAnglesXYZ()

	-- X축 회전
	if math.abs(ry) < EPSILON and math.abs(rz) < EPSILON and math.abs(rx) > EPSILON then
		return true, 1, rx
	end

	-- Y축 회전
	if math.abs(rx) < EPSILON and math.abs(rz) < EPSILON and math.abs(ry) > EPSILON then
		return true, 2, ry
	end

	-- Z축 회전
	if math.abs(rx) < EPSILON and math.abs(ry) < EPSILON and math.abs(rz) > EPSILON then
		return true, 3, rz
	end

	return false, 0, 0
end

local cframe = {
	read = function(b: buffer, cursor: number)
		local type = buffer.readu8(b, cursor)

		local x = buffer.readf32(b, cursor + 1)
		local y = buffer.readf32(b, cursor + 5)
		local z = buffer.readf32(b, cursor + 9)

		if type == COMPRESSION_TYPES.IDENTITY then
			-- 회전 없음 (13바이트)
			return CFrame.new(x, y, z), 13
		elseif type == COMPRESSION_TYPES.AXIS_ALIGNED then
			-- 축 정렬 회전 (16바이트)
			local byte1 = buffer.readu8(b, cursor + 13)
			local byte2 = buffer.readu8(b, cursor + 14)
			local byte3 = buffer.readu8(b, cursor + 15)

			-- 압축된 회전 행렬 값 추출
			local values = {}
			local unpack = {
				[0] = 0,   -- 0
				[1] = 1,   -- 1
				[2] = -1   -- -1
			}

			-- 각 2비트 값을 디코딩
			values[1] = unpack[bit32.band(bit32.rshift(byte1, 6), 3)]
			values[2] = unpack[bit32.band(bit32.rshift(byte1, 4), 3)]
			values[3] = unpack[bit32.band(bit32.rshift(byte1, 2), 3)]
			values[4] = unpack[bit32.band(byte1, 3)]
			values[5] = unpack[bit32.band(bit32.rshift(byte2, 6), 3)]
			values[6] = unpack[bit32.band(bit32.rshift(byte2, 4), 3)]
			values[7] = unpack[bit32.band(bit32.rshift(byte2, 2), 3)]
			values[8] = unpack[bit32.band(byte2, 3)]
			values[9] = unpack[bit32.band(bit32.rshift(byte3, 6), 3)]

			-- 회전 행렬로 CFrame 생성
			return CFrame.new(
				x, y, z,
				values[1], values[2], values[3],
				values[4], values[5], values[6],
				values[7], values[8], values[9]
			), 16
		elseif type == COMPRESSION_TYPES.SINGLE_AXIS then
			-- 단일 축 회전 (18바이트)
			local axisType = buffer.readu8(b, cursor + 13)
			local angle = buffer.readf32(b, cursor + 14)

			local cf = CFrame.new(x, y, z)
			if axisType == 1 then
				-- X축 회전
				return cf * CFrame.Angles(angle, 0, 0), 18
			elseif axisType == 2 then
				-- Y축 회전
				return cf * CFrame.Angles(0, angle, 0), 18
			elseif axisType == 3 then
				-- Z축 회전
				return cf * CFrame.Angles(0, 0, angle), 18
			else
				-- 잘못된 축 타입
				return cf, 18
			end
		elseif type == COMPRESSION_TYPES.EULER then
			-- 오일러 각 회전 (25바이트)
			local rx = buffer.readf32(b, cursor + 13)
			local ry = buffer.readf32(b, cursor + 17)
			local rz = buffer.readf32(b, cursor + 21)
			
			return CFrame.new(x, y, z) * CFrame.fromEulerAnglesXYZ(rx, ry, rz), 25
		end
		
		return CFrame.new(x, y, z), 13
	end,

	write = function(value: CFrame)
		local x, y, z = value.X, value.Y, value.Z

		-- 1. Identity 회전 체크 (가장 먼저 확인: 가장 흔한 케이스)
		if isIdentityRotation(value) then
			-- 회전 없음 (13바이트)
			alloc(13)
			writeu8NoAlloc(COMPRESSION_TYPES.IDENTITY)
			writef32NoAlloc(x)
			writef32NoAlloc(y)
			writef32NoAlloc(z)
			return
		end

		-- 2. 축 정렬 회전 체크
		local isAxisAligned, packed = getAxisAlignedRotation(value)
		if isAxisAligned then
			-- 축 정렬 회전 (16바이트)
			alloc(16)
			writeu8NoAlloc(COMPRESSION_TYPES.AXIS_ALIGNED)
			writef32NoAlloc(x)
			writef32NoAlloc(y)
			writef32NoAlloc(z)

			-- 9개 요소를 3바이트로 압축
			local byte1 = bit32.bor(
				bit32.lshift(packed[1], 6),
				bit32.lshift(packed[2], 4),
				bit32.lshift(packed[3], 2),
				packed[4]
			)
			local byte2 = bit32.bor(
				bit32.lshift(packed[5], 6),
				bit32.lshift(packed[6], 4),
				bit32.lshift(packed[7], 2),
				packed[8]
			)
			local byte3 = bit32.lshift(packed[9], 6)

			writeu8NoAlloc(byte1)
			writeu8NoAlloc(byte2)
			writeu8NoAlloc(byte3)
			return
		end

		-- 3. 단일 축 회전 체크
		local isSingleAxis, axisType, angle = getSingleAxisRotation(value)
		if isSingleAxis then
			-- 단일 축 회전 (18바이트)
			alloc(18)
			writeu8NoAlloc(COMPRESSION_TYPES.SINGLE_AXIS)
			writef32NoAlloc(x)
			writef32NoAlloc(y)
			writef32NoAlloc(z)
			writeu8NoAlloc(axisType)
			writef32NoAlloc(angle)
			return
		end

		-- 4. 일반 회전: 오일러 각 사용 (25바이트)
		local rx, ry, rz = value:ToEulerAnglesXYZ()

		alloc(25)
		writeu8NoAlloc(COMPRESSION_TYPES.EULER)
		writef32NoAlloc(x)
		writef32NoAlloc(y)
		writef32NoAlloc(z)
		writef32NoAlloc(rx)
		writef32NoAlloc(ry)
		writef32NoAlloc(rz)
	end,
}

return function(): types.dataTypeInterface<CFrame>
	return cframe
end