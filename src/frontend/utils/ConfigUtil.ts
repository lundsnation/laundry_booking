import Config, {Arkivet, Building, LaundryBuilding, Nationshuset} from "../configs/Config";
import ArkivetConfig from "../configs/ArkivetConfig";
import NationshusetConfig from "../configs/NationshusetConfig";
import FinnhusetConfig from "../configs/Finnhuset";

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
            case LaundryBuilding.FINNHUSET:
                return new FinnhusetConfig()
            default:
                throw new Error("Invalid laundry building")
        }
    }
}

export default ConfigUtil