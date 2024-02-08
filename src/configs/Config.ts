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

export enum Finnhuset {
    FH = "FH",
}

export type Building = Arkivet | Nationshuset | Finnhuset

export enum LaundryBuilding {
    ARKIVET = "ARKIVET",
    NATIONSHUSET = "NATIONSHUSET",
    //NYA = "NYA", // Unclear if they are going to have own laundry building
}

abstract class Config {
    readonly timeSlots: string[]
    readonly dryingBoothsMappings: Map<string, number>

    protected constructor(timeSlots: string[], dryingBoothsMappings: Map<string, number>) {
        this.timeSlots = timeSlots
        this.dryingBoothsMappings = dryingBoothsMappings
    }

    static getLaundryBuildingByBuilding(building: Building): LaundryBuilding {
        switch (building) {
            case Arkivet.A:
            case Arkivet.B:
            case Arkivet.C:
            case Arkivet.D:
                return LaundryBuilding.ARKIVET
            case Nationshuset.GH:
            case Nationshuset.NH:
            case Finnhuset.FH:
                return LaundryBuilding.NATIONSHUSET
        }
    }

    static get getBuildings(): Building[] {
        return [Arkivet.A, Arkivet.B, Arkivet.C, Arkivet.D, Nationshuset.GH, Nationshuset.NH, Finnhuset.FH]
    }

    static get getLaundryBuildings(): LaundryBuilding[] {
        return [LaundryBuilding.ARKIVET, LaundryBuilding.NATIONSHUSET]
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

