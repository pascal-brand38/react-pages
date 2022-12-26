import React from "react";
import {
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import Home from './pages/Home'
import TextEffect from './pages/TextEffect'
import Theme from './pages/Theme'


function App() {
  return (
    <div className="pbr-container">
      <header>
        <nav className='pbr-menu'>
          <div className='pbr-menu__logo'>
            Logo
          </div>
          <NavLink to="/">Home</NavLink>    { /* NavLink has an active to know where we are */}
          <NavLink to="text-effect">Text Effect</NavLink>
          <NavLink to="theme">Theme</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="text-effect" element={<TextEffect />} />
          <Route path="theme" element={<Theme />} />
        </Routes>
      </main>
    </div>
  );

}

export default App





// import {
//   createBrowserRouter, 
//   createRoutesFromElements,
//   Route, 
//   RouterProvider
// } from 'react-router-dom'

// import Home from './pages/Home'
// import TextEffect from './pages/TextEffect'
// import Theme from './pages/Theme'

// import { Outlet, NavLink } from "react-router-dom";

// function RootLayout() {
//   return (
//     <div className="pbr-container">
//       <header>
//         <nav className='pbr-menu'>
//           <div className='pbr-menu__logo'>
//             Logo
//           </div>
//           <NavLink to="/">Home</NavLink>    { /* NavLink has an active to know where we are */ }
//           <NavLink to="text-effect">Text Effect</NavLink>
//           <NavLink to="theme">Theme</NavLink>
//         </nav>
//       </header>
//       <main>
//         <Outlet />    { /* the page of the Route element is displayed */ }
//       </main>
//     </div>
//   )
// }

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<RootLayout />}>
//       <Route index element={<Home />} />
//       <Route path="text-effect" element={<TextEffect />} />
//       <Route path="theme" element={<Theme />} />

//       { /* TODO: <Route path="*" element={<NotFound />} /> */ }
//     </Route>
//   )
// )

// function App() {
//   return (
//     <RouterProvider router={router} />
//   );
// }

// export default App
