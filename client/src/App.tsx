
import Header from './components/header/Header'
import CreatePantryItemContainer from './components/create-container/CreatePantryItemContainer'
import Footer from './components/footer/Footer'
import PantryItemContainer from './components/pantry/PantryItemContainer'



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
