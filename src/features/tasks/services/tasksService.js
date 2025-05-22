import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

const TASKS_QUERY = `
  query GetTasks {
    getSortedTasks {
      _id
      project {
        _id
        title
      }
      projecttitle
      taskname
      description
      assignedTo { id UserName }
      createdBy   { id UserName }
      status
      dueDate
    }
  }
`;

const PROJECTS_QUERY = `
  query {
    myProjects {
      _id
      title
      startDate
      endDate
      students { id UserName }
    }
  }
`;

const ADD_TASK = `
  mutation AddTask($input: AddTaskInput!) {
    addTask(input: $input) {
      _id
      projecttitle
      taskname
      description
      assignedTo { id UserName }
      createdBy   { id UserName }
      status
      dueDate
      project { _id title }
    }
  }
`;

const UPDATE_TASK = `
  mutation UpdateTask($id: ID!, $input: AddTaskInput!) {
    updateTask(id: $id, input: $input) {
      _id
      projecttitle
      taskname
      description
      assignedTo { id UserName }
      createdBy   { id UserName }
      status
      dueDate
      project { _id title }
    }
  }
`;

const DELETE_TASK = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      message
      taskId
    }
  }
`;

export async function fetchTasks(token) {
  const { data } = await axios.post(
    API_URL,
    { query: TASKS_QUERY },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.getSortedTasks;
}

export async function fetchProjects(token) {
  const { data } = await axios.post(
    API_URL,
    { query: PROJECTS_QUERY },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.myProjects;
}

export async function addTask(token, input) {
  const { data } = await axios.post(
    API_URL,
    { query: ADD_TASK, variables: { input } },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.addTask;
}

export async function updateTask(token, id, input) {
  const { data } = await axios.post(
    API_URL,
    { query: UPDATE_TASK, variables: { id, input } },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.updateTask;
}

export async function deleteTask(token, id) {
  const { data } = await axios.post(
    API_URL,
    { query: DELETE_TASK, variables: { id } },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.deleteTask;
}
