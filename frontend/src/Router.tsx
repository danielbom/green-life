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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import useLoadingAsync from './hooks/useLoadingAsync'

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
let isRefreshing = false

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
        if (!error.response || isRefreshing) return Promise.reject(error)

        if (error.response.status === 401) {
          if (error.response.config.url !== '/api/auth/login' && error.response.config.url !== '/api/auth/refresh') {
            if (!isRefreshing) {
              const refreshToken = refreshTokenStore.get()
              if (refreshToken) {
                try {
                  isRefreshing = true
                  api.setToken(refreshToken)
                  const response = await api.auth.refresh()
                  refreshTokenStore.set(response.data.refresh_token)
                  tokenStore.set(response.data.access_token)
                  api.setToken(response.data.access_token)
                  return api.httpClient.request(error.response.config)
                } catch (error) {
                } finally {
                  isRefreshing = false
                }
              }
              tokenStore.remove()
              refreshTokenStore.remove()
              navigate(paths.login)
              return Promise.reject(error)
            }
          }
        }

        return api.httpClient.request(error.response.config)
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
      console.log('Token is not set')
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
  const [isLoadingAsyncAction, wrapAsyncAction] = useLoadingAsync()
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<ItemId>('home')
  const navigate = useNavigate()
  const { data } = useQuery(['auth', 'me'], () => api.auth.me())
  const queryClient = useQueryClient()
  const user = data?.data

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
        initialValues={user}
        open={userModalOpen}
        isLoading={isLoadingAsyncAction}
        onClose={(event, values) => {
          wrapAsyncAction(async () => {
            if (event === 'close') {
              setUserModalOpen(false)
              return
            }
            if (event === 'submit') {
              if (!values) {
                throw new Error('values is null')
              }
              setUserModalOpen(false)
              try {
                const response = await api.auth.update({
                  cellphone: values.cellphone,
                  email: values.email === user?.email ? undefined : values.email,
                  name: values.name,
                  password: values.password || undefined,
                })

                refreshTokenStore.set(response.data.refresh_token)
                tokenStore.set(response.data.access_token)
                api.setToken(response.data.access_token)
                queryClient.invalidateQueries({ queryKey: ['auth', 'me'], exact: false })
              } catch (error) {
                // TODO: show error
                console.error(error)
              }
            }
          })
        }}
      />
    </Layout>
  )
}
