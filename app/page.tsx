import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <Link href={'/appointment/reminder/demo-class'} className='bg-red-500 p-2 grid grid-cols-1'>
      Hello World!
    </Link>
  )
}

export default page
