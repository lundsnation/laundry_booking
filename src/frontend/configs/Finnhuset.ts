import Config from "./Config";

class FinnhusetConfig extends Config {
    constructor() {
        super(
            [
                "07:00-10:00",
                "10:00-13:00",
                "13:00-16:00",
                "16:00-19:00",
                "19:00-22:00",
            ],
            new Map([
                ["07:00-10:00", 0],
                ["10:00-13:00", 0],
                ["13:00-16:00", 0],
                ["16:00-19:00", 0],
                ["19:00-22:00", 0]
            ])
        )
    }
}

export default FinnhusetConfig