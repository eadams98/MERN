import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Outlet } from "react-router";

const PageWrapper = ({ height }) => {

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    
  }, [isLoading, isError, errorMessage])
  
  if (isError) {
    return (
      <div style={{height: height, border: "solid", backgroundColor: "yellow", display: "flex", justifyContent: "center", alignItems: "center"}}>
        { errorMessage ? <div style={{width: "100%"}}>{errorMessage}</div> : <div style={{width: "100%"}}>ERROR</div> }
      </div>
      
    )
  } else if (isLoading) {
    return (
      <div style={{height: height, border: "solid", backgroundColor: "yellow", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{width: "100%"}}><Spinner /></div> 
      </div>
    )
      
  } else {
    return (
    <div style={ height ? {height: height, border: "solid", backgroundColor: "yellow"} : {height: "100%", border: "solid"}}>
      <Outlet setError = {() => setIsError}/>
    </div> )
  }

}

export default PageWrapper;