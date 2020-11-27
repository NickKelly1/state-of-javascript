import { pretty, pretty2 } from '../../helpers/pretty.helper';


interface IJsonPrettyProps { src: any }
export function JsonPretty(props: IJsonPrettyProps): JSX.Element {
  const { src } = props;
  return <pre>{pretty2(src)}</pre>
}
