
import Sample from "./components/sample"
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";



const App = () => {
  useEffect(()=>{
    AOS.init()
  },[])
  return (
    <div>
 
      <Sample></Sample>
      
    </div>
  )
}

export default App
