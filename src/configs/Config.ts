export enum Arkivet {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
}

export enum Nationshuset {
    GH = "GH",
    NH = "NH",
}

export type Building = Arkivet | Nationshuset

export enum LaundryBuilding {
    ARKIVET = "ARKIVET",
    NATIONSHUSET = "NATIONSHUSET",
    NYA = "NYA",
}

abstract class Config {
    readonly timeSlots: string[]
    readonly dryingBoothsMappings: Map<string, number>

    protected constructor(timeSlots: string[], dryingBoothsMappings: Map<string, number>) {
        this.timeSlots = timeSlots
        this.dryingBoothsMappings = dryingBoothsMappings
    }

    public getDryingBooth(inputString: string): number {
        const result = this.dryingBoothsMappings.get(inputString);

        if (!result) {
            throw new Error(`Drying booth not found for string: ${inputString}`);
        }

        return result;
    }
}

export default Config