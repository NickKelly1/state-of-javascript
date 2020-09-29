import { Link, LinkTypeMap } from "@material-ui/core";
import { DefaultComponentProps } from "@material-ui/core/OverridableComponent";
import { PropsWithChildren } from "react";
import { $FIXME } from "../../types/$fix-me.type";
import { OrNullable } from "../../types/or-nullable.type";
import { PropsWithStringableChildren } from "../../types/props-with-stringable-children.type";


export type IMaybeLinkProps = Omit<PropsWithStringableChildren<DefaultComponentProps<LinkTypeMap>>, 'href'> & { href: OrNullable<string> };

export function MaybeLink(props: IMaybeLinkProps): JSX.Element | null {
  const { children, href, ...linkProps } = props;

  if (href) {
    return (
      <Link href={href} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (<>{children}</> as $FIXME<JSX.Element>) ?? null;
}