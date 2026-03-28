import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UserType } from "../../../Types/User/UserType.ts";
import type { CourseType } from "../../../Types/Catalog/CourseType.ts";
import {CHANGE_COURSE} from "../../../Constants/RequestConstants/paths.ts";
import {qk} from "../../../Constants/QueryConstants/queryKeys.ts";

interface ChangeCourseVariables {
  newCourse: number;
}

type CourseChangeType = {
  newUser: UserType;
  newCourses: CourseType[];
};

export function useChangeCourse() {
  const qc = useQueryClient();

  return useMutation<CourseChangeType, Error, ChangeCourseVariables>({
    mutationFn: async (
      variables: ChangeCourseVariables
    ): Promise<CourseChangeType> => {
      const { newCourse } = variables;

      const res = await fetch(CHANGE_COURSE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newCourse }),
        credentials: "include",
      });

      if (!res.ok) {
        let errorDetails = "";
        try {
          errorDetails = await res.text();
        } catch (e) {
          errorDetails = "Could not read response body";
        }
        throw new Error(`HTTP ${res.status}: ${errorDetails}`);
      }

      const data = (await res.json()) as CourseChangeType;
      return data;
    },
    onSuccess: (updatedCourse: CourseChangeType) => {
      const updatedUser = updatedCourse.newUser;
      const newCourseList = updatedCourse.newCourses;
      qc.setQueryData(qk.user(updatedUser.id), updatedUser);
      qc.invalidateQueries({ queryKey: qk.courseProgress(updatedUser.id) });
      qc.invalidateQueries({ queryKey: ["courseProgress", "pending"] });
      qc.setQueryData(qk.currentUser(), updatedUser);
      qc.setQueryData(qk.userCourses(updatedUser.id), newCourseList);
    },
    onError: (error) => {
      alert(`Failed to change course. Error: ${error.message}\nMake sure the database is seeded with course data.`);
      console.error("Change course error:", error);
    },
  });
}
