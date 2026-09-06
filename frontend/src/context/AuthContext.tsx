import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  gql,
  useApolloClient,
} from '@apollo/client';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  signIn: (
    email: string,
    password: string,
  ) => Promise<User>;

  signUp: (
    name: string,
    email: string,
    password: string,
  ) => Promise<User>;

  signOut: () => Promise<void>;

  refreshUser: () => Promise<User | null>;
};

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const client = useApolloClient();

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser = useCallback(
    async () => {
      try {
        const { data } =
          await client.query<{
            currentUser: User | null;
          }>({
            query: CURRENT_USER_QUERY,
            fetchPolicy: 'network-only',
          });

        const currentUser =
          data.currentUser ?? null;

        setUser(currentUser);

        return currentUser;
      } catch (error) {
        console.error(
          'Failed to restore authenticated user',
          error,
        );

        setUser(null);

        return null;
      }
    },
    [client],
  );

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      setLoading(true);

      try {
        const { data } =
          await client.query<{
            currentUser: User | null;
          }>({
            query: CURRENT_USER_QUERY,
            fetchPolicy: 'network-only',
          });

        if (active) {
          setUser(
            data.currentUser ?? null,
          );
        }
      } catch (error) {
        console.error(
          'Failed to restore session',
          error,
        );

        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, [client]);

  const signIn = useCallback(
    async (
      email: string,
      password: string,
    ) => {
      const { data } =
        await client.mutate<{
          login: {
            user: User;
          };
        }>({
          mutation: LOGIN_MUTATION,
          variables: {
            input: {
              email,
              password,
            },
          },
          fetchPolicy: 'no-cache',
        });

      const loggedInUser =
        data?.login.user;

      if (!loggedInUser) {
        throw new Error(
          'Login failed.',
        );
      }

      setUser(loggedInUser);

      return loggedInUser;
    },
    [client],
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ) => {
      const { data } =
        await client.mutate<{
          register: {
            user: User;
          };
        }>({
          mutation: REGISTER_MUTATION,
          variables: {
            input: {
              name,
              email,
              password,
            },
          },
          fetchPolicy: 'no-cache',
        });

      const registeredUser =
        data?.register.user;

      if (!registeredUser) {
        throw new Error(
          'Registration failed.',
        );
      }

      setUser(registeredUser);

      return registeredUser;
    },
    [client],
  );

  const signOut = useCallback(
    async () => {
      try {
        await client.mutate({
          mutation: LOGOUT_MUTATION,
          fetchPolicy: 'no-cache',
        });
      } finally {
        setUser(null);
        await client.clearStore();
      }
    },
    [client],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated:
        user !== null,
      signIn,
      signUp,
      signOut,
      refreshUser,
    }),
    [
      user,
      loading,
      signIn,
      signUp,
      signOut,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.',
    );
  }

  return context;
}