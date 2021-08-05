import { ChangeEventHandler } from 'react';

/* Styles */
import './index.scss';

interface Props {
  id: string;
  label: string;
  value: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export default function Checkbox(props: Props): JSX.Element {
  const { id, label, ...checkboxProps } = props;
  return (
    <label className="Checkbox-container" htmlFor={id}>
      <span className="spanLabel">{label}</span>
      <input {...checkboxProps} type="checkbox" name={id} id={id} />
      <span className="checkmark"></span>
    </label>
  );
}
