import React from 'react';
import { Redirect } from 'react-router-dom';

import QueryMe from '../containers/Query.Me';

import Mutate from '../contexts/Mutation';
import Toaster from '../contexts/Toaster';

import ProfileForm from '../forms/Profile';

export default function LoginPage() {
  return (
    <QueryMe>
      {({ data }) =>
        data.me ? (
          <Redirect to="/" />
        ) : (
          <section>
            <Mutate>
              {mutate => (
                <Toaster>
                  {toaster => (
                    <ProfileForm
                      onSubmit={({ handle, password }) =>
                        mutate
                          .login({
                            variables: {
                              profile: {
                                handle,
                                password,
                              },
                            },
                            updateQueries: [
                              {
                                me: (prev, { mutationResult }) => {
                                  console.log(prev, mutationResult);

                                  return {
                                    me: mutationResult.data.signup,
                                  };
                                },
                              },
                            ],
                          })
                          .then(results =>
                            toaster.notify({
                              message: `Successfully logged in as ${
                                results.data.login.handle
                              }`,
                            }),
                          )
                      }
                    />
                  )}
                </Toaster>
              )}
            </Mutate>
          </section>
        )
      }
    </QueryMe>
  );
}
