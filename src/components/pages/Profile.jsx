import React from 'react';
import { Redirect } from 'react-router-dom';

import QueryMe from '../containers/Query.Me';

import ProfileView from '../views/Profile';

export default function ProfilePage() {
  return (
    <section>
      <QueryMe>
        {data =>
          data.me ? <ProfileView me={data.me} /> : <Redirect to="/login" />
        }
      </QueryMe>
    </section>
  );
}
