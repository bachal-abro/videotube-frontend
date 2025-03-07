import React from 'react'
import VideosGrid from './containers/VideosGrid'
import Playlist from './Playlist'

const ProfilePlaylists = () => {
  return (
    <div className="mx-1 sm:mx-8 sm:mr-12">
      <h2 className="mb-4 text-white text-xl font-medium">Created playlists</h2>
      <VideosGrid>
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
        <Playlist />
      </VideosGrid>
    </div>
  )
}

export default ProfilePlaylists
