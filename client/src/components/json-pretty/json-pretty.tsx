import { nodeify } from '../../helpers/nodeify.helper';
import { pretty } from '../../helpers/pretty.helper';
import { WithDefined } from '../with-defined/with-defined';


interface IJsonPrettyProps { src: object }
export function JsonPretty(props: IJsonPrettyProps): JSX.Element {
  const { src } = props;
  return <pre>{pretty(src)}</pre>
}
