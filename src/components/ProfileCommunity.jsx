import React from 'react'
import CommunityPost from './CommunityPost'

const ProfileCommunity = () => {
  return (
    <div className='flex flex-col gap-8 sm:mx-12 mt-4'>
      <CommunityPost/>
      <CommunityPost/>
      <CommunityPost/>
      <CommunityPost/>
    </div>
  )
}

export default ProfileCommunity
