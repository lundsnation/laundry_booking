import Config, {Arkivet, Building, Nationshuset} from "./Config";

class ConfigUtil {

    //getConfigByLaundryBuilding returns a LaundryConfig based on LaundryBuilding

    //getLaundryBuildingByBuilding returns a LaundryBuilding based on Building

    public static getLaundryBuildingByBuilding(building: Building): LaundryBuilding {
        switch (building) {
            case Arkivet.A || Arkivet.B || Arkivet.C || Arkivet.D:
                return LaundryBuilding.ARKIVET
            case Nationshuset.NH || Nationshuset.GH
                return LaundryBuilding.GH


                throw new Error("Invalid building")
        }
    }
    public static getConfigByBuilding(building: Building): Config {
        switch (building) {
            case Arkivet.A || Arkivet.B || Arkivet.C || Arkivet.D:
                return new ArkivetConfig()
            case Nationshuset.NH || Nationshuset.GH
                return new NationshusetConfig()

                throw new Error("Invalid building")
        }
    }
}