import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

export async function fetchDashboardCounts(token) {
  const query = `
    query {
      studentCount
      myProjectsCount
      completedProjectsCount
      taskCount
    }
  `;

  const { data } = await axios.post(
    API_URL,
    { query },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (data.errors) throw new Error(data.errors[0].message);

  return {
    studentCount: data.data.studentCount,
    projectCount: data.data.myProjectsCount,
    finishedProjectsCount: data.data.completedProjectsCount,
    taskCount: data.data.taskCount,
  };
}
