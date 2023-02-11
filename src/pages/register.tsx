import { getProviders } from "next-auth/react";

import { RegisterView } from "../views/register/Register";

import type {
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";

const Register = ({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (!providers) {
    return null;
  }

  return <RegisterView providers={providers} />;
};

export default Register;

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  } satisfies GetServerSidePropsResult<Record<PropertyKey, unknown>>;
};
