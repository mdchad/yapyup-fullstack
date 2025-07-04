/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

import { Route as rootRouteImport } from './routes/__root'
import { Route as ProtectedRouteRouteImport } from './routes/_protected/route'
import { Route as ProtectedIndexRouteImport } from './routes/_protected/index'
import { Route as AuthSigninhandlerRouteImport } from './routes/auth/signinhandler'
import { Route as AuthSignUpRouteImport } from './routes/auth/sign-up'
import { Route as AuthSignInRouteImport } from './routes/auth/sign-in'
import { Route as AuthSetOrganisationRouteImport } from './routes/auth/set-organisation'
import { Route as AuthResetPasswordRouteImport } from './routes/auth/reset-password'
import { Route as AuthForgotPasswordRouteImport } from './routes/auth/forgot-password'
import { Route as AuthCreateOrganisationRouteImport } from './routes/auth/create-organisation'
import { Route as AuthAcceptInvitationInvitationIdRouteImport } from './routes/auth/accept-invitation.$invitationId'

const ProtectedNotesLazyRouteImport = createFileRoute('/_protected/notes')()
const ProtectedChatLazyRouteImport = createFileRoute('/_protected/chat')()
const ProtectedOrgOrgIdTeamLazyRouteImport = createFileRoute(
  '/_protected/org/$orgId/team',
)()
const ProtectedOrgOrgIdBillingLazyRouteImport = createFileRoute(
  '/_protected/org/$orgId/billing',
)()
const ProtectedUserUserIdOrgOrgIdLazyRouteImport = createFileRoute(
  '/_protected/user/$userId/org/$orgId',
)()

