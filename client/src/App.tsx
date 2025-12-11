
import Header from './Components/header/Header'
import CreatePantryItemContainer from './Components/create-container/CreatePantryItemContainer'
import Footer from './Components/footer/Footer'
import PantryItemContainer from './Components/pantry/PantryItemContainer'



import './App.css'

function App() {
  

  return (
    <>
     <div className="app-container">
      < Header />
      < CreatePantryItemContainer />
      < PantryItemContainer />
      < Footer />

     </div>
     
    </>
  )
}

export default App
