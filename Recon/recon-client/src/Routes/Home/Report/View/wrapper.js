import { useSelector } from "react-redux"
import { userSelector } from "../../../../State/Slices/userSlice"
import ViewContractorReport from "./ViewContractorReport"
import ViewJrContractorReport from "./ViewJrContractorReport"

const ViewWrapper = () => {
  let user = useSelector(userSelector)

    switch(user.user.role.toLowerCase()) {
      case "admin":
        return <div> admin </div>
        break
      case "contractor":
        return <ViewContractorReport />
        break 
      case "jr contractor":
        return <ViewJrContractorReport />
        break
      case "school":
        return <div> school </div>
        break
      default:
        return <div> NO ROLE ERROR </div>
    }
}

export default ViewWrapper