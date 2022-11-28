import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import React from "react"

const Layout: React.FC = ({ children, hideHeader, hideFooter }) => {
  return (
    <div>
      {!hideHeader && <Nav />}
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout
