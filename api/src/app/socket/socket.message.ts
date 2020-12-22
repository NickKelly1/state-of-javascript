
export enum SocketMessageType {
  permissions_updated = 'permissions_updated',
}
export type ISocketMessage = {
  type: SocketMessageType.permissions_updated,
  payload: undefined,
}