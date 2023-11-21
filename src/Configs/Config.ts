abstract class Config {
    readonly timeSlots: string[]
    readonly dryingBoothsMappings: Map<string, number>

    protected constructor(timeSlots: string[], dryingBoothsMappings: Map<string, number>) {
        this.timeSlots = timeSlots
        this.dryingBoothsMappings = dryingBoothsMappings
    }
}

export default Config