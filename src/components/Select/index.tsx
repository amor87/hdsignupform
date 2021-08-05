import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  MouseEvent,
  ReactElement,
} from 'react';

/* Styles */
import './index.scss';

export interface OptionProps {
  id: string,
  label: string,
}

const DEFAULT_OPTION: OptionProps = {
  id: '',
  label: '- Select one -',
}

interface SelectContextProps {
  selectedItem: OptionProps,
  setSelectedItem: (selectedItem: OptionProps) => void,
  hoveredItem: OptionProps | undefined,
  setHoveredItem: (selectedItem: OptionProps | undefined) => void,
  onSelectedOptionChange: (selectedItem: OptionProps) => void,
};

const SelectContext = createContext<SelectContextProps>({
  selectedItem: DEFAULT_OPTION,
  setSelectedItem: (selectedItem: OptionProps) => {},
  hoveredItem: undefined,
  setHoveredItem: (selectedItem: OptionProps | undefined) => {},
  onSelectedOptionChange: (selectedItem: OptionProps) => {},
});

function useSelectContext(): SelectContextProps {
  const context = useContext(SelectContext);

  return context;
}

export function Option(props: OptionProps): JSX.Element {
  const {
    selectedItem,
    setSelectedItem,
    hoveredItem,
    setHoveredItem,
    onSelectedOptionChange,
  } = useSelectContext();
  const isSelected = selectedItem.id === props.id;

  const handleOptionClick = (): void => {
    setSelectedItem(props);
    onSelectedOptionChange(props);
  };

  const handleMouseEnter = (): void => {
    setHoveredItem(props);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLLIElement, globalThis.MouseEvent>): void => {
    if (hoveredItem?.id === event.currentTarget.id) {
      setHoveredItem(undefined);
    }
  };

  return (
    <li
      key={props.id}
      role="option"
      aria-selected={isSelected}
      id={props.id}
      onClick={handleOptionClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>{props.label}</span>
    </li>
  );
}

export interface ForwardingSelectProps {
  resetToDefault: () => void;
}

interface Props {
  htmlFor: string,
  children: ReactElement<OptionProps>[],
  onSelectedOptionChange: (selectedItem: OptionProps) => void,
}


export default React.forwardRef<ForwardingSelectProps, Props>(
  (props: Props, forwardedRef: React.Ref<ForwardingSelectProps>): JSX.Element => {
    const { children, onSelectedOptionChange, htmlFor, ...otherProps } = props;
    const [isOpen, setIsOpen] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [selectedItem, setSelectedItem] = useState<OptionProps>(
      DEFAULT_OPTION
    );
    const [hoveredItem, setHoveredItem] = useState<OptionProps | undefined>();
    const containerClassName = `Select-container${isOpen ? ' is-open' : ''}`

    const handleClickOutside = (evt: globalThis.MouseEvent): void => {
      if (!divRef.current?.contains(evt.target as Node)) {
        setIsOpen(false);
      }
    }

    const handleOpenSelectClick = (): void => {
      setIsOpen(true);
    }

    const handleResetToDefault = (): void => {
      setSelectedItem(DEFAULT_OPTION);
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useImperativeHandle(forwardedRef, () => ({
      resetToDefault: handleResetToDefault,
    }));

    useEffect(() => {
      setIsOpen(false);
    }, [selectedItem])

    return (
      <SelectContext.Provider
        value={{
          selectedItem,
          setSelectedItem,
          hoveredItem,
          setHoveredItem,
          onSelectedOptionChange
        }}
      >
      <div className={containerClassName} ref={divRef} onClick={handleOpenSelectClick}>
        <div
          aria-label={htmlFor}
          role="combobox"
          aria-expanded={isOpen ? true : false}
          aria-owns="owned_listbox"
          aria-haspopup="listbox"
          aria-controls="owned_listbox"
        >
          <input
            {...otherProps}
            id={htmlFor}
            name={htmlFor}
            readOnly
            type="text"
            aria-autocomplete="list"
            aria-controls="owned_listbox"
            aria-activedescendant={hoveredItem?.id}
            value={selectedItem.label}
          />
           <div className="arrow" />
        </div>
        <ul role="listbox" id="owned_listbox">
          <Option {...DEFAULT_OPTION} />
          {children}
        </ul>
      </div>
      </SelectContext.Provider>
    );
  }
);
