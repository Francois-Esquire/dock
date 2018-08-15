import React from 'react';
import { Redirect } from 'react-router-dom';

import QueryMe from '../containers/Query.Me';

import Mutate from '../contexts/Mutation';

import ProfileForm from '../forms/Profile';

export default function SignupPage() {
  return (
    <QueryMe>
      {({ data }) =>
        data.me ? (
          <Redirect to="/" />
        ) : (
          <section>
            <Mutate>
              {mutate => (
                <ProfileForm
                  onSubmit={({ handle, password }) =>
                    mutate.signup({
                      variables: {
                        profile: {
                          handle,
                          password,
                        },
                      },
                      updateQueries: {
                        me: (prev, { mutationResult }) => ({
                          me: mutationResult.data.signup,
                        }),
                      },
                      // update(proxy, results) {
                      //   // update query.
                      // },
                    })
                  }
                />
              )}
            </Mutate>
          </section>
        )
      }
    </QueryMe>
  );
}
