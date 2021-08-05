import {
  FunctionComponentElement,
  CSSProperties,
} from 'react';

/* Styles */
import './index.scss';

interface FieldProps {
  htmlFor: string;
  label: string;
  children: FunctionComponentElement<any>;
  style?: CSSProperties;
}

interface IsRequiredFieldProps extends FieldProps {
  errorMessage: string;
  hasError: boolean
}

type Props = FieldProps | IsRequiredFieldProps

function isRequiredField(props: Props): props is IsRequiredFieldProps {
  return 'errorMessage' in props;
}

function getHasErrorFromProps(props: Props): props is IsRequiredFieldProps {
  return isRequiredField(props) && props.hasError;
}

function getAdditionalChildClassName (props: Props): string | undefined {
  if (getHasErrorFromProps(props)) {
    return 'error'
  }

  return undefined;
}

function getErrorSpanElement (props: Props): JSX.Element {
  if (getHasErrorFromProps(props)) {
    return <span className="has-error">{props.errorMessage}</span>;
  }

  return <></>;
}

export default function FieldInput(props: Props): JSX.Element {
  const { htmlFor, label, children, style = {} } = props;
  const { type: ChildComponent, props: childProps, ref  } = children;

  const inputClassName = { className: getAdditionalChildClassName(props)};
  const errorSpanElement = getErrorSpanElement(props);
  const additionalProps = isRequiredField(props) ? {'aria-required': true} : {}

  return (
    <div className="FieldInput-container" style={style}>
      <label htmlFor={htmlFor}>
        {errorSpanElement}
        {label}
      </label>
      <div className="input-element">
        <ChildComponent {...inputClassName} ref={ref} {...childProps} {...additionalProps} />
      </div>
    </div>
  );
}
