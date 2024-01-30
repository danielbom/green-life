import { createBrowserRouter, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router-dom'

import { MainPage } from './pages/main'
import { PeoplesPage } from './pages/peoples'
import { ToolsPage } from './pages/tools'
import { TerrainsPage } from './pages/terrains'
import { TerrainsShowPage } from './pages/terrains-show'
import { TerrainsRegisterPage } from './pages/terrains-register'
import { SeedsPage } from './pages/seeds'
import { LoginPage } from './pages/login'
import { RegisterPage } from './pages/register'
import { ForgotPasswordPage } from './pages/forgot-password'
import { DonateTerrainPage } from './pages/donate-terrain'
import { VoluntaryRequestPage } from './pages/voluntary-request'

import { Layout } from './layout/Layout'
import { ItemId } from './layout/Layout/Drawer'
import { useEffect, useState } from 'react'
import ModalUserUpdate from './components/ModalUserUpdate'
import { api, AuthLoginResponse } from './services/api'
import { KeyStore } from './utilities/storage'
import LandingPage from './pages/landing'

export const paths = {
  home: '/home',
  peoples: '/peoples',
  tools: '/tools',
  terrains: '/terrains',
  terrainsShow: '/terrains/:id',
  terrainsRegister: '/terrains-register',
  seeds: '/seeds',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  donateTerrain: '/donate-terrain',
  voluntaryRequest: '/voluntary-request',
  landing: '/',
}

const menuPaths: Record<ItemId, string> = {
  home: paths.home,
  peoples: paths.peoples,
  tools: paths.tools,
  terrains: paths.terrains,
  seeds: paths.seeds,
}

const router = createBrowserRouter([
  {
    path: paths.landing,
    element: <LandingPage />,
  },
  {
    path: '',
    element: <AuthOutlet />,
    children: [
      {
        path: paths.login,
        element: <LoginPage />,
      },
      {
        path: paths.register,
        element: <RegisterPage />,
      },
      {
        path: paths.forgotPassword,
        element: <ForgotPasswordPage />,
      },
      {
        path: paths.donateTerrain,
        element: <DonateTerrainPage />,
      },
      {
        path: paths.voluntaryRequest,
        element: <VoluntaryRequestPage />,
      },
      {
        path: '',
        element: <LayoutOutlet />,
        children: [
          {
            path: paths.home,
            element: <MainPage />,
          },
          {
            path: paths.seeds,
            element: <SeedsPage />,
          },
          {
            path: paths.terrains,
            element: <TerrainsPage />,
          },
          {
            path: paths.terrainsShow,
            element: <TerrainsShowPage />,
          },
          {
            path: paths.tools,
            element: <ToolsPage />,
          },
          {
            path: paths.peoples,
            element: <PeoplesPage />,
          },
          {
            path: paths.terrainsRegister,
            element: <TerrainsRegisterPage />,
          },
        ],
      },
    ],
  },
])

export function Router() {
  return <RouterProvider router={router} />
}

const tokenStore = KeyStore.local('token')
const refreshTokenStore = KeyStore.local('refreshToken')

function AuthOutlet() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Redirect to home if authenticated on login
    const token = tokenStore.get()
    if (token) {
      api.setToken(token)
      if (location.pathname === paths.login) {
        api.auth
          .me()
          .then(() => navigate(paths.home))
          .catch(() => tokenStore.remove())
      }
    }
  }, [])

  useEffect(() => {
    // Save token on login
    const id = api.httpClient.interceptors.response.use((response) => {
      if (response.config.url === '/api/auth/login') {
        const data = response.data as AuthLoginResponse
        tokenStore.set(data.access_token)
        api.setToken(data.access_token)
      }
      return response
    })
    return () => api.httpClient.interceptors.response.eject(id)
  }, [])

  useEffect(() => {
    // Handle 401
    const id = api.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response) return Promise.reject(error)

        let isRefreshing = false

        if (error.response.status === 401) {
          if (error.response.config.url !== '/api/auth/login' && error.response.config.url !== '/api/auth/refresh') {
            const refreshToken = refreshTokenStore.get()
            if (refreshToken) {
              try {
                api.setToken(refreshToken)
                const response = await api.auth.refresh()
                refreshTokenStore.set(response.data.refresh_token)
                tokenStore.set(response.data.access_token)
                api.setToken(response.data.access_token)
                isRefreshing = true
              } catch (error) {}
            }
          }
        }

        if (isRefreshing) {
          return api.httpClient.request(error.response.config)
        } else {
          tokenStore.remove()
          refreshTokenStore.remove()
          navigate(paths.login)
          return Promise.reject(error)
        }
      },
    )
    return () => api.httpClient.interceptors.response.eject(id)
  }, [])

  return <Outlet />
}

function PrivatePage({ children }: { children: React.ReactNode }): JSX.Element | null {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!api.isTokenSet()) {
      // This must happens very fast
      const id = setTimeout(() => {
        if (!api.isTokenSet()) navigate(paths.login)
        else setIsAuthenticated(true)
      }, 10)
      return () => clearTimeout(id)
    } else {
      setIsAuthenticated(true)
    }
  }, [])

  if (!isAuthenticated) return null

  return children as JSX.Element
}

function LayoutOutlet() {
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<ItemId>('home')
  const navigate = useNavigate()

  useEffect(() => {
    const currentPath = router.state.location.pathname
    const result = Object.entries(menuPaths).find(([_, value]) => currentPath.startsWith(value))
    if (!result) {
      throw new Error(`Path ${currentPath} not found`)
    }
    setActiveItem(result[0] as ItemId)
  }, [])

  return (
    <Layout
      activeItem={activeItem}
      onClickItem={(item) => {
        setActiveItem(item.id)
        navigate(menuPaths[item.id])
      }}
      onClickMenu={(event) => {
        switch (event) {
          case 'user':
            setUserModalOpen(true)
            break
          case 'exit':
            navigate(paths.landing)
            tokenStore.remove()
            break
        }
      }}
    >
      <PrivatePage>
        <Outlet />
      </PrivatePage>
      <ModalUserUpdate
        open={userModalOpen}
        onClose={(event, _payload) => {
          switch (event) {
            case 'close':
              setUserModalOpen(false)
              break
            case 'submit':
              setUserModalOpen(false)
              break
          }
        }}
      />
    </Layout>
  )
}
