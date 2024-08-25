'use client'

import ButtonBase from '@/components/Button'
 
export default function NotFound() {
  return (
    <div>
      <h2>Not Found 404</h2>
      <p>Could not find requested resource</p>
      <div>
        Go to <ButtonBase href="/">Home page</ButtonBase>
      </div>
    </div>
  )
}
