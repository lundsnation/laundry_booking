import Config, {Arkivet, Building, LaundryBuilding, Nationshuset} from "../src/configs/Config";
import ArkivetConfig from "../src/configs/ArkivetConfig";
import NationshusetConfig from "../src/configs/NationshusetConfig";

class ConfigUtil {


    //getLaundryBuildingByBuilding returns a LaundryBuilding based on Building
    public static getLaundryBuildingByBuilding(building: Building): LaundryBuilding {
        switch (building) {
            case Arkivet.A || Arkivet.B || Arkivet.C || Arkivet.D:
                return LaundryBuilding.ARKIVET
            case Nationshuset.NH || Nationshuset.GH:
                return LaundryBuilding.NATIONSHUSET
            default:
                throw new Error("Invalid building")
        }
    }

    //getConfigByLaundryBuilding returns a LaundryConfig based on LaundryBuilding
    public static getLaundryConfigByLaundryBuilding(building: LaundryBuilding): Config {
        switch (building) {
            case LaundryBuilding.ARKIVET:
                return new ArkivetConfig()
            case LaundryBuilding.NATIONSHUSET:
                return new NationshusetConfig()
            default:
                throw new Error("Invalid building")
        }
    }
}

export default ConfigUtil