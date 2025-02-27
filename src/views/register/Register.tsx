import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import Logo from "public/svg/logo.svg";

import { AUTH_PROVIDER } from "../../../types/auth.types";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { onPromise } from "../../utils/functions";
import { trpc } from "../../utils/trpc";
import { registerUserSchema } from "../../utils/validation";

import type { Register } from "../../../types/auth.types";
import type { TRPCError } from "@trpc/server";
import type { ClientSafeProvider } from "next-auth/react";

interface RegisterProps {
  readonly providers: Record<AUTH_PROVIDER, ClientSafeProvider>;
}

export const RegisterView = memo<RegisterProps>(({ providers }) => {
  const [isFormValidated, setIsFormValidated] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm<Register>({
    resolver: zodResolver(registerUserSchema),
  });

  const { mutateAsync } = trpc.auth.register.useMutation();

  const onSubmit = useCallback(
    async (data: Register) => {
      await toast.promise(mutateAsync(data), {
        loading: "Registering...",
        success: "Successfully registered!",
        error: (err: TRPCError) => err.message,
      });
    },
    [mutateAsync],
  );

  useEffect(() => {
    if (isValidating) {
      setIsFormValidated(true);
    }
  }, [isValidating]);

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-start  py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Logo />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Register to RSSmarkable
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              and always be up to date! 🔄
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div className="mt-1 flex w-full flex-col items-stretch justify-center gap-2">
                {Object.values(providers)
                  .filter(
                    (provider) => provider.id !== AUTH_PROVIDER.CREDENTIALS,
                  )
                  .map((provider) => {
                    const Icon = dynamic(
                      () => import(`public/svg/social/${provider.id}.svg`),
                    );

                    return (
                      <Button
                        key={provider.id}
                        variant="secondary"
                        className="inline-flex w-full justify-center gap-4 py-2.5"
                        onClick={onPromise(() =>
                          signIn(provider.id, {
                            callbackUrl: `${window.location.origin}/dashboard`,
                          }),
                        )}
                      >
                        <span className="sr-only">
                          Sign in with {provider.name}
                        </span>

                        <div className="h-6 w-6">
                          <Icon />
                        </div>
                        <span>{provider.name}</span>
                      </Button>
                    );
                  })}
              </div>

              <div className="relative mt-6">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">
                    or continue with
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <form
                className="space-y-6"
                onSubmit={onPromise(handleSubmit(onSubmit))}
              >
                <Input
                  error={errors.name}
                  isValidated={isFormValidated}
                  {...register("name")}
                >
                  Name
                </Input>
                <Input
                  type="email"
                  error={errors.email}
                  isValidated={isFormValidated}
                  {...register("email")}
                >
                  Email
                </Input>
                <Input
                  type="password"
                  error={errors.password}
                  isValidated={isFormValidated}
                  {...register("password")}
                >
                  Password
                </Input>
                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    Already have an account?
                    <Link
                      href="/login"
                      className="pl-2 font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Sign in!
                    </Link>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden flex-1 lg:block">
        <Image
          src="/images/entry-page-background.jpg"
          fill
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
});

RegisterView.displayName = "RegisterView";
