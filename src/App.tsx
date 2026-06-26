import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/features/auth/store";
import { authService } from "@/features/auth/service";
import { initTheme } from "@/theme/themeStore";
import { FullScreenSpinner } from "@/components/Spinner";
import { AppLayout } from "@/routes/AppLayout";
import { Placeholder } from "@/routes/Placeholder";
import { SignInPage } from "@/features/auth/pages/SignInPage";
import { SignUpPage } from "@/features/auth/pages/SignUpPage";
import { GlucoseListPage } from "@/features/glucose/pages/GlucoseListPage";
import { GlucoseFormPage } from "@/features/glucose/pages/GlucoseFormPage";
import { MealListPage } from "@/features/meals/pages/MealListPage";
import { MealFormPage } from "@/features/meals/pages/MealFormPage";
import { InsulinListPage } from "@/features/insulin/pages/InsulinListPage";
import { InsulinFormPage } from "@/features/insulin/pages/InsulinFormPage";
import { NoteListPage } from "@/features/notes/pages/NoteListPage";
import { NoteFormPage } from "@/features/notes/pages/NoteFormPage";

function AppRoutes() {
  const session = useAuthStore((s) => s.session);
  const initializing = useAuthStore((s) => s.initializing);

  if (initializing) return <FullScreenSpinner />;

  if (!session) {
    return (
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Placeholder titleKey="nav.dashboard" />} />
        <Route path="glucose" element={<GlucoseListPage />} />
        <Route path="glucose/new" element={<GlucoseFormPage />} />
        <Route path="glucose/:id" element={<GlucoseFormPage />} />
        <Route path="meals" element={<MealListPage />} />
        <Route path="meals/new" element={<MealFormPage />} />
        <Route path="meals/:id" element={<MealFormPage />} />
        <Route path="insulin" element={<InsulinListPage />} />
        <Route path="insulin/new" element={<InsulinFormPage />} />
        <Route path="insulin/:id" element={<InsulinFormPage />} />
        <Route
          path="medications"
          element={<Placeholder titleKey="nav.medications" />}
        />
        <Route path="notes" element={<NoteListPage />} />
        <Route path="notes/new" element={<NoteFormPage />} />
        <Route path="notes/:id" element={<NoteFormPage />} />
        <Route path="reports" element={<Placeholder titleKey="nav.reports" />} />
        <Route path="settings" element={<Placeholder titleKey="nav.settings" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  useEffect(() => {
    initTheme();
    const unsubscribe = authService.initialize();
    return unsubscribe;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
