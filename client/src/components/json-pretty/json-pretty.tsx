import { pretty } from '../../helpers/pretty.helper';


interface IJsonPrettyProps { src: any }
export function JsonPretty(props: IJsonPrettyProps): JSX.Element {
  const { src } = props;
  return <pre>{pretty(src)}</pre>
}
