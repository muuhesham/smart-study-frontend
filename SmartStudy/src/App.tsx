import { Routes, Route, BrowserRouter } from 'react-router'
import Login from './Pages/Login/login'
import Register from './Pages/Register/register'
import ForgotPassword from './Pages/ForgotPassword/forgotpassword'
import Mainlayout from './mainlayout'
import Support from './Pages/Support/support'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Dashboard from './Pages/Dashboard/dashboard'
import Subjects from './Pages/Subjects/subjects'
import Studyplan from './Pages/StudyPlan/studyplan'
import Pomodoro from './Pages/Pomodoro/pomodoro'
import Profile from "./Pages/Profile/profile";
function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#000000",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            fontFamily: "Poppins, sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/support" element={<Support />}></Route>
        <Route path="/" element={<Mainlayout />}>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/subjects" element={<Subjects />}></Route>
          <Route path="/studyplan" element={<Studyplan />}></Route>
          <Route path="/pomodorotimer" element={<Pomodoro />}></Route>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

} 

export default App

 


