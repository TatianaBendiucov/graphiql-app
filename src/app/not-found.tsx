'use client';

import ButtonBase from '@/components/Button';

export default function NotFound() {
  return (
    <div className="page-not-found">
      <h1>404</h1>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <div>
        Go to <ButtonBase href="/">Home page</ButtonBase>
      </div>
    </div>
  );
}
