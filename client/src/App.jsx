import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";

import Home from "./user/pages/Home";
import UserWorkouts from "./workouts/pages/UserWorkouts";
import Profile from "./user/pages/Profile";
import NewWorkout from "./workouts/pages/NewWorkout";
import UpdateWorkout from "./workouts/pages/UpdateWorkout";
import Login from "./user/pages/Login";
import WorkoutTypesManager from "./workouts/pages/WorkoutTypesManager";

import { AuthContext } from "./context/auth";
import ProtectedRoute from "./content/ProtectedRoute";
import { useAuth } from "./hooks/authHook";

export default function App() {
  const { token, login, logout, userId, authReady } = useAuth();

  if (!authReady) {
    return null;
  }
  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, token: token, userId, login, logout }}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Julkiset */}
          <Route path="login" element={<Login />} />

          {/* Suojatut */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="workouts" element={<UserWorkouts />} />
            <Route path="workouts/new" element={<NewWorkout />} />
            <Route
              path="workouts/:workoutId/edit"
              element={<UpdateWorkout />}
            />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/types" element={<WorkoutTypesManager />} />

            <Route path="*" element={<Home />} />
          </Route>

          {/* Julkinen fallback */}
          <Route path="*" element={<Login />} />
        </Route>
      </Routes>
    </AuthContext.Provider>
  );
}
