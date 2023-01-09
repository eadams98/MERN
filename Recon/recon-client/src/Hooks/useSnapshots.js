import { useState } from "react"

const useSnapshots = () => { 

  const [snapshots, setSnapshots] = useState({}) // { key: snapshot name, value: snapshot itself}

  const SetSnapshot = (name, original) => { setSnapshots({...snapshots, [name]: original}) }

  const GetSnapshot = (name) => { return snapshots[name] }

  const GetSnapshots = () => { return snapshots }

  return { SetSnapshot, GetSnapshot, GetSnapshots }
}

export default useSnapshots;