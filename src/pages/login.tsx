import { getProviders } from "next-auth/react";

import { LoginView } from "../views/login/Login";

import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";

const Login = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!providers) {
    return null;
  }

  return <LoginView providers={providers} />;
};

export default Login;

export const getServerSideProps = async () => {
  return {
    props: {
      providers: await getProviders(),
    },
  } satisfies GetServerSidePropsResult<Record<PropertyKey, unknown>>;
};
