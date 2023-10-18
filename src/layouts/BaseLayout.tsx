import { Outlet } from 'react-router-dom'
import Footer from '../components/organism/Footer'

const BaseLayout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  )
}

export default BaseLayout