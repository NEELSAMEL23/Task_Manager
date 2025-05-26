

import { useContext } from "react"
import UserProvider, { UserContext } from "./context/userContext"
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"



import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom"

import PrivateRoute from "./routes/PrivateRoute"
import Dashboard from "./pages/Admin/Dashboard"
import ManageTask from "./pages/Admin/ManageTask"
import CreateTask from "./pages/Admin/CreateTask"
import ManageUsers from "./pages/Admin/ManageUsers"


import UserDashboard from "./pages/User/UserDashboard"
import MyTask from "./pages/User/MyTask"
import ViewTaskDetails from "./pages/User/ViewTaskDetails"
import { Toaster } from "react-hot-toast"


const App = () => {
  return (
    <div>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route element={<PrivateRoute allowedRoles={["admin"]} />} >
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route >

            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTask />} />
              <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
            </Route>

            <Route path="/" element={<Root />} />
          </Routes>
        </Router>

      </UserProvider>
      <Toaster toastOptions={{
        className:"",
        style:{
          fontSize:"13px"
        }
      }} />
    </div>


  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext)

  if (loading) return <Outlet />

  if (!user) {
    return <Navigate to="/login" />
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />
}