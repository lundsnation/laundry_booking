import Config from "./Config";

class NationshusetConfig extends Config {
    constructor() {
        super(
            [
                "07:00-08:30",
                "08:30-10:00",
                "10:00-11:30",
                "11:30-13:00",
                "13:00-14:30",
                "14:30-16:00",
                "16:00-17:30",
                "17:30-19:00",
                "19:00-20:30",
                "20:30-22:00"
            ],
            new Map([
                ["07:00-08:30", 1],
                ["08:30-10:00", 2],
                ["10:00-11:30", 3],
                ["11:30-13:00", 4],
                ["13:00-14:30", 5],
                ["14:30-16:00", 6],
                ["16:00-17:30", 7],
                ["17:30-19:00", 8],
                ["19:00-20:30", 9],
                ["20:30-22:00", 10]
            ])
        )
    }
}

export default NationshusetConfig