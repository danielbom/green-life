import { api } from './index'
import _config from './_config'

function ignoreNotFound(error: unknown) {
  if (typeof error === 'object' && error !== null) {
    const message = (error as any).response.data.message
    if (message.endsWith(' not found')) {
      return
    }
  }
  return Promise.reject(error)
}

function ignoreUnprocessableEntity(error: unknown) {
  if (typeof error === 'object' && error !== null) {
    const status = (error as any).response.status
    if (status === 422) {
      return
    }
  }
  return Promise.reject(error)
}

async function testEndpointsMustExists() {
  const response = await api.auth.login({
    username: _config.username,
    password: _config.password,
  })
  api.setToken(response.data.access_token)
  const id = '000000000000000000000000'
  await api.auth.me()
  await api.bedSchedules.show(id).catch(ignoreNotFound)
  await api.bedSchedules.store({} as any).catch(ignoreUnprocessableEntity)
  await api.bedSchedules.update(id, {} as any).catch(ignoreUnprocessableEntity)
  await api.bedSchedules.delete(id).catch(ignoreNotFound)
  await api.groundsDonate.index({} as any)
  await api.groundsDonate.show(id).catch(ignoreNotFound)
  await api.groundsDonate.store({} as any).catch(ignoreUnprocessableEntity)
  await api.groundsDonate.update(id, {}).catch(ignoreNotFound)
  await api.groundsDonate.delete(id).catch(ignoreNotFound)
  await api.grounds.index({} as any)
  await api.grounds.show(id).catch(ignoreNotFound)
  await api.grounds.store({} as any).catch(ignoreUnprocessableEntity)
  await api.grounds.update(id, {}).catch(ignoreNotFound)
  await api.grounds.delete(id).catch(ignoreNotFound)
  await api.peoples.index({} as any)
  await api.peoples.show(id).catch(ignoreNotFound)
  await api.peoples.store({} as any).catch(ignoreUnprocessableEntity)
  await api.peoples.update(id, {}).catch(ignoreNotFound)
  await api.peoples.delete(id).catch(ignoreNotFound)
  await api.seeds.index({} as any)
  await api.seeds.show(id).catch(ignoreNotFound)
  await api.seeds.store({} as any).catch(ignoreUnprocessableEntity)
  await api.seeds.update(id, {}).catch(ignoreNotFound)
  await api.seeds.delete(id).catch(ignoreNotFound)
  await api.tools.index({} as any)
  await api.tools.show(id).catch(ignoreNotFound)
  await api.tools.store({} as any).catch(ignoreUnprocessableEntity)
  await api.tools.update(id, {}).catch(ignoreNotFound)
  await api.tools.delete(id).catch(ignoreNotFound)
  await api.users.index({} as any)
  await api.users.show(id).catch(ignoreNotFound)
  await api.users.store({} as any).catch(ignoreUnprocessableEntity)
  await api.users.update(id, {}).catch(ignoreNotFound)
  await api.users.delete(id).catch(ignoreNotFound)
  await api.voluntariesRequest.index({} as any)
  await api.voluntariesRequest.show(id).catch(ignoreNotFound)
  await api.voluntariesRequest.store({} as any).catch(ignoreUnprocessableEntity)
  await api.voluntariesRequest.update(id, {}).catch(ignoreNotFound)
  await api.voluntariesRequest.delete(id).catch(ignoreNotFound)
  await api.voluntariesUsingSeeds.index({} as any)
  await api.voluntariesUsingSeeds.show(id).catch(ignoreNotFound)
  await api.voluntariesUsingSeeds.start({} as any).catch(ignoreUnprocessableEntity)
  await api.voluntariesUsingSeeds.end(id).catch(ignoreNotFound)
  await api.voluntariesUsingSeeds.delete(id).catch(ignoreNotFound)
  await api.voluntariesUsingTools.index({} as any)
  await api.voluntariesUsingTools.show(id).catch(ignoreNotFound)
  await api.voluntariesUsingTools.start({} as any).catch(ignoreUnprocessableEntity)
  await api.voluntariesUsingTools.end(id).catch(ignoreNotFound)
  await api.voluntariesUsingTools.delete(id).catch(ignoreNotFound)
  await api.voluntaries.index({} as any)
  await api.voluntaries.show(id).catch(ignoreNotFound)
  await api.voluntaries.store({} as any).catch(ignoreUnprocessableEntity)
  await api.voluntaries.update(id, {}).catch(ignoreNotFound)
  await api.voluntaries.delete(id).catch(ignoreNotFound)

  console.log('All endpoints exists')
}

testEndpointsMustExists()
