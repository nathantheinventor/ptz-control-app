import { ReactNode, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

type ExpandableProps = {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
};

export function Expandable({
  children,
  title,
  actions,
}: ExpandableProps): JSX.Element {
  const [expanded, setExpanded] = useState(true);
  const toggle = () => setExpanded(!expanded);

  return (
    <div className="border border-solid rounded-lg p-2">
      <div className="flex">
        <div onClick={toggle} className="cursor-pointer flex-grow">
          <FontAwesomeIcon
            icon={expanded ? faChevronDown : faChevronRight}
            className="w-4"
          />
          <span className="ml-2">{title}</span>
        </div>
        {actions}
      </div>
      {expanded && children}
    </div>
  );
}
