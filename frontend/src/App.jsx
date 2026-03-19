import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AppProvider, useApp } from "@/context/AppContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentsPage from "./pages/teacher/StudentsPage";
import StudentDetail from "./pages/teacher/StudentDetail";
import CreateTask from "./pages/teacher/CreateTask";
import ManageTasks from "./pages/teacher/ManageTasks";
import TrackProgress from "./pages/teacher/TrackProgress";
import StudentDashboard from "./pages/student/StudentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useApp();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (user.role === "teacher") {
    return (
      <Routes>
        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/manage-tasks" element={<ManageTasks />} />
        <Route path="/track-progress" element={<TrackProgress />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/my-tasks" element={<StudentDashboard />} />
      <Route path="/" element={<Navigate to="/my-tasks" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
