import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

const GET_MY_PROJECTS = `
  query {
    myProjects {
      _id
      title
      description
      category
      startDate
      endDate
      status
      students { id UserName }
      createdBy { id UserName }
    }
  }
`;

const GET_STUDENTS = `
  query {
    students {
      id
      UserName
      universityId
      role
    }
  }
`;

const GET_TASKS = `
  query {
    getSortedTasks {
      _id
      project { _id title }
      taskname
      status
      description
      assignedTo { id UserName }
      createdBy { id UserName }
    }
  }
`;

const ADD_PROJECT = `
  mutation AddProject($input: AddProjectInput!) {
    addProject(input: $input) {
      _id
      title
      description
      category
      startDate
      endDate
      status
      students { id UserName }
      createdBy { id UserName }
    }
  }
`;

export async function fetchProjects(token) {
  const { data } = await axios.post(
    API_URL,
    { query: GET_MY_PROJECTS },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.myProjects;
}

export async function fetchStudents(token) {
  const { data } = await axios.post(
    API_URL,
    { query: GET_STUDENTS },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.students;
}

export async function fetchTasks(token) {
  const { data } = await axios.post(
    API_URL,
    { query: GET_TASKS },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.getSortedTasks;
}

export async function addProject(token, input) {
  const { data } = await axios.post(
    API_URL,
    { query: ADD_PROJECT, variables: { input } },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.addProject;
}