const ProtectedRouteRoute = ProtectedRouteRouteImport.update({
  id: '/_protected',
  getParentRoute: () => rootRouteImport,
} as any)
const ProtectedIndexRoute = ProtectedIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => ProtectedRouteRoute,
} as any)
const ProtectedNotesLazyRoute = ProtectedNotesLazyRouteImport.update({
  id: '/notes',
  path: '/notes',
  getParentRoute: () => ProtectedRouteRoute,
} as any).lazy(() =>
  import('./routes/_protected/notes.lazy').then((d) => d.Route),
)
const ProtectedChatLazyRoute = ProtectedChatLazyRouteImport.update({
  id: '/chat',
  path: '/chat',
  getParentRoute: () => ProtectedRouteRoute,
} as any).lazy(() =>
  import('./routes/_protected/chat.lazy').then((d) => d.Route),
)
const AuthSigninhandlerRoute = AuthSigninhandlerRouteImport.update({
  id: '/auth/signinhandler',
  path: '/auth/signinhandler',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthSignUpRoute = AuthSignUpRouteImport.update({
  id: '/auth/sign-up',
  path: '/auth/sign-up',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthSignInRoute = AuthSignInRouteImport.update({
  id: '/auth/sign-in',
  path: '/auth/sign-in',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthSetOrganisationRoute = AuthSetOrganisationRouteImport.update({
  id: '/auth/set-organisation',
  path: '/auth/set-organisation',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthResetPasswordRoute = AuthResetPasswordRouteImport.update({
  id: '/auth/reset-password',
  path: '/auth/reset-password',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthForgotPasswordRoute = AuthForgotPasswordRouteImport.update({
  id: '/auth/forgot-password',
  path: '/auth/forgot-password',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthCreateOrganisationRoute = AuthCreateOrganisationRouteImport.update({
  id: '/auth/create-organisation',
  path: '/auth/create-organisation',
  getParentRoute: () => rootRouteImport,
} as any)
const AuthAcceptInvitationInvitationIdRoute =
  AuthAcceptInvitationInvitationIdRouteImport.update({
    id: '/auth/accept-invitation/$invitationId',
    path: '/auth/accept-invitation/$invitationId',
    getParentRoute: () => rootRouteImport,
  } as any)
const ProtectedOrgOrgIdTeamLazyRoute =
  ProtectedOrgOrgIdTeamLazyRouteImport.update({
    id: '/org/$orgId/team',
    path: '/org/$orgId/team',
    getParentRoute: () => ProtectedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_protected/org.$orgId.team.lazy').then((d) => d.Route),
  )
const ProtectedOrgOrgIdBillingLazyRoute =
  ProtectedOrgOrgIdBillingLazyRouteImport.update({
    id: '/org/$orgId/billing',
    path: '/org/$orgId/billing',
    getParentRoute: () => ProtectedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_protected/org.$orgId.billing.lazy').then((d) => d.Route),
  )
const ProtectedUserUserIdOrgOrgIdLazyRoute =
  ProtectedUserUserIdOrgOrgIdLazyRouteImport.update({
    id: '/user/$userId/org/$orgId',
    path: '/user/$userId/org/$orgId',
    getParentRoute: () => ProtectedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_protected/user.$userId.org.$orgId.lazy').then(
      (d) => d.Route,
    ),
  )

export interface FileRoutesByFullPath {
  '/auth/create-organisation': typeof AuthCreateOrganisationRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/auth/set-organisation': typeof AuthSetOrganisationRoute
  '/auth/sign-in': typeof AuthSignInRoute
  '/auth/sign-up': typeof AuthSignUpRoute
  '/auth/signinhandler': typeof AuthSigninhandlerRoute
  '/chat': typeof ProtectedChatLazyRoute
  '/notes': typeof ProtectedNotesLazyRoute
  '/': typeof ProtectedIndexRoute
  '/auth/accept-invitation/$invitationId': typeof AuthAcceptInvitationInvitationIdRoute
  '/org/$orgId/billing': typeof ProtectedOrgOrgIdBillingLazyRoute
  '/org/$orgId/team': typeof ProtectedOrgOrgIdTeamLazyRoute
  '/user/$userId/org/$orgId': typeof ProtectedUserUserIdOrgOrgIdLazyRoute
}
export interface FileRoutesByTo {
  '/auth/create-organisation': typeof AuthCreateOrganisationRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/auth/set-organisation': typeof AuthSetOrganisationRoute
  '/auth/sign-in': typeof AuthSignInRoute
  '/auth/sign-up': typeof AuthSignUpRoute
  '/auth/signinhandler': typeof AuthSigninhandlerRoute
  '/chat': typeof ProtectedChatLazyRoute
  '/notes': typeof ProtectedNotesLazyRoute
  '/': typeof ProtectedIndexRoute
  '/auth/accept-invitation/$invitationId': typeof AuthAcceptInvitationInvitationIdRoute
  '/org/$orgId/billing': typeof ProtectedOrgOrgIdBillingLazyRoute
  '/org/$orgId/team': typeof ProtectedOrgOrgIdTeamLazyRoute
  '/user/$userId/org/$orgId': typeof ProtectedUserUserIdOrgOrgIdLazyRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/_protected': typeof ProtectedRouteRouteWithChildren
  '/auth/create-organisation': typeof AuthCreateOrganisationRoute
  '/auth/forgot-password': typeof AuthForgotPasswordRoute
  '/auth/reset-password': typeof AuthResetPasswordRoute
  '/auth/set-organisation': typeof AuthSetOrganisationRoute
  '/auth/sign-in': typeof AuthSignInRoute
  '/auth/sign-up': typeof AuthSignUpRoute
  '/auth/signinhandler': typeof AuthSigninhandlerRoute
  '/_protected/chat': typeof ProtectedChatLazyRoute
  '/_protected/notes': typeof ProtectedNotesLazyRoute
  '/_protected/': typeof ProtectedIndexRoute
  '/auth/accept-invitation/$invitationId': typeof AuthAcceptInvitationInvitationIdRoute
  '/_protected/org/$orgId/billing': typeof ProtectedOrgOrgIdBillingLazyRoute
  '/_protected/org/$orgId/team': typeof ProtectedOrgOrgIdTeamLazyRoute
  '/_protected/user/$userId/org/$orgId': typeof ProtectedUserUserIdOrgOrgIdLazyRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/auth/create-organisation'
    | '/auth/forgot-password'
    | '/auth/reset-password'
    | '/auth/set-organisation'
    | '/auth/sign-in'
    | '/auth/sign-up'
    | '/auth/signinhandler'
    | '/chat'
    | '/notes'
    | '/'
    | '/auth/accept-invitation/$invitationId'
    | '/org/$orgId/billing'
    | '/org/$orgId/team'
    | '/user/$userId/org/$orgId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/auth/create-organisation'
    | '/auth/forgot-password'
    | '/auth/reset-password'
    | '/auth/set-organisation'
    | '/auth/sign-in'
    | '/auth/sign-up'
    | '/auth/signinhandler'
    | '/chat'
    | '/notes'
    | '/'
    | '/auth/accept-invitation/$invitationId'
    | '/org/$orgId/billing'
    | '/org/$orgId/team'
    | '/user/$userId/org/$orgId'
  id:
    | '__root__'
    | '/_protected'
    | '/auth/create-organisation'
    | '/auth/forgot-password'
    | '/auth/reset-password'
    | '/auth/set-organisation'
    | '/auth/sign-in'
    | '/auth/sign-up'
    | '/auth/signinhandler'
    | '/_protected/chat'
    | '/_protected/notes'
    | '/_protected/'
    | '/auth/accept-invitation/$invitationId'
    | '/_protected/org/$orgId/billing'
    | '/_protected/org/$orgId/team'
    | '/_protected/user/$userId/org/$orgId'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  ProtectedRouteRoute: typeof ProtectedRouteRouteWithChildren
  AuthCreateOrganisationRoute: typeof AuthCreateOrganisationRoute
  AuthForgotPasswordRoute: typeof AuthForgotPasswordRoute
  AuthResetPasswordRoute: typeof AuthResetPasswordRoute
  AuthSetOrganisationRoute: typeof AuthSetOrganisationRoute
  AuthSignInRoute: typeof AuthSignInRoute
  AuthSignUpRoute: typeof AuthSignUpRoute
  AuthSigninhandlerRoute: typeof AuthSigninhandlerRoute
  AuthAcceptInvitationInvitationIdRoute: typeof AuthAcceptInvitationInvitationIdRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_protected': {
      id: '/_protected'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof ProtectedRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_protected/': {
      id: '/_protected/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof ProtectedIndexRouteImport
      parentRoute: typeof ProtectedRouteRoute
    }
    '/_protected/notes': {
      id: '/_protected/notes'
      path: '/notes'
      fullPath: '/notes'
      preLoaderRoute: typeof ProtectedNotesLazyRouteImport
      parentRoute: typeof ProtectedRouteRoute
    }
    '/_protected/chat': {
      id: '/_protected/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ProtectedChatLazyRouteImport
      parentRoute: typeof ProtectedRouteRoute
    }
    '/auth/signinhandler': {
      id: '/auth/signinhandler'
      path: '/auth/signinhandler'
      fullPath: '/auth/signinhandler'
      preLoaderRoute: typeof AuthSigninhandlerRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/sign-up': {
      id: '/auth/sign-up'
      path: '/auth/sign-up'
      fullPath: '/auth/sign-up'
      preLoaderRoute: typeof AuthSignUpRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/sign-in': {
      id: '/auth/sign-in'
      path: '/auth/sign-in'
      fullPath: '/auth/sign-in'
      preLoaderRoute: typeof AuthSignInRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/set-organisation': {
      id: '/auth/set-organisation'
      path: '/auth/set-organisation'
      fullPath: '/auth/set-organisation'
      preLoaderRoute: typeof AuthSetOrganisationRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/reset-password': {
      id: '/auth/reset-password'
      path: '/auth/reset-password'
      fullPath: '/auth/reset-password'
      preLoaderRoute: typeof AuthResetPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/forgot-password': {
      id: '/auth/forgot-password'
      path: '/auth/forgot-password'
      fullPath: '/auth/forgot-password'
      preLoaderRoute: typeof AuthForgotPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/create-organisation': {
      id: '/auth/create-organisation'
      path: '/auth/create-organisation'
      fullPath: '/auth/create-organisation'
      preLoaderRoute: typeof AuthCreateOrganisationRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/auth/accept-invitation/$invitationId': {
      id: '/auth/accept-invitation/$invitationId'
      path: '/auth/accept-invitation/$invitationId'
      fullPath: '/auth/accept-invitation/$invitationId'
      preLoaderRoute: typeof AuthAcceptInvitationInvitationIdRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_protected/org/$orgId/team': {
      id: '/_protected/org/$orgId/team'
      path: '/org/$orgId/team'
      fullPath: '/org/$orgId/team'
      preLoaderRoute: typeof ProtectedOrgOrgIdTeamLazyRouteImport
      parentRoute: typeof ProtectedRouteRoute
    }
    '/_protected/org/$orgId/billing': {
      id: '/_protected/org/$orgId/billing'
      path: '/org/$orgId/billing'
      fullPath: '/org/$orgId/billing'
      preLoaderRoute: typeof ProtectedOrgOrgIdBillingLazyRouteImport
      parentRoute: typeof ProtectedRouteRoute
    }
    '/_protected/user/$userId/org/$orgId': {
      id: '/_protected/user/$userId/org/$orgId'
      path: '/user/$userId/org/$orgId'
      fullPath: '/user/$userId/org/$orgId'
      preLoaderRoute: typeof ProtectedUserUserIdOrgOrgIdLazyRouteImport
      parentRoute: typeof ProtectedRouteRoute
    }
  }
}

interface ProtectedRouteRouteChildren {
  ProtectedChatLazyRoute: typeof ProtectedChatLazyRoute
  ProtectedNotesLazyRoute: typeof ProtectedNotesLazyRoute
  ProtectedIndexRoute: typeof ProtectedIndexRoute
  ProtectedOrgOrgIdBillingLazyRoute: typeof ProtectedOrgOrgIdBillingLazyRoute
  ProtectedOrgOrgIdTeamLazyRoute: typeof ProtectedOrgOrgIdTeamLazyRoute
  ProtectedUserUserIdOrgOrgIdLazyRoute: typeof ProtectedUserUserIdOrgOrgIdLazyRoute
}

const ProtectedRouteRouteChildren: ProtectedRouteRouteChildren = {
  ProtectedChatLazyRoute: ProtectedChatLazyRoute,
  ProtectedNotesLazyRoute: ProtectedNotesLazyRoute,
  ProtectedIndexRoute: ProtectedIndexRoute,
  ProtectedOrgOrgIdBillingLazyRoute: ProtectedOrgOrgIdBillingLazyRoute,
  ProtectedOrgOrgIdTeamLazyRoute: ProtectedOrgOrgIdTeamLazyRoute,
  ProtectedUserUserIdOrgOrgIdLazyRoute: ProtectedUserUserIdOrgOrgIdLazyRoute,
}

const ProtectedRouteRouteWithChildren = ProtectedRouteRoute._addFileChildren(
  ProtectedRouteRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  ProtectedRouteRoute: ProtectedRouteRouteWithChildren,
  AuthCreateOrganisationRoute: AuthCreateOrganisationRoute,
  AuthForgotPasswordRoute: AuthForgotPasswordRoute,
  AuthResetPasswordRoute: AuthResetPasswordRoute,
  AuthSetOrganisationRoute: AuthSetOrganisationRoute,
  AuthSignInRoute: AuthSignInRoute,
  AuthSignUpRoute: AuthSignUpRoute,
  AuthSigninhandlerRoute: AuthSigninhandlerRoute,
  AuthAcceptInvitationInvitationIdRoute: AuthAcceptInvitationInvitationIdRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
