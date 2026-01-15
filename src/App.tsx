import HomePage from "@/pages/home/HomePage"
import { Route, Routes } from "react-router-dom"
import AuthCallbackPage from "@/pages/auth-callback/AuthCallbackPage"
import MainLayout from "./layout/MainLayout"
import ChatPage from "./pages/chat/ChatPage"
import AlbumPage from "./pages/album/AlbumPage"
import AdminPage from "./pages/admin/AdminPage"
import { Toaster } from "react-hot-toast"
import PlaylistPage from "./pages/playlist/PlaylistPage"
import ShowAllPage from "./pages/album/ShowAllPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/showall" element={<ShowAllPage />} />
          <Route path="/playlists/:playlistId" element={<PlaylistPage />} />
        </Route>
      </Routes>

      <Toaster />
    </>
  )
}

export default App
