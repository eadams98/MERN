import { useState } from "react"
import _ from 'lodash'

const useSnapshots = () => { 

  const [snapshots, setSnapshots] = useState({}) // { key: snapshot name, value: snapshot itself}

  const SetSnapshot = (name, original) => { setSnapshots({...snapshots, [name]: original}) }

  const GetSnapshot = (name) => { return snapshots[name] }

  const GetSnapshots = () => { return snapshots }

  const Validate = (object, snapshotName) => {
    return _.isEqual(object, snapshots[snapshotName])
  }

  return { SetSnapshot, GetSnapshot, GetSnapshots, Validate }
}

export default useSnapshots;