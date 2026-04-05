import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "../../../Constants/QueryConstants/queryKeys.ts";
import { GOOGLE_LOGIN } from "../../../Constants/RequestConstants/paths.ts";
import type { UserType } from "../../../Types/User/UserType.ts";

export function useGoogleAuthEntry() {
  const queryClient = useQueryClient();

  return useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);

      const res = await fetch(GOOGLE_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
        credentials: "include",
      });

      if (!res.ok) {
         try {
           const errData = await res.json();
           alert("BACKEND ERROR: " + JSON.stringify(errData));
         } catch (e) {
           if (res.status === 504 || res.status === 503 || res.status === 502) {
              alert("A máquina gratuita do Servidor demora até 2 minutos para despertar e a Vercel estourou o tempo de espera (10 seg). Aguarde e tente entrar novamente em 1 ou 2 minutos!");
           } else {
              alert("Erro de conexão (Status " + res.status + "). O servidor pode estar indisponível.");
           }
         }
         throw new Error("Failed to login, status: " + res.status);
      }

      const user: UserType = await res.json();
      queryClient.setQueryData(qk.user(user.id), user);
      queryClient.setQueryData(qk.currentUser(), user);

      if (user.currentCourseId == null) {
        window.location.href = "/auth/courses";
      } else {
        window.location.href = "/";
      }
    },
    onError: (err) => console.error("Google login failed", err),
  });
}
