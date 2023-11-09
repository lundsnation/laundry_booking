export function getBuilding(name: String) {
    const building = name.replace(/[^a-zA-Z]/g, "")
    if (["A", "B", "C", "D"].includes(building)) return "ARKIVET"
    if (["NH", "GH", "admin"].includes(building)) return "NATIONSHUSET"
    return "UNKNOWN"
}