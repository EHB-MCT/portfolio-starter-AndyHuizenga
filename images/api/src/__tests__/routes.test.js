const {CheckPhoneNames} = require("../helpers/helpers");

test("check GET name", () => 
{
expect(CheckPhoneNames(null)).toBe(false)
expect(CheckPhoneNames("")).toBe(false)
expect(CheckPhoneNames("i")).toBe(false)
expect(CheckPhoneNames(1)).toBe(false)
expect(CheckPhoneNames("regbrehbfjkezbfjezrbgjk")).toBe(false)
expect(CheckPhoneNames("Ttest")).toBe(true)

})
