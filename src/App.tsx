import { Routes, Route, BrowserRouter } from 'react-router'
import Login from './pages/Login/login'
import Register from './pages/Register/register'
import ForgotPassword from './pages/ForgotPassword/forgotpassword'
import Mainlayout from './mainlayout'
import Support from './pages/Support/support'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard/dashboard'
import Subjects from './pages/Subjects/subjects'
import Studyplan from './pages/StudyPlan/studyplan'
import Pomodoro from './pages/Pomodoro/pomodoro'
import Profile from "./pages/Profile/profile";
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

 


