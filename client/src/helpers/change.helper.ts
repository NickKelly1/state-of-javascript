import { Dispatch, SetStateAction, ChangeEventHandler } from "react"

export const change = <S>(dispatch: Dispatch<SetStateAction<S>>, key: keyof S): (ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>) => (evt): void => {
  const value = evt.target.value;
  return dispatch(prev => ({ ...prev, [key]: value }));
}