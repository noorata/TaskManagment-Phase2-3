import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

/* ============ GraphQL Queries ============ */
const LOGIN_MUTATION = `
  mutation Login($UserName: String!, $password: String!, $staySignedIn: Boolean!) {
    login(UserName: $UserName, password: $password, staySignedIn: $staySignedIn) {
      id
      UserName
      role
      universityId
      token
    }
  }
`;

const REGISTER_MUTATION = `
  mutation RegisterUser(
    $UserName: String!
    $password: String!
    $universityId: String
  ) {
    register(
      UserName: $UserName
      password: $password
      universityId: $universityId
    ) {
      id
      UserName
      role
      universityId
      token
    }
  }
`;

/* ============ API Wrappers ============ */
export async function login({ UserName, password, staySignedIn }) {
  const { data } = await axios.post(
    API_URL,
    {
      operationName: "Login",
      query: LOGIN_MUTATION,
      variables: { UserName, password, staySignedIn },
    },
    { withCredentials: true }
  );

  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.login;
}

export async function register({ UserName, password, universityId }) {
  const variables = { UserName, password, universityId };
  const { data } = await axios.post(API_URL, {
    operationName: "RegisterUser",
    query: REGISTER_MUTATION,
    variables,
  });

  if (data.errors) throw new Error(data.errors[0].message);
  return data.data.register;
}
