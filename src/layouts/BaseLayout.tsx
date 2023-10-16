import { Outlet } from 'react-router-dom'
import Header from '../components/organism/Header'
import Footer from '../components/organism/Footer'

const BaseLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default BaseLayout