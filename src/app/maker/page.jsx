import React from 'react'
// import PageMaker from './maker'
import dynamic from 'next/dynamic'

const PageMaker = dynamic(
  () => import('./Maker'),
  { ssr: false }
)

const page = () => {
  return (
    <>
    <PageMaker/>
    </>
  )
}

export default page