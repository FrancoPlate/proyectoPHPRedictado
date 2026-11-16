
import NavBar from '../components/NavBarComponent'
import Footer from '../components/FooterComponent'
import Header from '../components/HeaderComponent'
import { Outlet } from "react-router-dom";
//import '../assets/styles/mainL.css'

function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
        <div className='flex justify-between items-center py-1'>
          <Header/>
          <NavBar/>
        </div>
        <main className='flex flex-1 justify-center items-center'>
            <Outlet />
        </main>
        <Footer/>
    </div>
  );
}

export default MainLayout