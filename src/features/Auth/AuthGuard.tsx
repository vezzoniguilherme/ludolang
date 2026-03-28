import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { SpinnerPage } from "../../Components/Layouts/SpinnerPage.tsx";
import { useQuery } from "@tanstack/react-query";
import { qo } from "../../Constants/QueryConstants/queries.ts";

export function AuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isLoading } = useQuery(qo.currentUser());

  useEffect(() => {
    if (!isLoading && !user) {
      if (location.pathname !== "/auth") {
        navigate("/auth");
      }
    } else if (user && !user.currentCourseId) {
      if (location.pathname !== "/auth/courses") {
        navigate("/auth/courses");
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  if (isLoading || !user) return <SpinnerPage />;

  if (!user.currentCourseId && location.pathname !== "/auth/courses") {
    return <SpinnerPage />;
  }

  return <Outlet />;
}